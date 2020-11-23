/*
* style 瀑布宽度
* list 瀑布数组
* createDom 创建元素方法
* imgHight 图片高度
* imgWidth 图片宽度
* setWidth 比例后宽度
* */


import React, {useEffect, useState} from "react";
import {View} from "@tarojs/components";
import {getDom,computedHeight} from "@/common/utils";
import './index.scss'
import Taro from "@tarojs/taro";
export default (props) =>{
  const {style,list,createDom,imgHight,imgWidth,setWidth} = props
  const [leftList,setLeftList] = useState([])
  const [rightList,setRightList] = useState([])
  useEffect(() => {
   filterBox(list)
  },[list])
  const filterBox = (list) => {
    let left = []
    let right = []
    let leftNum = 0
    let rightNum = 0
    list.forEach(item => {
        if(leftNum<=rightNum){
          left.push(item)
          if(item[imgWidth]&& item[imgHight] && setWidth){
            leftNum+= computedHeight(item[imgWidth], item[imgHight], setWidth)
          }
           else leftNum+= imgHight
        }
        else {
          right.push(item)
          if(item[imgWidth]&& item[imgHight] && setWidth){
            rightNum+= computedHeight(item[imgWidth], item[imgHight], setWidth)
          }
          else {
            rightNum+=imgHight
          }
        }
    })
    setLeftList(left)
    setRightList(right)
  }
  if(list){
    return (
      <View  className='page_content'>
        <View style={style?{...style}:{}}  className='page_left'>
          {leftList.map(item => {
            return(
              createDom(item)
            )
          })}
        </View>
        <View style={style?{...style}:{}}  className='page_right'>
          {rightList.map(item => {
            return(
              createDom(item)
            )
          })}
        </View>
      </View>
    )
  }
  return null
}
