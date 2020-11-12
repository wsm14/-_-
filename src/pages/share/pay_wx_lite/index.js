import React, {Component} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Button, Text, View} from "@tarojs/components";
import {wxapiPost,goods} from '@/api/api'
import {httpGet, httpPost} from '@/api/newRequest'
import {authWxLogin} from '@/common/authority'
const AdaPay = require('./../../payPrice/adaPay.js')
import './index.scss'
import InterTime from '@/components/InterTime'
import {toast,goBack,redirectTo} from "@/common/utils";
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
     orderSn: getCurrentInstance().router.params.orderSn,
     orderType: getCurrentInstance().router.params.orderType,
     token: getCurrentInstance().router.params.token,
     orderResult: {},
     payStatus: {
        type: 'price',
        value: '0',
      },
      text:''
    }
  }
  getOrderResult() {
    const {payWeex: {getKolOrderPrepayment}} = goods
    const {orderSn ,orderType ,token } = this.state
    httpGet({
      data: {
        orderSn:orderSn,
        orderType:orderType,
        token: token},
      url: getKolOrderPrepayment
    }, res => {
      const {orderResult } = res
      this.setState({
       orderResult
     })
    })
  }
  creatOrder(res) {
    let code  = res
    let that  = this
    const {wechatPayDelayOrder} = wxapiPost
    const {orderSn,token} = this.state
    httpPost({
      url: wechatPayDelayOrder,
      data: {orderSn:orderSn,payType:'wx_lite',wechatCode:code,token:token }},
      (result,data) => {
        const {success,resultDesc} = data
        if (success &&  data.content.status==='succeeded') {
          let payment = data.content
          AdaPay.doPay(payment, (payRes) => {
            if(payRes.result_status == 'succeeded'){
                const {id} = payRes
                 that.setState({
                   text:JSON.stringify(payRes),
                   payStatus: {
                     type: 'price',
                     value: '1',
                     id:id
                   },
                })
            }
          })
        }
        else {
          toast(resultDesc||data.content.error_msg)
        }
    })
  }
  payByKol(){
    authWxLogin(this.creatOrder.bind(this))
  }
  componentDidShow() {
    Taro.clearStorage(
      {
        success: res => {
          this.getOrderResult()
        }
      }
    )
  }
  render() {
    const {
      orderResult: {
      payFee,
      createTime,
      expiredTime},
      payStatus,
      text
    } = this.state
    return (
      <View className='pay_wx_lite'>
        {text}
        <View className='pay_wx_lite_price'>
          <View className='pay_title'>实付款</View>
          <View className='pay_price'><Text style={{display:'inline-block',fontSize:Taro.pxTransform(36)}}>¥</Text>{payFee}</View>
          <View className='pay_time'>支付剩余时间
            {createTime&& <InterTime mint={expiredTime}  times={createTime} fn={()=> {goBack()}}></InterTime>}
            {/**/}
          </View>
        </View>
        <Button
          appParameter={JSON.stringify(payStatus)}
          openType='launchApp' onError={(e) => {toast('返回异常')}} className='page_back_btn'>返回APP</Button>
        {payStatus.value === '0' &&
        <View className='pay_wx_lite_btn public_center' onClick={() => this.payByKol()}>
          <View className='pay_wx_lite_btnGo'>
            微信支付{" "}¥{payFee}</View>
        </View>
        }
      </View>
    )
  }
}

export default Index
