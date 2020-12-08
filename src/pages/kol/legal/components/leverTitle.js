import React, {useEffect, useState} from "react";
import {View, Text, Swiper, SwiperItem, ScrollView} from "@tarojs/components";
import {getDom, computedHeight, backgroundObj} from "@/common/utils";
import './../index.scss'
import Taro from "@tarojs/taro";
import classNames from 'classnames'

const filterList = (list, length) => {
  const filterList = [];
  let size = Math.floor(list.length / length)
  for (let i = 0; i < size; i++) {
    filterList.push(list.slice(i * length, i * length + length))
  }
  return filterList
}
export default ({isKol, levelConfigInfo = {}, levelFlag, nextLevelName}) => {
  const [list, setList] = useState([])
  const [puction, setPuction] = useState({})
  const [left, setLeft] = useState(50)
  const [length, setLength] = useState('minLengths')
  const setSlider = (val) => {
    const {detail:{scrollLeft}} = val
    let box = 350
    setLeft((((scrollLeft/2)/box)*100)+50)
  }
  const setTemplate = {
    minLengths: (<View className='legal_title_iconDetails'>
      {list.map((item, index) => {
        const {title, icon} = item
        return (
          <View className={classNames('legal_title_iconBox', (index + 1) % 4 !== 0 && 'legal_title_margin')}>
            <View className='legal_title_icon' style={backgroundObj(icon)}></View>
            <View className='legal_title_iconFont'>{title}</View>
          </View>
        )
      })}
    </View>),
    maxLengths: (
      <View className='legal_title_iconScroll'>
        <ScrollView
         scrollX
         onScroll={setSlider}
         className='scroll_style'
        >
          <View className='legal_title_iconNoMargin'>
            {list.map((item, index) => {
              const {title, icon} = item
              return (
                <View className={classNames('legal_title_iconBox', (index + 1) % 4 !== 0 && 'legal_title_margin')}>
                  <View className='legal_title_icon' style={backgroundObj(icon)}></View>
                  <View className='legal_title_iconFont'>{title}</View>
                </View>
              )
            })}
          </View>
        </ScrollView>
        <View className="slider">
          <View style={{left:left+'%'}} className="slider-inside .slider-inside-location"></View>
        </View>
      </View>
      ),
  }[length]
  useEffect(() => {
    const {rights,pictures} = levelConfigInfo
    if (rights && JSON.parse(rights)) {
      setList([...JSON.parse(rights)])
    }
    if (pictures && JSON.parse(pictures)) {
      setPuction(JSON.parse(pictures))
    }
  }, [levelConfigInfo])
  useEffect(() => {
    if (list.length <= 8) {
      setLength('minLengths')
    } else {
      setLength('maxLengths')
    }
  }, [list])
  return (
    <View className="legal_title">
      <View className='legal_title_banner'>
        <View className='legal_title_topBox'>
          <View className='legal_title_font'>
            <View className='legal_title_font1'>
              {(isKol === '0' && levelFlag === '0') ? '解锁哒人' : 'Lv.' + levelConfigInfo.level + levelConfigInfo.levelName}
            </View>
            <View className='legal_title_font2'>
              {(isKol === '0' && levelFlag === '0') ? '申请解锁哒人，彰显身份，拥有更多特权' : levelConfigInfo.levelDesc}
            </View>
          </View>
          <View className='legal_title_topImg dakale_nullImage' style={puction.activity && backgroundObj(puction.activity)}></View>
        </View>
        <View className='legal_title_content'>
          {setTemplate}
        </View>
      </View>
    </View>
  )
}

