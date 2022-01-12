/*
* 底部支付按钮
* content 文字描述
* click 点击事件
*
*
* */
import React from "react";
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'
export default ({content ='',click}) =>{
  return (
    <View className='pay_goPay'>
      <View className='pay_goPayBtn' onClick={() =>click()}>
        {content}
      </View>
    </View>
  )
}
