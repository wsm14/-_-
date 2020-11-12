import React, {useState, useEffect, useRef} from 'react'
import {Canvas, CoverView, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import QR from 'wxmp-qrcode'
import './../index.scss'
import classNames from 'classnames'
import {backgroundObj,filterWeek} from "@/common/utils";

export default (props) => {
  const {data, fn} = props
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
        if(item.status === '0'){
          QR.draw(item.verificationUrl, `canvas${index}`)
        }
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
                  {item.status ==='1' ?
                    <View className='code_onloader bgCode public_center'></View>:
                    <Canvas id={'canvas' + index} className='tests' canvasId={'canvas' + index}></Canvas>}
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
        {setCode()}
        {list.length > 0 && <View style={list[current]['status'] === '1'?{color:'#CCCCCC',textDecoration:'line-through'}:{}} className={classNames('color1 font24 code_num')}>{list[current]['verificationCode']}</View>}
        <View className='public_center color1 font24 code_count'>{current + 1 + '/' + list.length} </View>
        <View onClick={() => fn&&fn()} className='public_center font24 color2 code_onRead'>
          <View className='onReadly_icon onReadly_iconBox'></View>
          如果券码不显示，点这里刷新
        </View>

        <View className='pay_dec font24 color1'>
          <View>
            使用有效期：<Text className='color3'>{kolGoods.useEndTime} 前有效</Text>
          </View>
          <View className='pay_dec_margin'>
            使用须知：凭此码到店核销使用
          </View>
          <View className='pay_dec_margin'>到店核销时段：{filterWeek(kolGoods.useWeek)+' '+kolGoods.useTime}</View>
        </View>
      </View>
    </View>
  )
}
