import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Button, Image, Text, Swiper, SwiperItem, Input} from '@tarojs/components'
import './index.scss'
import PayGo from '@/components/pay_btn'
import classNames from 'classnames'
import {getReserveOrder, saveScanCodeOrder} from '@/server/goods'
import {backgroundObj, goBack, toast, navigateTo, redirectTo} from "@/common/utils";

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      reserveOrderResult: {},
      httpData: {
        merchantId: getCurrentInstance().router.params.merchantId || '',
        totalFee: 0,
        useBeanStatus: '0'
      }
    }
  }

  componentWillMount() {
    if (!getCurrentInstance().router.params.merchantId) {
      goBack(() => (toast('参数缺失')))
    }
  }

  componentDidShow() {
    this.getUserDetails()
  }

  setBean() {
    const {useBeanStatus} = this.state.httpData
    if (useBeanStatus === '0') {
      this.setState({
        httpData: {
          ...this.state.httpData,
          useBeanStatus: '1'
        }
      })
    } else {
      this.setState({
        httpData: {
          ...this.state.httpData,
          useBeanStatus: '0'
        }
      })
    }
  }

  getUserDetails() {
    getReserveOrder({
      ...getCurrentInstance().router.params
    }, res => {
      const {reserveOrderResult} = res
      this.setState({
        reserveOrderResult
      })
    })
  }

  saveScanCodeOrder() {
    const {totalFee, useBeanStatus} = this.state
    if (totalFee !== 0) {
      saveScanCodeOrder(this.state.httpData, res => {
        const {
          status,
          orderSn,
          orderType,
          payMonth
        } = res
        if (status === '0'||status === '5') {
          redirectTo(`/pages/goods/code_wx_pay/index?payMonth=${payMonth}&orderType=${orderType}&orderSn=${orderSn}`)

        } else {
          redirectTo(`/pages/goods/code_scanPay_Susccess/index?orderSn=${orderSn}`)
        }
      })
    } else {
      toast('输入金额不能为0')
    }
  }

  errorToast(e) {

  }

  render() {
    const {
      status, reserveOrderResult, reserveOrderResult: {
        merchantName,
        merchantId,
        merchantImg,
        userRewardBean
      },
      httpData: {
        useBeanStatus
      }
    } = this.state
    if (Object.keys(reserveOrderResult).length > 0) {
      return (
        <View className='codePay_box'>
          <View className='codePay_top'>
            <View className='codePay_merchantDetails'>
              <View className='codePay_merchantDetail_shopIcon dakale_nullImage'
                    style={merchantImg ? backgroundObj(merchantImg) : {}}></View>
              <View className='codePay_merchantDetail_font'>
                <View className='codePay_merchantDetail_title font_hide'>{merchantName || '--'}</View>
                <View className='codePay_merchantDetail_tishi'>请核实商户信息后进行付款</View>
              </View>

            </View>
            <View className='codePay_mount'>金额</View>
            <View className='codePay_inputBox'>
              <Text className='codePay_mountAfter color1 font28'>¥</Text>
              <Input onBlur={(e) => {
                this.setState({httpData: {...this.state.httpData, totalFee: e.detail.value}})
              }} type={'digit'} className='codePay_inputStyle'></Input>
            </View>
            <View className='codePay_inputLiner'></View>
          </View>
          <View className='codePay_bean' onClick={() => this.setBean()}>
            <View className='codePay_bean_title color1 bold'>卡豆抵扣</View>
            <View
              className='font24 color2 codePay_bean_font'>可用{userRewardBean}卡豆抵扣卡豆{parseInt(userRewardBean) / 100}元</View>
            <View
              className={classNames('codePay_pay_iconBox', useBeanStatus === '0' ? 'codePay_pay_icon1' : 'codePay_pay_icon2')}></View>
          </View>
          <PayGo content={'确认支付'} click={() => this.saveScanCodeOrder()}></PayGo>
        </View>
      )
    } else {
      return null
    }
  }
}

export default Index
