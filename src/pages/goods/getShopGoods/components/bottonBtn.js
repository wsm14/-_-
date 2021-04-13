import React from 'react'
import {View} from "@tarojs/components";
import './../index.scss'

export default ({remove}) => {
  return (
    <View className='goods_bottom_btnBox' onClick={() => remove()}>
      <View className='goods_bottom_btn'>
        <View className='goods_submit color2'>
          删除订单
        </View>
      </View>
    </View>
  )
}
