import React, {Component} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from "@tarojs/components";
import {goods} from '@/api/api'
import {httpGet, httpPost} from '@/api/newRequest'
import './index.scss'
import {toast, backgroundObj, filterActive} from "@/common/utils";
import Title from './components/goodsTitle'
import ShopCard from './components/descriptionCard'
import ShopDetails from './components/goodsCard'
import BtnLayer from './components/bottonBtn'
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {

    }
  }


  componentDidShow() {
  }



  render() {
    const {

    } = this.state
    return (
      <View className='goods_details_goodsDetails'>
        <Title></Title>
        <ShopCard></ShopCard>
        <View>
          <ShopDetails></ShopDetails>
        </View>
        <BtnLayer></BtnLayer>
      </View>
    )
  }
}

export default Index
