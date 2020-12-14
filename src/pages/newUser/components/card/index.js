import React,{useState,useEffect} from "react";
import {View,Text} from "@tarojs/components";
import './../index.scss'
const filterData = (data) => {
    Object.keys(data).map(item =>{
    if(item =='todayBean'){
      data.todaySumBean = data[item] || 0
    }

    else if(item == 'totalBean'){
      data.sumBean = data[item] || 0
    }
  })
  return data
}
export default (props) => {
  const {data} = props
  const [user ,setUser] = useState({
  })
  useEffect(() =>{
    setUser(filterData(data))
  },[data])
  return (
    <View className='card_box'>
      <View className='card_details'>
        <View className='card_title'>
          <View>今日贡献</View>
          <View>累计贡献</View>
        </View>
        <View className='card_bean'>
          <View className='card_beanBox font_hide card_beanLeft'><Text className='card_number'>
            {user.todaySumBean||0}</Text>卡豆</View>
          <View className='card_beanBox font_hide card_beanRight'>
            <Text className='card_number'>{user.sumBean||0}</Text>卡豆</View>
        </View>
      </View>
    </View>
  )
}
