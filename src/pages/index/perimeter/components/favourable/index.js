import React, {useState, useRef, useEffect, useMemo} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {ScrollView, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import {permerter_fav} from '@/components/publicShopStyle'
import {httpGet} from '@/api/newRequest'
import {wxapiGet} from '@/api/api'
import {getMainRecommend} from '@/server/perimeter'
import './index.scss'
import {toast, backgroundObj, getLat, getLnt, GetDistance, navigateTo} from "@/common/utils";
import classNames from 'classnames'

const favourable = (props) => {
  const [activeStatus, setActiveStatus] = useState({specialGoods: '0'})
  const [data, setData] = useState(null)
  const [swiperList, setSwiper] = useState(null)
  const [count, setCount] = useState(0)
  const [] = useState()
  useEffect(() => {
    if (!swiperList || swiperList.length === 0) {
      getBanner()
      setList()
    }
  }, [])
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
    // httpGet({
    //   url: listSpecialGoods,
    //   data: {page: 1, limit: 10}
    // }, res => {
    //   const {specialGoodsList} = res
    //   setSwiper(specialGoodsList)
    // })
    getMainRecommend({}, res => {
      const {userMerchantList} = res
      console.log(userMerchantList)
      setSwiper(userMerchantList)
    })
  }
  const goShopDetails = (merchantId, specialActivityIdString) => {
    navigateTo(`/pages/perimeter/favourableDetails/index?merchantId=${merchantId}&specialActivityId=${specialActivityIdString}`)
  }
  const goFavourble = () => {
    navigateTo(`/pages/perimeter/perimeteRoducts/index`)
  }
  const goMerchant = (merchantId) => {
    navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${merchantId}`)
  }
  if (data) {
    const {specialGoods} = activeStatus
    const SwiperObj = {
      '0': (item, index) => {
        const {businessHub,lat, lnt,address, merchantName, categoryName, perCapitaConsumption,coverImg,userMerchantIdString} = item
        return (
          <View onClick={() => goMerchant(userMerchantIdString)} className={classNames('permerter_favourable_lunboImg', count === index ? 'le-active' : 'le-img')}>
            <View className='swper_paddings'>
              <View className='permerter_favourable_binssge'>
                <View className='permerter_favourable_merchantProfile dakale_nullImage' style={{...backgroundObj(coverImg)}}></View>
                <View className='permerter_favourable_merchantDetails'>
                  <View className='permerter_merchantDetails_name font_hide color1 bold'>{merchantName}</View>
                  <View className='permerter_merchantDetails_type  color2 font24'>
                    <View className='permerter_merchantDetails_IconBox  permerter_merchantDetails_IconMerchant'></View>
                    <View className='permerter_merchantDetails_font'>{categoryName}</View>
                    <View className='permerter_merchantDetails_liner'></View>
                    <View className='permerter_merchantDetails_font'>人均￥{perCapitaConsumption||0}</View>
                  </View>
                  {businessHub &&
                   <View className='permerter_merchantDetails_binsnissage color2 font24'>
                    <View className='permerter_merchantDetails_IconBox  permerter_merchantDetails_IconCity'></View>
                    <View className='permerter_merchantDetails_font'>{businessHub}</View>
                  </View>
                  }
                </View>
              </View>
            </View>
            <View className='permerter_favourable_liner'></View>
            <View className='permerter_favourable_limits  color2  font24'>
              <View className='permerter_merchantDetails_IconLimit permerter_merchantDetails_IconBox'></View>
              <View> {GetDistance(getLat(), getLnt(), lat, lnt)}</View>
              <View></View>
              <View className='font_hide'>{address}</View>
            </View>
            <View className='permerter_favourable_Merchantbtn'></View>
          </View>
        )
      },
      '1': (item, index) => {
        const {oriPrice, realPrice, specialActivityIdString, merchantIdString} = item
        return (
          <View onClick={() => goShopDetails(merchantIdString, specialActivityIdString)}
                className={classNames('permerter_favourable_lunboImg', count === index ? 'le-active' : 'le-img')}>
            <View className='permerter_favourable_goods'>
              <View style={{...backgroundObj(item.goodsImg)}}
                    className='permerter_favourable_left dakale_nullImage'>
                <View className='permerter_favourable_top'>
                  <View className='permerter_accress_icon'></View>
                  <View className='permerter_accress_limit font20 color6'>
                    {GetDistance(getLat(), getLnt(), item.lat, item.lnt)}
                  </View>
                </View>
                <View className='permerter_favourable_bottom main_fire'>
                  <View className='permerter_favourable_userProfile dakale_profile'
                        style={{...backgroundObj(item.merchantLogo)}}></View>
                  <View
                    className='permerter_favourable_name color6 font24 font_hide'>{item.merchantName}</View>
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
                <View
                  className='permerter_fav_bean color3 font20'>({'卡豆' + parseInt(realPrice * 100)})</View>
              </View>
            </View>
            <View className='beanQiang permerter_favourable_btn'></View>
          </View>
        )
      }
    }[specialGoods]

    return (
      <View className='permerter_favourable'>
        <View
          // onClick={() => goFavourble()}
          className='permerter_favourable_details color6'>
          <View className='permerter_favourable_title'>
            <Text className='font40 bold'>周边捡豆打卡好店</Text>
            {/*<Text className='permerter_favourable_icon fraover_go'></Text>*/}
          </View>
          <View className='permerter_favourable_dec font24'>到店打卡捡豆，豆豆抵消费</View>
          {swiperList &&
          <>
            <View className='permerter_favourable_lunbo' onClick={(e) => {
              e.stopPropagation();
            }}>
              <Swiper
                circular
                autoplay
                current={count}
                onChange={(e) => setCount(e.detail.current)}
                className='permerter_favourable_lunboText' previousMargin={Taro.pxTransform(96)}
                nextMargin={Taro.pxTransform(96)}>
                {swiperList.map((item, index) => {
                  return (
                    <SwiperItem>
                      {SwiperObj(item, index)}
                    </SwiperItem>
                  )
                })}
              </Swiper>

            </View>
            <View className='permerter_near'>
              {swiperList.map((item, index) => {
                return (
                  <View key={index}
                        className={classNames(index == count ? 'permerter_near_linerTrue' : 'permerter_near_false')}></View>
                )
              })}
            </View>
          </>
          }

        </View>
        {data.length > 1 ?
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
          </Swiper> :
          data.map(item => {
            return (
              <View className='permerter_favourable_child' style={backgroundObj(item.coverImg)}></View>
            )
          })
        }
      </View>
    )
  }
  return null
}
export default favourable
