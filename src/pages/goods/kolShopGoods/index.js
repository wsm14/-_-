import React, {Component} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from "@tarojs/components";
import {goods} from '@/api/api'
import {httpGet, httpPost} from '@/api/newRequest'
import './index.scss'
import {toast, backgroundObj, filterActive, goBack} from "@/common/utils";
import Title from './components/goodsTitle'
import ShopCard from './components/descriptionCard'
import ShopDetails from './components/goodsCard'
import BtnLayer from './components/bottonBtn'

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      httpData: {
        orderSn: getCurrentInstance().router.params.orderSn
      },
      kolOrderInfo: {}
    }
  }

  componentWillUnmount() {
    if (!getCurrentInstance().router.params.orderSn) {
      goBack('参数缺失')
    }
  }

  componentDidShow() {
    this.getKolDetails()
  }
  filterPrice(payFee) {
    if (payFee) {
      let str = payFee.split('.')
      if (str.length == 2) {
        return (
          <View className='color3'>
            <Text className='font24'>¥ </Text>
            <Text className='font40'>{' ' + str[0]}</Text>
            <Text className='font28'>{`.${str[1]}`}</Text>
          </View>
        )
      }
      else {
        return (
          <View className='color3'>
            <Text className='font24'>¥ </Text>
            <Text className='font40'>{payFee}</Text>
          </View>
        )
      }
    }
    else  return null
  }
  getKolDetails() {
    const {getKolOrderDetail} = goods
    const {httpData} = this.state
    httpGet({
      data: httpData,
      url: getKolOrderDetail
    }, res => {
      const {kolOrderInfo} = res
      console.log(kolOrderInfo)
      this.setState({
        kolOrderInfo
      })
    })
  }

  onError(msg) {
    console.log(msg)
  }

  render() {
    const {
      kolOrderInfo,
      kolOrderInfo: {
        status,
        payFee,
        totalFee,
      }
    } = this.state
    return (
      <View className='kolGoods_details_kolGoodsDetails'>
        <Title data={kolOrderInfo}></Title>
        <BtnLayer></BtnLayer>
        <ShopCard></ShopCard>
        <View className='kolGoods_details'>
          <View className='kolGoods_detailsBox'>
            <View className='font24 color2 public_auto kolGoods_details_height'>
              <View>订单金额</View>
              <View className='color1'>¥ {totalFee}</View>
            </View>
            <View className='kolGoods_details_top font24 color2 public_auto kolGoods_details_height'>
              <View>卡豆抵扣</View>
              <View className='color1'>{Number(totalFee)*100+'卡豆'} (¥ {totalFee})</View>
            </View>
            {/*<View className='kolGoods_details_top font24 color2 public_auto kolGoods_details_height'>*/}
            {/*  <View>优惠券</View>*/}
            {/*  <View className='color1'>- ¥ 4.00</View>*/}
            {/*</View>*/}
            <View className='kolGoods_details_liner'></View>
            <View className='kolGoods_details_price public_auto bold'>
              <View className='font28 color1 '>待付金额 </View>
              {this.filterPrice(payFee)}
            </View>
          </View>
        </View>
        <ShopDetails/>
      </View>
    )
  }
}

export default Index
