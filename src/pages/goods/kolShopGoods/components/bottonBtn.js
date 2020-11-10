import React, {useEffect, useState} from 'react'
import {View} from "@tarojs/components";
import './../index.scss'
import {toast} from "@/common/utils";
export default (props) => {
  const  {data} = props
  const [order,setOrderDetails] = useState({})
  useEffect(() => {
   setOrderDetails(data)
  },[data])

  const filterBtn = () => {
    const {
      status
    } = order
    switch (status) {
      case '6':  return(
        <View className='kolGoods_bottom_btn'>
          <View className='kolGoods_submit color2'>
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
