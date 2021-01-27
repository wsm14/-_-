import React, {useEffect, useState} from 'react'
import {Image, View} from "@tarojs/components";
import Taro, {useReachBottom} from "@tarojs/taro";
import './../../../index.scss'
import {getTopicKolMoments} from '@/server/perimeter'
import {backgroundObj, deleteFollow, saveFollow} from "@/common/utils";
import Router from "@/common/router";
const kolView = ({keyword, current}) => {
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
    getTopic()
  }, [data])
  const getTopic = () => {
    const {keyword} = data
    if(keyword){
      getTopicKolMoments(data, res => {
        const {topicList} = res
        if (topicList && topicList.length > 0) {
          setList([...list, ...topicList])
        } else {
          setCountStatus(false)
        }
      })
    }

  }
  const createView = (list) => {
    return list.map(item => {
      const {
        topicIdString,
        topicDesc,
        topicName,
        image,
        kolMomentsNum
      } = item
      return (
        <View className='search_user_box' onClick={() => Router({
          routerName: 'tipView',
          args: {
            topicId: topicIdString
          }
        })}>
          <View className='search_user_content'>
            <View className='search_tip_cover' style={image?backgroundObj(image):{}}></View>
            <View className='search_tip_tipDetails'>
              <View className='search_tip_name font_hide'># {topicName}</View>
              <View className='search_tip_dec font_hide'>{topicDesc}</View>
            </View>
            <View className='search_tip_tipNum'>{kolMomentsNum}篇分享</View>
          </View>
        </View>
      )
    })
  }
  useReachBottom(() => {
    if (countStatus && current ==3) {
      setData({
        ...data,
        page: data.page + 1
      })
    }
  })
  return (<View style={current == 3 ? {display: 'block'} : {display: 'none'}}>
    <View className='flex_auto'>
      {list.length > 0 ?
        <View className='search_shopPubu'>
          {createView(list)}
        </View>
        :
        <View className='search_shopNO'>
          <View className='search_shopImg'></View>
          <View className='search_shopImgfont color2 font28'>暂无找到想要的结果，换个关键词试试吧</View>
        </View>
      }
    </View>
  </View>)
}
export default kolView
