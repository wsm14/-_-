import React ,{useEffect,useState} from 'react'
import {View} from "@tarojs/components";
import './index.scss'
export default (props) => {
  const {beanStatus,beanNum,interval} = props
  return (
    <View className='bean_box'>
      <View className='bean_Time'>
        {beanStatus === '1'? `已领取${beanNum||0}卡豆`:`观看${interval||0}秒后可捡${beanNum||0}卡豆`}
      </View>
    </View>
  )
}
