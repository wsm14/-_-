import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import {getOrderResult} from '@/server/goods'
import {backgroundObj, goBack, toast, navigateTo, redirectTo, switchTab} from "@/common/utils";
import Lovely from '@/components/lovely'

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      orderSn: getCurrentInstance().router.params.orderSn,
      orderResult: {}
    }
  }

  componentWillMount() {
    if (!getCurrentInstance().router.params.orderSn) {
      goBack(() => toast('参数缺失'))
    }
  }

  getOrderResult() {
    const {orderSn} = this.state
    getOrderResult({
      orderSn
    }, res => {
      const {orderResult} = res
      this.setState({
        orderResult
      })
    })
  }

  componentDidShow() {
    this.getOrderResult()
  }

  errorToast(e) {

  }

  render() {
    const {
      orderResult: {
        payFee,
        payTitle
      },
      orderResult
    } = this.state
    if (Object.keys(orderResult).length > 0) {
      return (
        <View className='code_scanPay_box'>
          <View className='code_scanPay_top'>
            <View className='code_scanPay_bg'></View>
            <View className='code_scanPay_payStatus font32'>
              {payTitle}
            </View>
            <View className='code_scanPay_payNum'>
              <Text className='code_scanPay_icon  font36 bold color1'>¥ </Text>
              <Text className='code_scanPay_font bold  color1'>{payFee}</Text>
            </View>
            <View className='code_scanPay_btnBox'>
              <View className='code_scanPay_btn' onClick={() => switchTab('/pages/index/user/index')}>返回首页</View>
              <View className='code_scanPay_btn'>查看订单</View>
            </View>
          </View>
          <View className='code_scanPay_loveMagin'>
            <Lovely title={'当前可买'}></Lovely>
          </View>

        </View>
      )
    } else {
      return null
    }

  }
}

export default Index
