import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {wxapiGet,index} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import {
  filterLogin,
  navigateTo,
  backgroundObj,
  setPeople,
  computedHeight,
  filterTime,
  NavHeight,
  toast,
  GetDistance,
  goDown
} from '@/common/utils'
import Tabs from '@/components/tabs'
import Goods from '@/components/goods'
import classNames from 'classnames'
import {inject, observer} from "mobx-react";
@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      setting: {
        tabList: ['全部订单','待付款','可使用','退款/售后'],
        current: 0
      },

    }
  }
  //获取个人足迹
  onPageScroll(e) {
  }
  setIndex(index) {
    this.setState({
      setting: {
        ...this.state.setting,
        current: index
      }
    })
  }
  componentDidShow() {

  }
  componentDidMount() {

  }
  onReachBottom() {
    this.pageDown()
  }
  errorToast(e) {
    this.setState({
      Toast: {
        status: 'error',
        text: e,
        isOpened: true
      }
    })
  }
  render() {

    const {
      setting
    } = this.state
    const tabStyle = {
      height: Taro.pxTransform(88),
      borderRadius:'0px 0px 20px 20px',
      display: 'flex',
      justifyContent:'space-between',
      alignItems: 'center',
      background: '#FFFFFF',
      padding:`0 ${Taro.pxTransform(38)}`,
      position: 'relative',
    }
    return (
      <View className='goods_tabbar_box'>
        <Tabs fn={this.setIndex.bind(this)} style={tabStyle} {...setting}></Tabs>
        <Goods></Goods>
      </View>
    )
  }
}

export default Index
