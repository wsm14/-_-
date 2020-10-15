/*
* style 轮播图框样式,
* data, 轮播图数据
* showToast 是否显示当前张数,
* imgName 图片参数名称
* list 图片数组
* current 图片当前张数
*
* */
import React, {useState, useEffect} from "react";
import Taro from '@tarojs/taro'
import {Swiper, SwiperItem, View,Image} from '@tarojs/components'
import './index.scss'

export default (props) => {
  const {style, data, showToast, imgName,auto,height} = props
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState('1')
  useEffect(() => {
    data && setList(data)
  }, [data])
  return (
    <View style={{position:'relative'}}>
      <Swiper
        style={style}
        autoplay
        onChange={(e) => {
          setCurrent(e.detail.current+1)
        }}
      >
        {list.map((item, index) => {
            return (
              <SwiperItem style={{width:'100%',height:'100%'}}>
                <View style={{background: `url(${item[imgName]}) no-repeat top center/contain`}} key={index}
                      className='banner_box'>
                </View>
              </SwiperItem>
            )
        })}
      </Swiper>
      {showToast && <View className='banner_toast'><View className='banner_tags'>{current + '/' + data.length}</View></View>}
    </View>

  )
}
