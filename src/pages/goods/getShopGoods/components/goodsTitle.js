import React from 'react'
import {View} from "@tarojs/components";
import './../index.scss'
export default (props) => {
  return (
    <View className='goodsTitle_top'>
      <View className='goodsTitle_status'>
        <View className='goodsTitle_iconBox goodsTitle_icon1'></View>
        <View className='goodsTitle_font'>已完成</View>
      </View>
      <View className='goodsTitle_dec'>
        到店支付已完成
      </View>
    </View>
  )
}
