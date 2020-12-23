import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
import {toast,getDom,goBack,mapGo} from "@/common/utils";

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      merchantDetails: {
        ...getCurrentInstance().router.params
      }
    }
  }
  render() {
    const {merchantDetails:{
      merchantLnt,
      merchantLat,
      merchantAddress,
      merchantName
    }} = this.state
    return (
      <View className='abnormalStatus_box'>
        <View className='abnormalStatus_card'></View>
        <View className='abnormalStatus_font'>抱歉～不在打卡范围内</View>
        <View className='abnormalStatus_click public_auto'>
          <View className='abnormalStatus_click_left  abnormalStatus_click_box' onClick={() => goBack()}>取消</View>
          <View className='abnormalStatus_click_right abnormalStatus_click_box' onClick={() => mapGo({
            lat: merchantLat,
            lnt:  merchantLnt,
            address: merchantAddress,
            name: merchantName
          })}>去导航</View>
        </View>
      </View>
    )
  }
}

export default Index
