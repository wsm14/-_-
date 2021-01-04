import React,{useState} from "react";
import {View} from "@tarojs/components";
import './../index.scss'
export default (props) => {
  const {type} = props
  const shopFamily = {
     background: `url(https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon19.png) no-repeat`,
     backgroundSize: '100% 100%',
  }
  const userFamily = {
    background: `url(https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon18.png) no-repeat`,
    backgroundSize: '100% 100%',
  }
  return (
    <View className='consent_box'>
      <View style={type == 'shopFamily'?{...shopFamily}:{...userFamily}} className='consent_bg'></View>
      <View className='consent_toast'>{type !== 'shopFamily'? '暂无家人':'暂无家店'}</View>
      <View className='consent_getfamily'>{type !== 'shopFamily'? '快去发展你的家人吧～':'快去发展你的家店吧～'}</View>
    </View>
  )
}
