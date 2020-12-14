import React ,{useEffect,useState} from 'react'
import {Text, View} from "@tarojs/components";
import './index.scss'
export default (props) => {
  const {data,visible} = props
  const [getData,setData] = useState({})
  useEffect(() =>{setData(data)},[data])
  return (
    <View className='bean_toast' onClick={(e) =>{e.stopPropagation();visible()}}>
      <View className='bean_toastIcon' onClick={(e) =>{e.stopPropagation()}}>
        <View className='bean_box'>
          <View className='bean_title'>恭喜获得</View>
          <View className='bean_num'>
            <Text className='bean_getNum'>{getData.beanAmount}</Text>卡豆</View>
          <View className='bean_btn' onClick={() =>visible()}>知道了</View>
        </View>
      </View>
    </View>
  )
}
