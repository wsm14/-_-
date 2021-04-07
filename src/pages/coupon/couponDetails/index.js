import React, {PureComponent} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import classNames from 'classnames'
import {Text, View} from "@tarojs/components";
import {getUserCouponDetail} from '@/server/coupon'
import './index.scss'
import Codes from './components/code/index'
import {goBack, toast, filterWeek} from "@/common/utils";

class Index extends PureComponent {
  constructor() {
    super(...arguments)
    this.state = {
      id: getCurrentInstance().router.params.id,
      userCouponInfo: {}
    }
  }

  getUserCouponDetail() {
    const {id} = this.state
    getUserCouponDetail({
      id
    }, res => {
      const {userCouponInfo} = res
      this.setState({
        userCouponInfo
      })
    })
  }

  componentDidShow() {
    this.getUserCouponDetail()
  }

  componentWillMount() {
    if (!getCurrentInstance().router.params.id) {
      goBack(() => toast('券Id不能为空'))
    }
  }

  render() {
    let {userCouponInfo, userCouponInfo: {activeBeginDate, activeEndDate, useWeek, useTime, buyDesc}} = this.state
    if(buyDesc){
      if(JSON.parse(buyDesc)){
        buyDesc =JSON.parse(buyDesc).toString()
      }
    }
    if (Object.keys(userCouponInfo).length > 0) {
      return (
        <View className='couponDetails_father_box'>
          <Codes fn={() => this.getUserCouponDetail()} data = {userCouponInfo}></Codes>
          <View className='shopdetails_shop_toast'>
            <View className='shop_toastTitle'>使用须知</View>
            <View className='shop_toastDec shop_toastDate'>
              有效期：
            </View>
            <View className='shop_toastText'>
              <Text className='shop_toastTextColor'>{activeBeginDate + ' 至 ' + activeEndDate} </Text>，请在有效期内使用；
            </View>
            <View className='shop_toastDec shop_getDate'>
              使用时间：
            </View>
            <View className='shop_toastText'>
              <Text className='shop_toastTextColor'>{filterWeek(useWeek) + ' ' + useTime}</Text>，具体以门店供应时段为准；
            </View>
            <View className='shop_toastDec shop_showNow'>
              购买须知：
            </View>
            <View style={{lineHeight: Taro.pxTransform(36)}} className='shop_toastText'>
              {buyDesc}
            </View>
          </View>
          {/*使用规则*/}
          <View className='shopdetails_shop_toast'>
            <View className='shop_toastTitle'>使用规则</View>
            <View className='shop_toastText shop_toastTextHeight'>
              本券不可拆分使用，不支持外卖点餐、电商订购等方式；不全不可转让、转售、转发、截图，也不能兑换现金，伪造无效；
            </View>
            <View className='shop_toastText shop_toastTextHeight'>
              如对订单有疑问，请点击左下角客服进行咨询；一旦核销即为使用，卡券详情可查看存根信息；【因供应商明确要求，本电子券一经售出后均不退不换，请介意者慎拍】
              哒卡乐客服电话：400-800-5881，如有疑问也可以直接拨打咨询。
            </View>
            <View className='shop_toastText shop_toastTextHeight'>
              最终解释权归哒卡乐所有
            </View>
          </View>
        </View>
      )
    } else return null

  }
}

export default Index