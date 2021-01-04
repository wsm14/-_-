import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
import {toast,getDom,goBack} from "@/common/utils";

class Index extends Component {
  constructor() {
    super(...arguments)
  }
  render() {
    return (
      <View className='repeatStatus_box'>
        <View className='repeatStatus_card'></View>
        <View className='repeatStatus_font'>您已在本店打过卡了，换一家店试试</View>
      </View>
    )
  }
}

export default Index
