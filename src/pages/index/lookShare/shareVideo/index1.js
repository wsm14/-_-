import React, { Component } from 'react'
import Taro ,{getCurrentInstance}from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, Video, Button} from '@tarojs/components'
import {wxapiGet, wxapiPost} from './../../../../api/api'
import Ajax from './../../../../api/request'
import Utils from "./../../../../utils/utils";
import './index.scss'
export default class ShareVideo extends Component{
  constructor() {
    super(...arguments);
  }

  render() {
    return (
      <View className = "page_share_layer">

      </View>
    )
  }
}
