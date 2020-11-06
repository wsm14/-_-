import React from 'react'
import {Text, View} from "@tarojs/components";
import './../index.scss'
export default (props) => {
  return (
    <View className='goods_card'>
      <View className='goods_cardBox'>
        <View className='font32 color1 bold'>订单信息</View>
        <View className='font24 public_auto goods_cardHeight'>
          <View className='color2'>订单号码</View>
          <View className='font24 public_center'>
            <Text className='color1'>12312893712937112321</Text>
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
            <View className='zPay pay_icon_box'></View>
            <View>支付宝支付</View>
          </View>
        </View>
        <View className='font24 public_auto goods_cardHeight'>
          <View className='color2'>支付时间</View>
          <View className='color1'> 2020-09-28  16:09:08</View>
        </View>
      </View>
    </View>
  )
}
