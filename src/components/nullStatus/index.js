/*
* color 字体颜色
* bgcolor 背景颜色
* fn回退点击事件
* title 标题名称
* */
import React from "react";
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'
export default (props) =>{
  return (
    <View className='null_box'>
      <View className='null_img'></View>
      <View className='null_font1'>空空如也</View>
      <View className='null_font2'>还没有内容哦～</View>
    </View>
  )
}
