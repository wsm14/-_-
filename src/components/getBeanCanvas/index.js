import React, {useEffect, useState, useRef} from 'react'
import Taro from '@tarojs/taro'
import {Button, Canvas, Text, View} from "@tarojs/components";
import classNames from 'classnames'
import './index.scss'
import {values} from "mobx";

const scale = () => {
  return Taro.getSystemInfoSync().windowWidth / 375;
}
export default (props) => {
  const {beanStatus, beanNum, interval, length,lookStatus,getBeanStatus} = props
  const [time, setTime] = useState(null)
  const [toast, setToast] = useState(1)
  const [computedTime, setComputedTime] = useState(0)

  useEffect(() => {
      setTime(interval)
    }
    , [interval])
  useEffect(() => {
      setComputedTime(length)
    }
    , [length])
  useEffect(() => {
      drawProgressbg(scale())
      if(getBeanStatus ===  '0'  && time == 0){
         setToast(1)
      }
    }
    , [time])
  useEffect(() => {
    setTimeout(() => setToast(0), 2000)
  }, [])
  const drawProgressbg = (size) => {
    var ctx = Taro.createCanvasContext('animateCanvas')
    ctx.setLineWidth(2);// 设置圆环的宽度
    ctx.setStrokeStyle('#EF476F'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(21 * size, 21 * size, 20 * size, 30, (2 * (((length - time) * (1 / length))) * Math.PI)+30,  false);
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  }
  return (
    <View className='canvas_box'>
      <View className={classNames('canvas_img', beanStatus !== '1' ? 'beanTime' : 'beanTime1')}>
        {beanStatus !== '1' &&
        <Canvas id='animateCanvas' canvasId='animateCanvas' className='animateCanvas'></Canvas>
        }
        {lookStatus === '0' && beanStatus === '1' &&
        <View
          className='getBean_toast public_center animated bounceInUp'>+{parseInt(beanNum) > 999 ? 999 : beanNum}</View>}
        {beanStatus === '1'&& lookStatus !== '0' &&
        <View
          className='getBean_toast bold public_center'>已领取</View>}
      </View>
      {beanStatus === '0' ?
        <View className={classNames('canvas_tag beanLookToast', toast === 0 && 'animated fadeOut')}>
           {(getBeanStatus==='0' && time ===0)?'卡豆奖励已到上限':`看完可捡${beanNum}卡豆`}
        </View>:null}
    </View>
  )
}

