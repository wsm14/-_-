import React, {useState, useRef, useEffect} from 'react'
import {ScrollView, View} from "@tarojs/components";
import {shopDetails} from '@/components/publicShopStyle'
import {getGoodsByMerchantId} from '@/server/perimeter'
import './index.scss'
import {toast} from "@/common/utils";
import classNames from 'classnames'

export default (props) => {
  const {title} = props
  const [data, setData] = useState([])
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10
  })
  const [count, countType] = useState(true)
  useEffect(() => {
    if (count) {
      getLovely()
    } else {
      toast('暂无数据')
    }
  }, [httpData])
  const getLovely = () => {
    getGoodsByMerchantId(
      httpData, res => {
        const {specialGoodsList} = res
        if (specialGoodsList && specialGoodsList.length > 0) {
          setData([...data, ...specialGoodsList])
        } else {
          countType(false);
        }
      })
  }
  const getDown = () => {
    if (count) {
      setHttpData(
        {
          ...httpData,
          page: httpData.page + 1
        }
      )
    } else return toast('暂无数据')
  }
  if (data.length > 0) {
    return (
      <View className='lovely_box'>
        <View className='color1 font28 lovely_title'>- {title || '你可能还喜欢'} -</View>
        <ScrollView
          className='love_shop love_top public_auto'
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
  return null
}
