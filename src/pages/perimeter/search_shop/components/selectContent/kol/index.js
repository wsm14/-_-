import React, {useEffect, useState} from 'react'
import {createdShareKol} from '@/components/publicShopStyle'
import Waterfall from '@/components/waterfall'
import {View} from "@tarojs/components";
import Taro, {useReachBottom} from "@tarojs/taro";
import './../../../index.scss'
import {getSearchKolMoments} from '@/server/perimeter'
const kolView =({keyword,current}) => {
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
    Kol()
  }, [data])
  const Kol = () => {
    const {keyword} = data
    if(keyword){
      getSearchKolMoments(data, res => {
        const {kolMomentsList} = res
        if (kolMomentsList && kolMomentsList.length > 0) {
          setList([...list, ...kolMomentsList])
        } else {
          setCountStatus(false)
        }
      })
    }
  }
  useReachBottom(() => {
    if (countStatus && current ==1) {
      setData({
        ...data,
        page: data.page + 1
      })
    }
  })
  return (<View style={current==1?{display:'block'}:{display:'none'}}>
      <View className='flex_auto'>
        {list.length > 0 ?
          <View className='search_shopPubu'>
            <Waterfall
              list={list}
              createDom={createdShareKol}
              imgHight={'frontImageHeight'}
              imgWidth={'frontImageWidth'}
              setWidth={335}
              style={{width: Taro.pxTransform(335)}}
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
    </View>)
}
export default kolView
