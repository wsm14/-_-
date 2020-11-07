import React, {useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import {ScrollView, Text, View} from "@tarojs/components";
import InterTime from '@/components/InterTime'
import {filterPayStatus, backgroundObj, filterPayColor} from '@/common/utils'
import './index.scss'
import {navigateTo} from "@/common/utils";

export default (props) => {
  const {list, pageDown} = props
  const [data, setData] = useState([])
  useEffect(() => {
    setData(list)
  }, [list])
  const createCodeGoods = (item) => {
    return (
      <View className='createGood_box'>
        <View className='createGood_title'>
          <View className='createGood_title_box'>
            <View className='createGood_iconBox createGood_bg1'>
              扫码
            </View>
            <View className='createGood_merchantName font_hide'>必胜客（下沙宝龙店)</View>
            <View className='createGood_merchantgo'></View>
            <View className='createGood_status status_color1'>已完成</View>
          </View>
        </View>
        <View className='createGood_content'>
          <View className='createdGood_details_box'>
            <View className='createdGood_details_image dakale_nullImage'></View>
            <View className='createdGood_details_setting'>
              <View className='createdGood_details_title font_noHide'>
                特价牛排特价牛排特价
                特价牛排特价牛排特…
              </View>
            </View>
            <View className='createdGood_details_price'>
              <Text className='createdGood_details_priceFont1'>
                ¥
              </Text>
              <Text className='createdGood_details_priceFont2'>
                100
              </Text>
              <Text className='createdGood_details_priceFont3'>
                .45
              </Text>
            </View>
          </View>
          <View className='createdGood_details_timeBox'>
            <View className='time_color1'>
              支付时间：2020-09-28 16:09:08
            </View>
            <View className='createdGood_time_look'>
              查看
              <View className='createdGood_time_lookIcon'></View>
            </View>
          </View>
        </View>
      </View>
    )
  }
  const createShopGoods = (item) => {
    const {payFee, orderDesc, status} = item
    let merchant = orderDesc && JSON.parse(orderDesc)
    return (
      <View className='createGood_box' key={item.payFee}>
        {createShopTop(item, merchant)}
        <View className='createGood_content'>
          <View className='createdGood_details_box'>
            <View className='createdGood_details_image dakale_nullImage'
                  style={{...backgroundObj(merchant.merchantImg)}}></View>
            <View className='createdGood_details_setting'>
              <View className='createdGood_details_title font_noHide'>
                {merchant.kolGoods.goodsName}
              </View>
              <View className='createdGood_details_num'>
                数量:{merchant.kolGoods.goodsCount}
              </View>
            </View>
            <View className='createdGood_details_price'>
              <Text className='createdGood_details_priceFont1'>
                ¥{" "}
              </Text>
              <Text className='createdGood_details_priceFont2'>
                {payFee}
              </Text>
              {/*<Text className = 'createdGood_details_priceFont3'>*/}
              {/*  .45*/}
              {/*</Text>*/}
            </View>
          </View>
          <View className='createdGood_details_timeBox'>
            <View className='time_color2'>
              有效期至：{merchant.kolGoods.useStartTime} - {merchant.kolGoods.useEndTime}
            </View>
          </View>
        </View>
        {createBottom(item)}
      </View>
    )
  }
  const createShopTop = (item, merchant) => {
    const {
      orderDesc,
      status,
      payFee
    } = item
    return (
      <View className='createGood_title'
            onClick={() => navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${merchant.merchantIdString}`)}>
        <View className='createGood_title_box'>
          <View className='createGood_iconBox createGood_bg2'>
            商品
          </View>
          <View className='createGood_merchantName font_hide'>{merchant.merchantName}</View>
          <View className='createGood_merchantgo'></View>
          <View className={classNames('createGood_status', filterPayColor(status))}>{filterPayStatus(status)}</View>
        </View>
      </View>
    )
  }
  const updateStatus = (item) => {
    setData(data.map(val => {
      if (val.orderSn === item.orderSn) {
        val.status = '2'
      }
      return val
    }))
  }
  const createBottom = (item) => {
    const {
      status,
      payTime,
      orderSn
    } = item
    console.log(item)
    switch (status) {
      case '0':
        return (
          <View className='createGood_bottom'>
            <View className='createGood_btn_style'>
              <View className='createGood_btn_left'>
                待付款：<Text style={{color: 'rgba(51, 51, 51, 1)'}}>{<InterTime fn={() => updateStatus(item)}
                                                                             times={payTime}></InterTime>}</Text>
              </View>
              <View className='createGood_btn_right createGood_btn_color1'
                    onClick={() => navigateTo(`/pages/goods/kolShopGoods/index?orderSn=${orderSn}`)}>去付款</View>
            </View>
          </View>
        )
      case '1':
        return (
          <View className='createGood_bottom'>
            <View className='createGood_btn_style'>
              <View className='createGood_btn_left'>
              </View>
              <View className='createGood_btn_right createGood_btn_color1'
                    onClick={() => navigateTo(`/pages/goods/kolShopGoods/index?orderSn=${orderSn}`)}>去使用</View>
            </View>
          </View>
        )
      case '2':
        <View className='createGood_bottom'>
          <View className='createGood_btn_style'>
            <View className='createGood_btn_left'>
              {/*待付款：<Text style={{color: 'rgba(51, 51, 51, 1)'}}>13 : 23</Text>*/}
            </View>
            <View onClick={() => navigateTo(`/pages/goods/kolShopGoods/index?orderSn=${orderSn}`)}
                  className='createGood_btn_right createGood_btn_color1'>再次购买</View>
          </View>
        </View>
      case '3':
        return (
          <View className='createGood_bottom'>
            <View className='createGood_btn_style'>
              <View className='createGood_btn_left'>
                {/*待付款：<Text style={{color: 'rgba(51, 51, 51, 1)'}}>13 : 23</Text>*/}
              </View>
              <View className='createGood_btn_right createGood_btn_color1'
                    onClick={() => navigateTo(`/pages/goods/kolShopGoods/index?orderSn=${orderSn}`)}>重新购买</View>
            </View>
          </View>
        )
      case '6':
        return (
          <View className='createGood_bottom'>
            <View className='createGood_btn_style'>
              <View className='createGood_btn_left'>
                {/*待付款：<Text style={{color: 'rgba(51, 51, 51, 1)'}}>13 : 23</Text>*/}
              </View>
              <View className='createGood_btn_right createGood_btn_color2'
                    onClick={() => navigateTo(`/pages/goods/kolShopGoods/index?orderSn=${orderSn}`)}>
                {/*再次购买*/}
                取消申请
              </View>
            </View>
          </View>
        )
    }
  }
  return (
    <ScrollView
      scrollY
      onScrollToLower={() => pageDown()}
      className='goodsView'
    >
      {data.map(item => {
        const {orderType} = item
        if (orderType === 'kolGoods') {
          const {
            status,
            payTime
          } = item;
          return createShopGoods(item)
        } else if (orderType === 'scan') {
          return createCodeGoods(item)
        }
      })}
    </ScrollView>

  )
}
