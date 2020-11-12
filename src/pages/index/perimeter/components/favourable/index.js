import React, {useState, useRef, useEffect} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {ScrollView, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import {permerter_fav} from '@/components/publicShopStyle'
import {wxapiGet,perimeter} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import './index.scss'
import {toast,backgroundObj,getLat,getLnt,GetDistance} from "@/common/utils";
import classNames from 'classnames'
import {navigateTo} from "../../../../../common/utils";
export default (props) => {
  const [data,setData] = useState(null)
  const [swiperList,setSwiper] = useState(null)
  const [count,setCount] = useState(0)
  useEffect(() => {
    getBanner()
    setList()
  },[])
  const getBanner = () => {
    const {wechatBanner} = wxapiGet
      httpGet({
        data: {bannerType: 'mainSpecial'},
        url: wechatBanner
      }, res => {
        const {bannerList} = res
        setData(bannerList)
      })
  }
  const setList = () => {
    const {listSpecialGoods} = perimeter
    httpGet({
      url: listSpecialGoods,
      data: {page:1,limit:10}
    }, res => {
      const {specialGoodsList} = res
      console.log(specialGoodsList)
      setSwiper(specialGoodsList)
    })
  }
  const goShopDetails = (merchantId,goodsId) => {
     navigateTo(`/pages/perimeter/favourableDetails/index?merchantId=${merchantId}&specialGoodsId=${goodsId}`)
  }
   if(data){
     return (
       <View className='permerter_favourable'>
         <View className='permerter_favourable_details color6'>
           <View className='permerter_favourable_title'>
             <Text className='font40 bold'>周边特惠逛</Text>
             <Text className='permerter_favourable_icon fraover_go'></Text>
           </View>
           <View className='permerter_favourable_dec font24'>周边特惠一站了解</View>
           {swiperList &&
            <>
           <View className='permerter_favourable_lunbo'>
             <Swiper
               circular
               current={count}
               onChange={(e) => setCount(e.detail.current)}
               className='permerter_favourable_lunboText' previousMargin={Taro.pxTransform(96)} nextMargin={Taro.pxTransform(96)}>
               {swiperList.map((item,index) => {
                 const {oriPrice,realPrice,goodsIdString,merchantIdString} = item
                 return (
                   <SwiperItem>
                     <View  onClick={() =>goShopDetails(merchantIdString,goodsIdString)} className ={classNames('permerter_favourable_lunboImg',count===index?'le-active' : 'le-img')}>
                       <View className='permerter_favourable_goods'>
                         <View style={{...backgroundObj(item.goodsImg)}} className='permerter_favourable_left dakale_nullImage'>
                           <View className='permerter_favourable_top'>
                             <View className='permerter_accress_icon'></View>
                             <View className='permerter_accress_limit font20 color6'>
                               {GetDistance(getLat(),getLnt(),item.lat,item.lnt)}
                             </View>
                           </View>
                           <View className='permerter_favourable_bottom main_fire'>
                             <View className='permerter_favourable_userProfile dakale_profile' style={{...backgroundObj(item.merchantLogo)}}></View>
                             <View className='permerter_favourable_name color6 font24 font_hide'>{item.merchantName}</View>
                           </View>
                         </View>
                         <View className='permerter_favourable_right'>
                           <View className='permerter_fav_title font32 color1 bold font_hide'>特价橘子</View>
                           <View className='permerter_fav_tag'>
                               <View className='permerter_fav_box'>新鲜爆品</View>
                               <View className='permerter_fav_box'>新鲜爆品</View>
                           </View>
                           <View className='permerter_fav_set color1 font20 font_hide'>哒卡乐专享价</View>
                           <View className='permerter_fav_price'>
                             <View className='permerter_fav_left'>
                               <Text
                               style={{fontSize: Taro.pxTransform(20)}}>¥</Text>{' ' + realPrice || ''}</View>
                             <View className='permerter_fav_right'>
                               ¥ {' ' + oriPrice || ''}
                             </View>
                           </View>
                           <View className='permerter_fav_bean color3 font20'>({'卡豆'+parseInt(realPrice*100)})</View>
                         </View>

                       </View>
                       <View className='beanQiang permerter_favourable_btn'></View>
                     </View>
                   </SwiperItem>
                 )
               })}
             </Swiper>

           </View>
             <View  className='permerter_near'>
             {swiperList.map((item,index) => {
               return (
                 <View key={index} className={classNames(index==count?'permerter_near_linerTrue':'permerter_near_false')}></View>
               )
             })}
             </View>
           </>
           }

         </View>
         {data.length > 1?
           <Swiper
             autoplay
             circular
             className='permerter_favourable_swiper'>
             {data.map(item => {
               return (
                 <SwiperItem className='permerter_favourable_child'>
                   <View className='permerter_favourable_child' style={backgroundObj(item.coverImg)}></View>
                 </SwiperItem>
               )
             })}
           </Swiper>:
           data.map(item => {
             return (
               <View className='permerter_favourable_child' style={backgroundObj(item.coverImg)}></View>
             )
           })
         }
       </View>
     )
   }
   return  null
}
