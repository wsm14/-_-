import {Text, View} from "@tarojs/components";
import React from "react";
import './index.scss'
export default ({title,Components,close,btn}) => {
  return (
    <View className='dakale_toasts'  onClick={() => close()}>
      <View className='dakale_layer'  onClick={(e) => e.stopPropagation()}>
        <View className='dakale_layer_toast'>
          <View className='dakale_layer_title font32 bold color1'>{title}</View>
          {Components()}
          <View className='dakale_layer_btn color6 font32' onClick={(e) =>close()}>
            {btn||'知道了'}
          </View>
        </View>
      </View>
    </View>
  )
}
