import React from 'react'
import {View} from "@tarojs/components";
import './../index.scss'
export default (props) => {
  return (
    <View className='payTitle_top'>
      <View className='payTitle_status'>
        <View className='payTitle_iconBox payTitle_icon1'></View>
        <View className='payTitle_font'>支付成功</View>
      </View>
    </View>
  )
}