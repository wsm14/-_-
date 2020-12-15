import React from "react";
import {Button, View} from "@tarojs/components";
import './../../index.scss'
export default (props) => {
  return (
    <View className='wraparound_nullStatus'>
      <View className='wraparound_nullStatusImage'></View>
      <View className='wraparound_nullStatus_font font28 color2'>没有当前状态的卡券哦~</View>
    </View>
  )
}

