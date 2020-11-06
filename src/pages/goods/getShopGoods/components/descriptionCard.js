import React from 'react'
import {Text, View} from "@tarojs/components";
import './../index.scss'
export default (props) => {
  return (
    <View className='descriptionCard_title'>
      <View className='descriptionCard_box'>
        <View className='descriptionCard_merchant'>
          <View className='descriptionCard_profile dakale_nullImage'></View>
          <View className='descriptionCard_merchantTitle font_hide'>必胜客（下沙宝龙店）</View>
          <View className='descriptionCard_goIcon'></View>
        </View>
        <View className='descriptionCard_dec'>
          <View className='descriptionCard_discount'>
            <View>订单金额</View>
            <View className='color1'>¥ 10.00</View>
          </View>
          <View className='descriptionCard_discount discount_top'>
            <View>卡豆抵扣</View>
            <View className='color1'>¥ 10.00</View>
          </View>
          <View className='descriptionCard_discount discount_top'>
            <View>优惠券</View>
            <View className='color1'>¥ 10.00</View>
          </View>
        </View>
        <View className='descriptionCard_liner'>

        </View>
        <View className='descriptionCard_payPrice'>
          <View className='color1'>实付金额</View>
          <View className='color3 font20'>¥<Text className='font40 bold'>5</Text><Text className='font28'>.00</Text></View>
        </View>
      </View>
    </View>
  )
}
