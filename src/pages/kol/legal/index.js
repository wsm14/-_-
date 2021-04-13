import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Button, Image, Text, Swiper, SwiperItem} from '@tarojs/components'
import LeverDetails from './components/legalDetails'
import LeverTitle from './components/leverTitle'
import {getKolLever} from '@/server/kol'
import './index.scss'
import {navigateTo} from "../../../common/utils";

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      isKol: "0",
      levelConfigInfo: {},
      levelFlag: "0",
      nextLevelName: "哒人",
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  getKolLever() {
    getKolLever({}, res => {
      const {
        isKol,
        levelConfigInfo,
        levelFlag,
        nextLevelName
      } = res
      this.setState({
        isKol,
        levelConfigInfo,
        levelFlag,
        nextLevelName
      })
    })
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    this.getKolLever()
  }

  errorToast(e) {

  }

  render() {
    const {levelConfigInfo} = this.state
    if (levelConfigInfo && Object.keys(levelConfigInfo).length > 0) {
      return (
        <View className='legal_father_box'>
          <LeverTitle {...this.state}></LeverTitle>
          <LeverDetails level={(levelConfigInfo && levelConfigInfo.level && levelConfigInfo.level>=0)?levelConfigInfo.level+1:1}></LeverDetails>
          <View className='legal_goDown'>
            更多哒人福利，尽在「哒卡乐」
          </View>
          <View className='legal_button' onClick={() => navigateTo('/pages/share/download/index')}>
            下载APP
          </View>
        </View>
      )
    } else return null

  }
}

export default Index
