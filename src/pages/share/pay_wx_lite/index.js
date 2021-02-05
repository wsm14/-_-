import React, {Component} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Button, Text, View} from "@tarojs/components";
import {authWxLogin, internet} from '@/common/authority'
import {getOrderPrepaymentResult, payOrder, payDelayOrder} from '@/server/goods'
import './index.scss'
import {toast, goBack, redirectTo} from "@/common/utils";
import classNames from 'classnames'
const AdaPay = require('./../../payPrice/adaPay.js')

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      orderSn: getCurrentInstance().router.params.orderSn,
      orderType: getCurrentInstance().router.params.orderType,
      token: getCurrentInstance().router.params.token,
      payMonth: getCurrentInstance().router.params.payMonth || '',
      orderResult: {},
      payStatus: {
        type: 'price',
        value: '0',
      },
    }
  }

  getOrderResult() {
    const {orderSn, orderType, token, payMonth} = this.state
    getOrderPrepaymentResult({
      orderSn: orderSn,
      orderType: orderType,
      token: token,
      payMonth
    }, res => {
      const {orderResult} = res
      this.setState({
        orderResult
      })
    })
  }

  creatOrder(res) {
    let code = res
    let that = this
    const {orderType} = this.state
    if (orderType === 'scan') {
      that.scanPay(res)
    } else {
      that.goodsPay(res)
    }
  }

  goodsPay(res) {
    let that = this
    const {orderSn, token} = this.state
    payDelayOrder({orderSn: orderSn, payType: 'wx_lite', wechatCode: res, token}, result => {
      const {status, error_msg} = result
      if (status === 'succeeded') {
        AdaPay.doPay(result, (payRes) => {
          if (payRes.result_status == 'succeeded') {
            const {id} = payRes
            that.setState({
              payStatus: {
                type: 'price',
                value: '1',
                id: id
              },
            })
            Taro.setNavigationBarTitle({
              title: '支付成功'
            })
          }
        })
      } else {
        toast(error_msg || '支付失败')
      }
    })
  }

  scanPay(res) {
    let that = this
    const {orderSn, token, payMonth} = this.state
    payOrder({orderSn: orderSn, payMonth, payType: 'wx_lite', wechatCode: res, token}, result => {
      const {status, error_msg} = result
      if (status === 'succeeded') {
        AdaPay.doPay(result, (payRes) => {
          if (payRes.result_status == 'succeeded') {
            const {id} = payRes
            that.setState({
              payStatus: {
                type: 'price',
                value: '1',
                id: id
              },
            })
            Taro.setNavigationBarTitle({
              title: '支付成功'
            })
          }
        })
      } else {
        toast(error_msg || '支付失败')
      }
    })
  }

  payByKol() {
    authWxLogin(this.creatOrder.bind(this))
  }

  componentWillMount() {
    if (!getCurrentInstance().router.params.orderSn || !getCurrentInstance().router.params.orderType) {
      return toast('参数缺失，无法支付，请返回App')
    }
  }

  componentDidShow() {
    const {orderResult} = this.state
    Taro.clearStorage(
      {
        success: res => {
          this.getOrderResult()
        }
      }
    )
    internet(orderResult,() =>this.getOrderResult())
  }

  render() {
    const {
      orderResult: {
        payFee,
        merchantName,
        orderSn
      },
      payStatus,
      payStatus: {
        value
      },
      payMonth,
      orderType
    } = this.state
    const renders = {
      '0': (
        <>
          <Button
            appParameter={JSON.stringify(payStatus)}
            openType='launchApp' onError={(e) => {
            toast('返回异常')
          }} className='page_back_btn font32'>返回APP</Button>
          <View className='pay_wx_lite_btn public_center' onClick={() => this.payByKol()}>
            <View className='pay_wx_lite_btnGo font32 bold color6'>立即支付</View>
          </View>
        </>),
      '1': (
        <>
          <Button
            appParameter={JSON.stringify(payStatus)}
            openType='launchApp' onError={(e) => {
            toast('返回异常')
          }}
            className='page_back_bottomBtn color4 bold font32'>返回APP</Button>
        </>)
    }[value]
    return (
      <View className='pay_wx_lite'>
        {value === '1' &&
        <View className='pay_wx_successIcon'></View>
        }
        <View className={classNames('color1 bold',value ==='0'?'pay_wx_price':'pay_wx_successMargin')}>
          <View className='pay_wx_priceIcon'>¥</View>
          <View className='pay_wx_priceNum'>{payFee}</View>
        </View>
        <View className='pay_wx_goodsBox'>
          <View className='pay_wx_goods'>
            <View className='public_auto pay_wx_goodsDetails'>
              <View className='color1 font28'>收款方</View>
              <View className='color2 font28 font_hide pay_wx_maxWidth'>{merchantName}</View>
            </View>
            <View className='public_auto pay_wx_goodsDetails'>
              <View className='color1 font28'>订单编号</View>
              <View className='color2 font28'>{orderSn}</View>
            </View>
          </View>
        </View>
        {renders}
      </View>
    )
  }
}

export default Index
