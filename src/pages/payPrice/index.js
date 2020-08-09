import {wxapiGet,wxapiPost} from './../../api/api'
import ajax from './../../api/request'
import Ajax from "../../api/request";
import Utils from "../../utils/utils";
import Taro from "@tarojs/taro";
const app = getApp()
const AdaPay = require('./adaPay.js')
// const AdaPay = require('../../../AdaPay-wechat-SDK/AdaPay.js')

Page({
  data: {
    code: '',
    pay_amt: '0.01',
    orderSn: '',
    payMonth: '',
    payType: 'wx_lite',
    details: {
      merchantName: '哒卡乐'
    },
    payStatus:{
     type: 'price',
     value: '0'
    },
    payString:JSON.stringify({
      type: 'price',
      value: '0'
    })
  },
  onLoad: function (option) {
    let self = this
    if(option.orderSn && option.payMonth){
      self.setData({
        orderSn: option.orderSn,
        payMonth: option.payMonth,
      })
    }
    else {
      Utils.Toast('错误提示：缺少app传入参数')
    }
  },
  onShow: function () {
    let self = this
    self.creatGoodsDetails();
    wx.hideHomeButton()
    self.onHttpStatus();
  },
  // 判断是否已经获取当前用户的 openid，如果已经存在直接下单，如果没有先获取 openid 再下单
  getUserInfo() {
    let self = this
      wx.login({
        success: function (res) {
          if (res.code) {
            self.setData({
              code: res.code,
            }, () => {
              // 去下单
              self.creatOrder()
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
  },
  // 输入金额监听，必须输入带两位小数点
  bindInput(e) {
    this.setData({
      pay_amt: e.detail.value
    })
  },
  // 下单请求
  creatOrder() {
    let self = this
    let { code } = this.data
    let url = '';
    if(self.data.details.orderType && self.data.details.orderType=='goods'){
      url = wxapiPost.wechatPayDelayOrder
    }
    else{
      url = wxapiPost.wechatPayOrder
    }
    Ajax({
      data: {orderSn:this.data.orderSn,payType:'wx_lite',wechatCode:code},
      url: url
    }, 'post').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success, resultDesc} = res.data
          if (success &&  res.data.content.status==='succeeded') {
            let payment = res.data.content
            self.setData({
              payment: payment
            })
            AdaPay.doPay(payment, (res) => {
              if(res.result_status == 'succeeded'){
                self.setData({
                  payStatus: {
                    type: 'price',
                    value: '1',
                  },
                  payString:JSON.stringify({
                    type: 'price',
                    value: '1'
                  })
                })
              }
              else {
                Utils.Toast(res.result_message)
              }
            })
          }
          else {
            Utils.Toast(resultDesc||res.data.content.error_msg)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  },
  //订单详情
  onHttpStatus() {
    let self = this;
    wx.onNetworkStatusChange(function (res){
      const {isConnected,networkType} = res
       if(isConnected == false && networkType =='none'){
         wx.showToast({
           title: '网络错误',
           icon: 'none',
           duration: 2000
         })
       }
       else {
         if(Object.keys(self.data.details).length<5){
           self.creatGoodsDetails();
         }
       }
    })
  },
  //监听网络状态
  creatGoodsDetails() {
    let self = this
    if(self.data.payMonth.length>0 && self.data.orderSn.length>0){
      const {orderSn,payMonth} = self.data
      Ajax({
        data: {orderSn,payMonth},
        url: wxapiGet.wechatPrepaymentResult
      }, 'get').then(
        res => {
          const {errMsg} = res
          if (errMsg === 'request:ok') {
            const {success, resultDesc} = res.data
            if (success) {
              self.setData({
                details: {
                  ...res.data.content.orderResult,
                  merchantName:res.data.content.orderResult.merchantName||'哒卡乐'
                },
              })
            } else {
              Utils.Toast(resultDesc)
            }
          }
        }
      ).catch(e =>{
        Utils.Toast(e)
      })
    }
    else{
      Utils.Toast('错误提示：缺少app传入参数')
    }
  },
})
