import React from 'react'
import {View,Text} from '@tarojs/components'
import './index.scss'
import {goBack} from "@/common/utils";
function Nav(props) {
  const {title} = props
  return (
    <View className='nav_box'>
      <View className='nav_back clearfix'>
        <View className='nav_back_icon' onClick={() => goBack()}></View>
        <View className='nav_back_title'>{title}</View>
      </View>
    </View>
  )
}
export default Nav
