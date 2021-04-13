import React, {useEffect, useState} from "react";
import classNames from 'classnames'
import {backgroundObj} from '@/common/utils'
import {Text, View} from "@tarojs/components";
import './../index.scss'
export default (props) => {
  const {list} = props
  const [userList ,setList] = useState([])
  useEffect(() =>{
    setList(list)
  },[list])
  return (
    <View className='shop_box'>
      {userList.map(item =>{
        const {
          cityName,
          coverImg,
          distanceRange,
          districtName,
          markAmount,
          markBean,
          markFlag,
          merchantName,
          mobile,
          parentTotalRevenue,
          perCapitaConsumption,
          tag,
          verifyStatus
        } = item
        return(
          <View className='shop_list_box'>
            <View className='shop_title'>
              <View className='shop_name font_hide'>{merchantName}</View>
              <View className='shop_btn'>打卡捡豆</View>
            </View>
            <View className='shop_details'>
              <View className='shop_shopImg' style={{...backgroundObj(coverImg)}}></View>
              <View className='shop_dec'>
                <View className='shop_card'>已打卡{markAmount}次</View>
                <View className='shop_city'>{cityName}<Text className='city_icon'></Text>{districtName}</View>

                <View className='shop_limit'>¥ {perCapitaConsumption}/人
                  <Text className='limit_icon'></Text>
                  距你{distanceRange}
                </View>
              </View>
              <View className='shop_beanBox'>
                <View className='shop_bean'>120</View>
                <View className='shop_bean_text'>贡献（卡豆)</View>
              </View>
            </View>
          </View>
        )
      })}

    </View>
  )
}
