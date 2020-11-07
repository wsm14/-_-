import React, {useState, useEffect, useRef} from 'react'
import {Button, Canvas, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import QR from 'wxmp-qrcode'
import './../index.scss'
import classNames from 'classnames'

import {backgroundObj,filterWeek,filterStrList} from "@/common/utils";

export default (props) => {
  const {data, fn,telephone} = props
  const [orderResult, setOrderResult] = useState({})
  const [current, setCurrent] = useState(0)
  const [list, setList] = useState([])
  const [orderDescs, setOrderDescs] = useState({})
  const [kolGoods, setKolGoods] = useState({})
  useEffect(() => {
    const {orderGoodsVerifications, orderDesc} = data
    setOrderResult(data)
    if (orderDesc) {
      setOrderDescs(JSON.parse(orderDesc))
    }
    if (orderDesc) {

      setKolGoods(JSON.parse(orderDesc).kolGoods)
      console.log(JSON.parse(orderDesc).kolGoods)
    }
    if (orderGoodsVerifications && Array.isArray(orderGoodsVerifications)) {
      setList(orderGoodsVerifications)
    }
  }, [data])
  useEffect(() => {
    setTimeout(() => {
      list.forEach((item, index) => {
        QR.draw(item.verificationUrl, `canvas${index}`)
      })
    }, 1)
  }, [list])
  const setCode = () => {
    return (
      <View className='codeBox public_center'>
        <Swiper
          current={current}
          className='code_swiper'
        >
          {
            list.map((item, index) => {
              return (
                <SwiperItem>
                  {item.status !=='1' && <View className='code_onloader public_center'>
                    <View className='code_onloader_btn color1 font24'>券码已使用</View>
                  </View>}

                  <Canvas id={'canvas' + index} className='tests' style={item.status !=='1'?{opacity:'0.1'}:{}} canvasId={'canvas' + index}></Canvas>
                </SwiperItem>
              )
            })}
        </Swiper>

        <View onClick={() => onChangeLeft()} className='code_left codeLeft_icon codePosition'></View>
        <View onClick={() => onChangeRight()} className='code_right codeLeft_right codePosition'></View>
      </View>
    )
  }
  const onChangeLeft = () => {
    if (current === 0) {
      return setCurrent(list.length - 1)
    }
    return setCurrent(current - 1)
  }
  const onChangeRight = () => {
    if (current === list.length - 1) {
      return setCurrent(0)
    }
    return setCurrent(current + 1)
  }
  const filterPrice = () => {
    const {payFee} = orderResult
    if (payFee) {
      let str = payFee.split('.')
      if (str.length == 2) {
        return (
          <View className='descriptionCard_shop_price color1 bold'>
            <Text className='font20'>¥ </Text>
            <Text className='font32'>{' ' + str[0]}</Text>
            <Text className='font24'>{`.${str[1]}`}</Text>
          </View>
        )
      }
      else {
        return (
          <View className='descriptionCard_shop_price color1 bold'>
            <Text className='font20'>¥ </Text>
            <Text className='font32'>{payFee}</Text>
          </View>
        )
      }
    }
    else  return null
  }
  const filterCode = () => {
    if(orderResult.status === '3' || orderResult.status === '1'){
      return true
    }
    return false
  }
  return (
    <View className='descriptionCard_title'>
      <View className='descriptionCard_box'>
        <View className='descriptionCard_merchant'>
          <View className='descriptionCard_profile dakale_nullImage'
                style={backgroundObj(orderDescs.merchantImg)}></View>
          <View className='descriptionCard_merchantTitle font_hide'>{orderDescs.merchantName}</View>
          <View className='descriptionCard_goIcon'></View>
        </View>
        <View className='descriptionCard_merchantShop'>
          <View className='descriptionCard_merchantLogo dakale_nullImage'
                style={backgroundObj(kolGoods.goodsImg)}></View>
          <View className='descriptionCard_shop_details'>
            <View className='descriptionCard_goods_name color1 font28 font_noHide'>{kolGoods.goodsName}</View>
            <View className='font24 color2 descriptionCard_goods_num'>数量：{kolGoods.goodsCount}</View>
          </View>
          {filterPrice()}
        </View>
        <View className='descriptionCard_goods_liner'></View>
        <View className='descriptionCard_goods_tags public_center'>
          <View className='kolTagBox public_center'>
            <View className='kolTag kolTagIcons'></View>
            <View className='font24 color2 kolTag_font'>免预约</View>
            <View className='kolTag kolTagIcons'></View>
            <View className='font24 color2 kolTag_font'>随时退</View>
            <View className='kolTag kolTagIcons'></View>
            <View className='font24 color2 kolTag_font'>过期退</View>
          </View>
        </View>
        {filterCode() &&
        <>
          {setCode()}
          {list.length > 0 && <View style={list[current]['status'] !== '1'?{color:'#CCCCCC',textDecoration:'line-through'}:{}} className={classNames('color1 font24 code_num')}>券码:  {list[current]['verificationCode']}</View>}
          <View className='public_center color1 font24 code_count'>{current + 1 + '/' + list.length} </View>
          <View onClick={() => fn&&fn()} className='public_center font24 color2 code_onRead'>
            <View className='onReadly_icon onReadly_iconBox'></View>
            如果券码不显示，点这里刷新
          </View>
          <View className='kolgoods_go public_auto font24 color1'>
            <View className='kolgoods_go_left public_center'>
              <View className='kolgoods_go_leftBox public_center'>
                <View className='kolgoods_goIcon_box kol_telephone'>
                </View>到这里去
              </View>
            </View>
            <View onClick={() => telephone()} className='kolgoods_go_right public_center'>
              <View className='kolgoods_go_rightBox public_center'>
                <View className='kolgoods_goIcon_box kol_telephone'>

                </View>
                联系商家
              </View>
            </View>
          </View>
        </>}
      </View>
    </View>
  )
}
