import React, {useEffect, useState} from 'react'
import {View} from "@tarojs/components";
import './../index.scss'
import {toast} from "@/common/utils";
import Taro from "@tarojs/taro";
import {navigateTo} from "../../../../common/utils";
const goSpeGoods = (merchantId, specialActivityId) => {
  navigateTo(`/pages/perimeter/favourableDetails/index?merchantId=${merchantId}&specialActivityId=${specialActivityId}`)
}
//再次Spe下单
const goKolGoods = (merchantId, kolActivityId, kolMomentsId) => {
  navigateTo(`/pages/perimeter/shopDetails/index?merchantId=${merchantId}&kolActivityIdString=${kolActivityId}&kolMomentsId=${kolMomentsId}`)
}
export default (props) => {
  const  {data,remove,deleteSn,closeSn} = props
  const [order,setOrderDetails] = useState({})
  useEffect(() => {
   setOrderDetails(data)
  },[data])
  const getPay = () => {
    const {orderSn,orderType } = order
    navigateTo(`/pages/goods/payWeex/index?orderSn=${orderSn}&orderType=${orderType}`)
  }
  const getMerchant  = () => {
     const {orderDesc = {},kolMomentsIdString,orderType} = order
     if(orderDesc){
       let link  =  JSON.parse(orderDesc)
       const {merchantIdString,kolGoods = {},specialGoods= {}} =  link
       if(orderType === 'specialGoods'){
         goSpeGoods(merchantIdString,specialGoods.activityIdString)
       }
       else  {
         goKolGoods(merchantIdString,kolGoods.activityIdString,kolMomentsIdString)
       }
     }
     else {
       toast('参数缺失')
     }
  }
  const filterBtn = () => {
    const {
      status
    } = order
    console.log(order)
    switch (status) {
      case '0': return (
        <View className='kolGoods_bottom_btn'>
          <View className='kolGoods_submit color2' onClick={() => closeSn()} style={{marginRight:`${Taro.pxTransform(24)}`}}>
            取消订单
          </View>
          <View className='kolGoods_submit1 color4' onClick={() => getPay()}>
            去付款
          </View>
        </View>
      );break;
      case '1': return (
        <View className='kolGoods_bottom_btn' onClick={() => getMerchant()}>
          <View className='kolGoods_submit1 color4'>
            再来一单
          </View>
        </View>
      );break;
      case '2': return (
        <View className='kolGoods_bottom_btn'>
          <View className='kolGoods_submit color2' onClick={() => deleteSn()} style={{marginRight:`${Taro.pxTransform(24)}`}}>
            删除订单
          </View>
          <View className='kolGoods_submit1 color4' onClick={() => getMerchant()}>
            重新购买
          </View>
        </View>
      );break;
      case '3': return (
        <View className='kolGoods_bottom_btn'>
          <View className='kolGoods_submit color2' onClick={() => deleteSn()} style={{marginRight:`${Taro.pxTransform(24)}`}}>
            删除订单
          </View>
          <View className='kolGoods_submit1 color4' onClick={() => getMerchant()}>
            再次购买
          </View>
        </View>
      );break;
      case '6':  return(
        <View className='kolGoods_bottom_btn'>
          <View className='kolGoods_submit color2' onClick={() => remove()}>
            取消申请
          </View>
        </View>
      );
      default: return null
    }
  }
  return (
    <View className='kolGoods_bottom_btnBox'>
      {filterBtn()}
    </View>
  )
}
