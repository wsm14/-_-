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
import {Swiper, SwiperItem, View, Image} from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
import Card from "../../layout/index/healthTakeCard";

export default (props) => {
  const {style, data, showToast, imgName, auto, height, boxStyle, imgStyle, showNear} = props
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState('1')
  useEffect(() => {
    data && setList(data)
  }, [data])
  return (
    <View style={!boxStyle ? {position: 'relative'} : {...boxStyle}}>
      {list.length > 1 ?
        <Swiper
          style={style}
          circular
          onChange={(e) => {
            setCurrent(e.detail.current + 1)
          }}
        >
          {list.map((item, index) => {
            return (
              <SwiperItem style={{width: '100%', height: '100%'}}>
                <View style={imgStyle ? {
                  background: `url(${item[imgName]?item[imgName]:item}) no-repeat`,
                  backgroundSize: '100% 100%'
                } : {background: `url(${item[imgName]?item[imgName]:item}) no-repeat top center/contain`}} key={index}
                      className='banner_box dakale_nullImage'>
                </View>
              </SwiperItem>
            )
          })}
        </Swiper> :
        <View style={style}>
          {list.map((item, index) => {
            return (
              <View style={{width: '100%', height: '100%'}}>
                <View
                  style={imgStyle ? {background: `url(${item[imgName]||item}) no-repeat center/cover`,} : {background: `url(${item[imgName]}) no-repeat top center/contain`}}
                  key={index}
                  className='banner_box'>
                </View>
              </View>
            )
          })}
        </View>

      }

        {showNear && list.length>1 &&
         <View  className='show_near'>
           {list.map((item,index) => {
             return (
               <View key={index} className={classNames(index==current-1?'show_near_linerTrue':'show_near_false')}></View>
             )
           })}
         </View>
        }
        {showToast &&
        <View className='banner_toast'><View className='banner_tags'>{current + '/' + data.length}</View></View>}
      </View>
        )
      }
