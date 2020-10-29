import React from 'react'
import Taro from '@tarojs/taro'
import {Canvas, Text, View} from "@tarojs/components";
import './index.scss'
export const coupons = (_this,data,obj) => {

  return (
    <View className='coupon_box'>
      <View className='coupon_content'>
        <View className='coupon_userPro'></View>
        <View className='coupon_details'>
          <View className='coupon_one'>
            <View className='coupon_left'>
              100元代金券
            </View>
            <View className='coupon_right'>
              <Text style={{fontSize:Taro.pxTransform(24)}}>¥ </Text>
              5
            </View>
          </View>
          <View className='coupon_two'>
            <View className='coupon_two_left'>
              哒卡乐用户专享
            </View>
            <View className='coupon_two_right'>
              (500卡豆)
            </View>
          </View>
          <View className='coupon_three'>
            <View className='coupon_three_left'>
              每人限购3张
            </View>
            <View className='coupon_three_right'>
              立即抢购
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
export const shopDetails  =  (_this,data,obj) => {
  return (
    <View className='shopDetails_box'>
      <View className='shopDetails_Img'>
        <View className='shopDetails_city'>
          <View className='shopDetails_city_icon'></View>
          <View className='shopDetails_city_font'>200m</View>
        </View>
        <View className='shopDetails_user'>
          <View className='user_profile'>

          </View>
          <View className='user_name font_hide'>
            鲜丰水果
          </View>
        </View>
      </View>
      <View className='shopDetails_dec'>
        <View className='shopDetails_shopName font_hide'>
          特价橘子特价橘子特价橘...
        </View>
        <View className='shopDetails_tag'>
          <View className='shopDetails_tag_box'>新鲜爆品</View>
          <View className='shopDetails_tag_box'>新鲜爆品</View>
          <View className='shopDetails_tag_box'>新鲜爆品</View>
        </View>
        <View className='shopDetails_biaoti'>哒卡乐专享价</View>
        <View className='shopDetails_price'>
          <View className='shopDetails_left'><Text style={{fontSize:Taro.pxTransform(20)}}>¥</Text> 9.9</View>
          <View className='shopDetails_right'>
            ¥ 22
          </View>
        </View>
        <View className='shopDetails_bean'>
          (990卡豆)
        </View>

      </View>
      {/*<View className='shopDetails_btnBox shopDetails_btnColor1'>*/}
      {/*  立即抢购*/}
      {/*</View>*/}
      <View className='shopDetails_btnColor2'>
      </View>
    </View>
  )
}
