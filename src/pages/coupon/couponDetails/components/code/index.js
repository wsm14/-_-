import React, {useState, useEffect, useRef} from 'react'
import {Button, Canvas, CoverImage, CoverView, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import QR from 'wxmp-qrcode'
import './../../index.scss'
import classNames from 'classnames'
import {backgroundObj, filterWeek, filterStrList, navigateTo, mapGo} from "@/common/utils";

export default (props) => {
  const {data, fn, telephone, style} = props
  const [orderResult, setOrderResult] = useState({})
  const [current, setCurrent] = useState(0)
  const [list, setList] = useState([])
  useEffect(() => {
    const {orderGoodsVerifications} = data
    setOrderResult(data)
    if (orderGoodsVerifications && Array.isArray(orderGoodsVerifications)) {
      setList(orderGoodsVerifications)
    }
  }, [data])
  useEffect(() => {
    setTimeout(() => {
      list.forEach((item, index) => {
        const {verificationUrl} = item
        if (item.status === '0') {
          QR.draw(verificationUrl, `canvas${index}`)
        }
      })
    }, 100)
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
              const {status} = item
              const codeObj = {
                '1': (<View className='code_onloader  code_status1 public_center'></View>),
                '2': (<View className='code_onloader code_status2  public_center'></View>),
                '3': (<View className='code_onloader code_status3  public_center'></View>)
              }[status]
              return (
                <SwiperItem>
                  {codeObj ? codeObj :
                    <Canvas id={'canvas' + index} className='tests' canvasId={'canvas' + index}></Canvas>
                  }
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
  const orderStatusObj = {
    '0': (<View className='color3 font24 couponDetails_goods_type'> 还有{orderResult.dayNum}天过期 </View>),
    '1': (<View className='color7 font24 couponDetails_goods_type'> 已使用 </View>),
    '2': (<View className='color7 font24 couponDetails_goods_type'> 已过期 </View>),
    '3': (<View className='color7 font24 couponDetails_goods_type'>还有{orderResult.dayNum}天过期</View>),
  }[orderResult.couponStatus]
  const goGoodDetails = (orderSn) => {
    navigateTo(`/pages/goods/kolShopGoods/index?orderSn=${orderSn}`)
  }
  const goShopGoods = () => {
    // if(orderResult.orderType ==='kolGoods'){
    //   navigateTo(`/pages/perimeter/shopDetails/index?merchantId=${merchantId}&kolActivityIdString=${kolActivityId}&kolMomentsId=${kolMomentsId}`)
    // }
    // else  {
    //   navigateTo(`/pages/perimeter/favourableDetails/index?merchantId=${merchantId}&specialActivityId=${specialActivityId}`)
    // }
  }
//商品详情



  return (
    <View className='couponDetails_title' style={style ? style : {}}>
      <View className='goMap'
        onClick={() => mapGo({
          lat:orderResult.lat,lnt:orderResult.lnt,address:orderResult.merchantAddress,name: orderResult.merchantName
        })}></View>
      <View className='couponDetails_box'>
        <View
          onClick={() => navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${orderResult.merchantIdString}`)}
          className='couponDetails_merchant'>
          <View className='couponDetails_profile dakale_nullImage'
                style={backgroundObj(orderResult.merchantLogo)}></View>
          <View className='couponDetails_merchantTitle font_hide'>{orderResult.merchantName}</View>
          <View className='couponDetails_goIcon'></View>
        </View>
        <View className='couponDetails_merchantShop'>
          <View className='couponDetails_merchantLogo dakale_nullImage'
                style={backgroundObj(orderResult.couponImg)}></View>
          <View className='couponDetails_shop_details'>
            <View className='font_hide font28 couponDetails_shop_name'>{orderResult.couponName}</View>
            <View className='font24 color2  font_hide couponDetails_goods_num'>{orderResult.couponTitle}</View>
            {orderStatusObj}
          </View>
        </View>
        <View className='couponDetails_goods_liner'></View>
        <>
          {setCode()}
          {list.length > 0 &&
          <View style={list[current]['status'] !== '0' ? {color: '#CCCCCC', textDecoration: 'line-through'} : {}}
                className={classNames('color1 font24 code_num')}>券码: {list[current]['verificationCode']}</View>}
          <View className='public_center color1 font24 code_count'>{current + 1 + '/' + list.length} </View>
          <View onClick={() => fn && fn()} className='public_center font24 color2 code_onRead'>
            <View className='onReadly_icon onReadly_iconBox'></View>
            如果券码不显示，点这里刷新
          </View>
          <View className='kolgoods_go public_auto font24 color1'>
            <View className='kolgoods_go_left public_center'>
              <View className='kolgoods_go_leftBox public_center' onClick={() => goGoodDetails(orderResult.couponCode)}>
                <View className='kolgoods_goIcon_box  shop_goods_icon'>
                </View>订单详情
              </View>
            </View>
            <View className='kolgoods_go_right public_center'>
              <View className='kolgoods_go_rightBox public_center'>
                <View className='kolgoods_goIcon_box shop_merchant_icon'></View>
                商品详情
              </View>
            </View>
          </View>
        </>
      </View>
    </View>
  )
}
