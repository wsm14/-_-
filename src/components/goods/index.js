import React,{useEffect,useState} from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import {View} from "@tarojs/components";
import './index.scss'
export default (props) =>{
  const createCodeGoods = (item) => {
    return
  }
  const createShopGoods = (item) => {

  }

  return (
    <View className='createGood_box'>
      <View className='createGood_title'>
        <View className='createGood_title_box'>
          <View className='createGood_iconBox createGood_bg1'>
            扫码
          </View>
          <View className='createGood_merchantName font_hide'>必胜客（下沙宝龙店)</View>
          <View className='createGood_merchantgo'></View>
          <View className='createGood_status status_color1'>已完成</View>
        </View>
      </View>
      <View className='createGood_content'>
        <View className='createdGood_details_box'>
          <View className='createdGood_details_image dakale_nullImage'></View>
          <View className='createdGood_details_setting'>
            <View className='createdGood_details_title font_noHide'>
              特价牛排特价牛排特价
              特价牛排特价牛排特…
            </View>
          </View>
          <View className='createdGood_details_price'></View>
        </View>
        <View className='createdGood_details_timeBox'>
          <View className='time_color1'>
            支付时间：2020-09-28  16:09:08
          </View>
          <View className='createdGood_time_look'>
            查看
            <View className='createdGood_time_lookIcon'></View>
          </View>
        </View>
      </View>
    </View>
  )
}
