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
  const {type = ''} = props
  const template = {
    0: (
      <View className='null_box'>
        <View className='null_img1'></View>
        <View className='null_margin'>还没有任何分享哦</View>
      </View>
    ),
    1:(
      <View className='null_box'>
        <View className='null_img2'></View>
        <View className='null_margin'>还没有任何收藏哦</View>
      </View>
    ),
    2: (
      <View className='null_box'>
        <View className='null_img3'></View>
        <View className='null_margin'>还没有任何关注的店哦</View>
      </View>
    ),
    3:(
      <View className='null_box'>
        <View className='null_img4'></View>
        <View className='null_margin'>还没有任何打卡足迹哦</View>
      </View>
    ),
  }
  if(type||type===0){
     return  template[type]
  }
  else {
    return (
      <View className='null_box'>
        <View className='null_img'></View>
        <View className='null_font1'>空空如也</View>
        <View className='null_font2'>还没有内容哦～</View>
      </View>
    )
  }
 
}
