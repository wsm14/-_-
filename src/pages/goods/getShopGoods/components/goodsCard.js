import React, {useEffect} from 'react'
import {Text, View} from "@tarojs/components";
import './../index.scss'
import Taro from "@tarojs/taro";
import classNames from "classnames";
import {toast} from "@/common/utils";
export default (props) => {
  const {data = {}} = props
  const {
    orderSn,
    payType,
    payTime,
  } = data
  const filterStyle = (str) => {
    switch (str) {
      case 'wx_lite':
        return '微信支付';
      case 'alipay':
        return '支付宝支付';
      case 'beanPay':
        return '卡豆支付';
    }
  }
  const setClipboard =(str) => {
    Taro.setClipboardData({
      data: str,
      success: function (res) {
        toast('已复制')
      },
      fail: function (res) {
        toast('复制失败')
      }
    })
  }
  return (
    <View className='goods_card'>
      <View className='goods_cardBox'>
        <View className='font32 color1 bold'>订单信息</View>
        <View className='font24 public_auto goods_cardHeight'>
          <View className='color2'>订单号码</View>
          <View className='font24 public_center' onClick={() =>setClipboard(orderSn)}>
            <Text className='color1'>{orderSn}</Text>
            <Text className='goods_cardliner'></Text>
            <Text className='color4'>复制</Text>
          </View>
        </View>
        <View className='font24 public_auto goods_cardHeight'>
          <View className='color2'>支付类型</View>
          <View className='color1'>到店支付</View>
        </View>
        <View className='font24 public_auto goods_payHeight'>
          <View className='color2'>支付方式</View>
          <View className='color1 public_center'>
            {payType !== 'beanPay' &&
            <View
              className={classNames('pay_icon_box', payType === 'wx_lite' && 'wPay', payType === 'alipay' && 'zPay')}></View>
            }
            <View>{filterStyle(payType)}</View>
          </View>
        </View>
        <View className='font24 public_auto goods_cardHeight'>
          <View className='color2'>支付时间</View>
          <View className='color1'> {payTime}</View>
        </View>
      </View>
    </View>
  )
}
