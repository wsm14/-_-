import React, {useEffect, useState} from 'react'
import {View} from "@tarojs/components";
import classNames from 'classnames'
import './../index.scss'
import {filterPayStatus} from '@/common/utils'
export default (props) => {
  const {data} = props
  const [kolData, setKolData] = useState({})
  useEffect(() => {
    if(data){
      setKolData(data)
    }
  },[data])
  const filterImage = () => {
    if(kolData){
      switch (kolData.status) {
        case '0': return 'kolGoodsTitle_iconBox kolGoodsTitle_icon2';
        case '1': return 'kolGoodsTitle_iconBox kolGoodsTitle_icon2';
        case '2': return 'kolGoodsTitle_iconBox kolGoodsTitle_icon3';
        case '3': return 'kolGoodsTitle_iconBox kolGoodsTitle_icon1';
        case '4': return 'kolGoodsTitle_iconBox kolGoodsTitle_icon2';
        case '5': return 'kolGoodsTitle_iconBox kolGoodsTitle_icon3';
        case '6': return 'kolGoodsTitle_iconBox kolGoodsTitle_icon2';
      }
    }
     return null
  }
  console.log(filterImage())
  return (
    <View className='kolGoodsTitle_top'>
      <View className='kolGoodsTitle_status'>
        <View className={classNames(filterImage())}></View>
        <View className='kolGoodsTitle_font'>{filterPayStatus(kolData.status)}</View>
      </View>
      <View className='kolGoodsTitle_dec'>
        {kolData.closeReason}
      </View>
    </View>
  )
}
