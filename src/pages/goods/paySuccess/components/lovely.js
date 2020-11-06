import React, {useState, useRef, useEffect} from 'react'
import {ScrollView, View} from "@tarojs/components";
import {shopDetails} from '@/components/publicShopStyle'
import {goods} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import './../index.scss'
import {toast} from "@/common/utils";
export default (props) => {
  const [data,setData] = useState([])
  const [httpData,setHttpData] = useState({
    page: 1,
    limit: 10
  })
  const [count,countType] = useState(true)
  useEffect(() => {
     if(count){
       getLovely()
     }else {
       toast('暂无数据')
     }
  },[httpData])
  const getLovely = () => {
     const {listSpecialGoods} = goods
     httpGet({
       url: listSpecialGoods,
       data: httpData
     },res => {
        const {SpecialGoodsList} = res
        if(SpecialGoodsList&&SpecialGoodsList.length === 10){
          setData([...data,...SpecialGoodsList])
        }
        else if(SpecialGoodsList&&SpecialGoodsList.length>0 &&SpecialGoodsList.length<10){
          countType(false);
          setData([...data,...SpecialGoodsList])
        }
        else {
          countType(false);
          toast('暂无数据')
        }
     })
  }
  const getDown = () => {
    if(count){
      setHttpData(
        {
          ...httpData,
          page: httpData.page+1
        }
      )
    }
    else return  toast('暂无数据')
  }
  return (
    <View className='lovely_box'>
      <View className='color1 font28 lovely_title'>- 你可能还喜欢 -</View>
      <ScrollView
        className='love_shop public_auto'
        scrollX
        onScrollToLower={() => getDown()}
      >
        {data.map(item => {
          return (
            shopDetails(item)
          )
        })}
      </ScrollView>
    </View>
  )
}
