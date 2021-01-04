import React, {useState, useRef, useEffect} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {ScrollView, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import './index.scss'
import {toast,backgroundObj,getLat,getLnt,GetDistance,navigateTo} from "@/common/utils";
import classNames from 'classnames'
export default (props) => {
  const [data,setData] = useState(null)
  const {list,merchantData} = props
  useEffect(() => {
    setData(list)
  },[list])
  const goShopDetails = (merchantId, specialActivityIdString) => {
    navigateTo(`/pages/perimeter/favourableDetails/index?merchantId=${merchantId}&specialActivityId=${specialActivityIdString}`)
  }
  if(data && merchantData && data.length>0){
    const {
      address,
      userMerchantIdString,
      lat,
      lnt,
      merchantName
    } = merchantData
        return (
          <View className='favour_shopBox'>
          <View className='favour_title color6'>
            {console.log(merchantData)}
            <View className='favour_top font_hide'>{merchantName}</View>
            <View className='favour_accress'>
              <View className='favour_accressIcon'></View>
              <View className='favour_font font_hide'>{address}</View>
              <View className='font24'> | {GetDistance(getLat(),getLnt(),lat,lnt)}</View>
            </View>
            <View className='favour_daohang_icon'></View>
          </View>
            {data.map(item => {
              const {
                goodsName,
                goodsImg,
                oriPrice,
                realPrice,
                merchantIdString,
                specialActivityIdString
              } = item
              return (<>
                <View className='favour_body'>
                  <View className='favour_shopCenter'>
                    <View className='favourImg dakale_nullImage' style={{...backgroundObj(goodsImg)}}></View>
                    <View className='favour_content'>
                      <View className='favour_content_title font_hide color1 font28 bold'>
                        { goodsName}
                      </View>
                      <View className='favour_content_tag font20'>
                        <View className='favour_content_tagBox'>新鲜爆品</View>
                        <View className='favour_content_tagBox'>新鲜爆品</View>
                      </View>
                      <View className='favour_content_bean font20 bold color1c'>
                        <Text>¥</Text>
                        <Text className='font32'>{realPrice}</Text>
                        <Text className='font20 line_font'>({parseInt(Number(realPrice)*100)}卡豆)</Text>
                      </View>
                      <View className='favour_price'>
                        <Text className='color9'>哒卡乐专享价</Text>
                        <Text className='old_place'>¥{oriPrice}</Text>
                      </View>
                      <View className='favour_btn color6 font28'
                      onClick={() =>
                        goShopDetails(merchantIdString,specialActivityIdString)
                      }
                      >立即抢购</View>
                    </View>
                  </View>
                </View>
              </>)
            })}
          </View>)
  }
  else return null
}
