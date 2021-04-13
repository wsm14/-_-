import React, {useEffect, useState} from 'react'
import {createMerchants} from '@/components/publicShopStyle'
import Waterfall from '@/components/waterfall'
import {View} from "@tarojs/components";
import Taro, {useReachBottom} from "@tarojs/taro";
import './../../../index.scss'
import {getSearchConditions} from '@/server/perimeter'

export default ({keyword, current}) => {
  const [data, setData] = useState({
    page: 1,
    limit: 10
  })
  const [list, setList] = useState([])
  const [countStatus, setCountStatus] = useState(true)
  useEffect(() => {
    setData({
      page: 1,
      limit: 10,
      keyword: keyword
    })
    setList([])
  }, [keyword])
  useEffect(() => {
    getMerchant()
  }, [data])
  const getMerchant = () => {
    const {keyword} = data
    if (keyword) {
      getSearchConditions(data, res => {
        const {userMerchantList} = res
        if (userMerchantList && userMerchantList.length > 0) {
          setList([...list, ...userMerchantList])
        } else {
          setCountStatus(false)
        }
      })
    }
  }
  useReachBottom(() => {
    if (countStatus && current == 0) {
      setData({
        ...data,
        page: data.page + 1
      })
    }
  })
  return (
    <View style={current == 0 ? {display: 'block'} : {display: 'none'}}>
      <View className='flex_auto'>
        {list.length > 0 ?
          <View className='search_shopPubu'>
            <Waterfall
              list={list}
              createDom={createMerchants}
              imgHight={240}
            >
            </Waterfall>
          </View>
          :
          <View className='search_shopNO'>
            <View className='search_shopImg'></View>
            <View className='search_shopImgfont color2 font28'>暂无找到想要的结果，换个关键词试试吧</View>
          </View>
        }
      </View>
    </View>

  )
}

