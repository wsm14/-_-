import React, {useEffect, useState} from "react";
import classNames from 'classnames'
import {backgroundObj} from '@/common/utils'
import {Text, View} from "@tarojs/components";
import './../index.scss'
export default (props) => {
 const {onClose,onCancel,visible} = props
  return (
    <View className='layer_box' onClick={() =>onClose()}>
      <View className={classNames(visible?'animated rollIn layer_center':'animated rollOut layer_center')} onClick={(e) =>{e.stopPropagation();}}>
        <View className='layer_font'>是否取消关注？</View>
        <View  className='layer_bottom'>
          <View className='layer_btn1' onClick={() =>onCancel()}>确认</View>
          <View className='layer_btn2' onClick={() =>onClose()}>再想想</View>
        </View>
      </View>
    </View>
  )
}
