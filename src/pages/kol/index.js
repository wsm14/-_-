import React, { Component } from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import { View, Button,Image, Text,Swiper, SwiperItem} from '@tarojs/components'
import Nav from '@/compoenents/nav'
import './index.scss'
class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      httpData : {
        kolMomentId: getCurrentInstance().router.params.kolMomentId || '1316358857233154049'
      },
    }
  }
  componentWillMount () { }
  componentDidMount () { }
  componentWillUnmount () { }
  componentDidHide () { }
  componentDidShow() {
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
  render () {
    // const  navSetting = {
    //   style : {
    //     background: '#FFFFFF',
    //     color: '#333333'
    //   },
    //   title: '粉丝列表'
    // }
    return (
      <View>
      </View>
    )
  }
}

export default Index
