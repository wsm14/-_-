import React from "react";
import {View} from "@tarojs/components";
import './index.scss'
export default (props) => {
  const { cancel,canfirm ,content} = props
  return (
    <View className='share'>
        <View className='stopBean_prompts'>
          <View className='prompts_title'>温馨提示</View>
          <View className='prompts_context'>{content?content : '观看完整视频可获得奖励'}</View>
          <View className='prompts_btn'>
            <View className='prompts_btn_out' onClick={() => cancel()}>放弃奖励</View>
            <View className='prompts_btn_now' onClick={() => canfirm()}>继续观看</View>
          </View>
        </View>
    </View>

  )
}
