import React, {useEffect, useState} from 'react'
import {Text, View} from "@tarojs/components";
import './../index.scss'
import classNames from 'classnames'
import Taro from "@tarojs/taro";
import {toast} from "@/common/utils";

export default (props) => {
  const {data} = props
  const [kolData, setKolData] = useState(null)
  const filterStyle = (str) => {
    switch (str) {
      case 'wx_lite':
        return '微信支付';
      case 'alipay':
        return '支付宝支付';
      case 'beanPay':
        return '卡豆支付';
    }
  }
  useEffect(() => {
    setKolData(data)
  }, [data])
  const setClipboard =(str) => {
    Taro.setClipboardData({
      data: str,
      success: function (res) {
       toast('已复制')
      },
      fail: function (res) {
        toast('复制失败')
      }
    })
  }
  if (kolData) {
    const {status, createTime, paySn, payType, payTime, orderSn, verificationTime,closeTime,closeReason} = kolData
    if (status === '0') {
      return (
        <View className='kolGoods_card'>
          <View className='kolGoods_cardBox'>
            <View className='font32 color1 bold'>订单信息</View>
            <View className='font24 public_auto kolGoods_cardHeight'>
              <View className='color2'>订单号码</View>
              <View className='font24 public_center' onClick={() =>setClipboard(orderSn)}>
                <Text className='color1'>{orderSn}</Text>
                <Text className='kolGoods_cardliner'></Text>
                <Text className='color4'>复制</Text>
              </View>
            </View>
            <View className='font24 public_auto kolGoods_cardHeight'>
              <View className='color2'>创建时间</View>
              <View className='color1'> {createTime}</View>
            </View>
            {/*<View className='font24 public_auto kolGoods_cardHeight'>*/}
            {/*  <View className='color2'>支付类型</View>*/}
            {/*  <View className='color1'>到店支付</View>*/}
            {/*</View>*/}
            {/*<View className='font24 public_auto kolGoods_payHeight'>*/}
            {/*  <View className='color2'>支付方式</View>*/}
            {/*  <View className='color1 public_center'>*/}
            {/*    <View className='zPay pay_icon_box'></View>*/}
            {/*    <View>支付宝支付</View>*/}
            {/*  </View>*/}
            {/*</View>*/}
            {/*<View className='font24 public_auto kolGoods_cardHeight'>*/}
            {/*  <View className='color2'>支付时间</View>*/}
            {/*  <View className='color1'> 2020-09-28  16:09:08</View>*/}
            {/*</View>*/}
          </View>
        </View>
      )
    } else if (status === '1' || status === '3'|| status === '6') {
      return (
        <View className='kolGoods_card'>
          <View className='kolGoods_cardBox'>
            <View className='font32 color1 bold'>订单信息</View>
            <View className='font24 public_auto kolGoods_cardHeight'>
              <View className='color2'>订单号码</View>
              <View className='font24 public_center' onClick={() =>setClipboard(orderSn)}>
                <Text className='color1'>{orderSn}</Text>
                <Text className='kolGoods_cardliner'></Text>
                <Text className='color4'>复制</Text>
              </View>
            </View>
            <View className='font24 public_auto kolGoods_payHeight'>
              <View className='color2'>支付方式</View>
              <View className='color1 public_center'>
                {payType !== 'beanPay' &&
                <View
                  className={classNames('pay_icon_box', payType === 'wx_lite' && 'wPay', payType === 'alipay' && 'zPay')}></View>
                }
                <View>{filterStyle(payType)}</View>
              </View>
            </View>
            <View className='font24 public_auto kolGoods_cardHeight'>
              <View className='color2'>创建时间</View>
              <View className='color1'> {createTime}</View>
            </View>
            <View className='font24 public_auto kolGoods_cardHeight'>
              <View className='color2'>支付时间</View>
              <View className='color1'> {payTime}</View>
            </View>
            {status === '3' &&
            <View className='font24 public_auto kolGoods_cardHeight'>
              <View className='color2'>商家核销时间</View>
              <View className='color1'> {verificationTime}</View>
            </View>}
          </View>
        </View>
      )
    }
    else if(status === '2'){
      return (
           <View className='kolGoods_card'>
             <View className='kolGoods_cardBox'>
               <View className='font32 color1 bold'>订单信息</View>
               <View className='font24 public_auto kolGoods_cardHeight'>
                 <View className='color2'>订单号码</View>
                 <View className='font24 public_center' onClick={() =>setClipboard(orderSn)}>
                   <Text className='color1'>{orderSn}</Text>
                   <Text className='kolGoods_cardliner'></Text>
                   <Text className='color4'>复制</Text>
                 </View>
               </View>
               {payType &&
               <View className='font24 public_auto kolGoods_payHeight'>
                 <View className='color2'>支付方式</View>
                 <View className='color1 public_center'>
                   {payType !== 'beanPay' &&
                   <View
                     className={classNames('pay_icon_box', payType === 'wx_lite' && 'wPay', payType === 'alipay' && 'zPay')}></View>
                   }
                   <View>{filterStyle(payType)}</View>
                 </View>
               </View>}

               <View className='font24 public_auto kolGoods_cardHeight'>
                 <View className='color2'>创建时间</View>
                 <View className='color1'> {createTime}</View>
               </View>
               {payTime &&
               <View className='font24 public_auto kolGoods_cardHeight'>
                 <View className='color2'>支付时间</View>
                 <View className='color1'> {payTime}</View>
               </View>
               }
               <View className='font24 public_auto kolGoods_cardHeight'>
                 <View className='color2'>关闭时间</View>
                 <View className='color1'> {closeTime}</View>
               </View>
               <View className='font24 public_auto kolGoods_cardHeight'>
                 <View className='color2'>关闭原因</View>
                 <View className='color1'> {closeReason}</View>
               </View>
             </View>
           </View>
      )
    }
  }
  return null
}
