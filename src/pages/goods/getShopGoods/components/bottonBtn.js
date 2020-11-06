import React from 'react'
import {View} from "@tarojs/components";
import './../index.scss'
export default (props) => {
  return (
    <View className='goods_bottom_btnBox'>
      <View className='goods_bottom_btn'>
        <View className='goods_submit color2'>
          删除订单
        </View>
      </View>
    </View>
  )
}
