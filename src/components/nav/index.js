/*
* color 字体颜色
* bgcolor 背景颜色
* fn回退点击事件
* title 标题名称
* */
import React from "react";
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {goBack} from "@/common/utils";
import classNames from 'classnames'
import './index.scss'
export default (props) =>{
  const {style,title,fn,type} = props
  const defaultStyle = {
    background: '#FFFFFF',
    color: '#333333',
  }
  return (
    <View style={style||defaultStyle} className='nav_box'>
      <View className='nav_back clearfix'>
        <View onClick={() => fn ? fn() : goBack()} style={{width: Taro.pxTransform(200),height: Taro.pxTransform(200)}}>
          <View className={classNames(type=='white'?'nav_back_white':'nav_back_icon')}></View>
        </View>
        {title&&<View className='nav_back_titles'>{title}</View>}
      </View>
    </View>
  )
}
