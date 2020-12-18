import React from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View, CoverView, CoverImage} from "@tarojs/components";
import {
  filterLogin,
  navigateTo,
  backgroundObj,
  setPeople,
  computedHeight,
  filterTime,
  NavHeight,
  toast,
  GetDistance,
  goDown,
  filterStrList,
  deleteFollow,
  saveFollow,
  saveFall,
  deleteFall,
  getLat,
  getLnt
} from '@/common/utils'
import classNames from 'classnames'
import './index.scss'
//代金券
export const coupons = (_this, data, obj) => {
  return (
    <View className='coupon_box'>
      <View className='coupon_content'>
        <View className='coupon_userPro'></View>
        <View className='coupon_details'>
          <View className='coupon_one'>
            <View className='coupon_left'>
              100元代金券
            </View>
            <View className='coupon_right'>
              <Text style={{fontSize: Taro.pxTransform(24)}}>¥ </Text>
              5
            </View>
          </View>
          <View className='coupon_two'>
            <View className='coupon_two_left'>
              哒卡乐用户专享
            </View>
            <View className='coupon_two_right'>
              (500卡豆)
            </View>
          </View>
          <View className='coupon_three'>
            <View className='coupon_three_left'>
              每人限购3张
            </View>
            <View className='coupon_three_right'>
              立即抢购
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
//商品标签
export const shopDetails = (data, obj) => {
  if (data) {
    const {
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      merchantName,
      specialActivityIdString,
      merchantLogo, lat, lnt, merchantIdString
    } = data
    return (
      <View className='shopDetails_box'>
        <View className='shopDetails_Img dakale_nullImage'>
          <Image src={goodsImg} className='image_box' lazyLoad mode='center'></Image>
          <View className='shopDetails_city'>
            <View className='shopDetails_city_icon'></View>
            <View className='shopDetails_city_font'>{GetDistance(getLat(), getLnt(), lat, lnt,)}</View>
          </View>
          <View className='shopDetails_user'>
            <View className='user_profile dakale_profile' style={backgroundObj(merchantLogo)}>

            </View>
            <View className='user_name font_hide'>
              {merchantName}
            </View>
          </View>
        </View>
        <View className='shopDetails_dec'>
          <View className='shopDetails_shopName font_hide'>
            {goodsName}
          </View>
          <View className='shopDetails_tag'>
            <View className='shopDetails_tag_box'>新鲜爆品</View>
            <View className='shopDetails_tag_box'>新鲜爆品</View>
          </View>
          <View className='shopDetails_biaoti'>哒卡乐专享价</View>
          <View className='shopDetails_price'>
            <View className='shopDetails_left'><Text
              style={{fontSize: Taro.pxTransform(20)}}>¥</Text>{' ' + realPrice || ''}</View>
            <View className='shopDetails_right'>
              ¥ {' ' + oriPrice || ''}
            </View>
          </View>
          <View className='shopDetails_bean'>
            ({realPrice * 100 || ''}卡豆)
          </View>

        </View>
        <View className='shopDetails_btnBox shopDetails_btnColor1'
              onClick={() => navigateTo(`/pages/perimeter/favourableDetails/index?merchantId=${merchantIdString}&specialActivityId=${specialActivityIdString}`)}>
          立即抢购
        </View>
        {/*<View className='shopDetails_btnColor2'>*/}
        {/*</View>*/}
      </View>
    )
  } else return null
}
//商品标签
export const billboard = (_this, data, obj) => {
  if (data) {
    const {
      goodsImg,
      goodsName

    } = data
    return (
      <View className='billboard_box'>
        <View className='billboard_img dakale_nullImage' style={goodsImg ? backgroundObj(goodsImg) : {}}>
        </View>
        <View className='billboard_title font_hide'>{goodsName}</View>
      </View>
    )
  }
  return null
}
//达人视频图文
export const exploreShop = (_this, data, fn) => {
  if (data) {
    const {
      kolMomentsId,
      contentType,
      userId,
      userIdString,
      likeAmount,
      topicName,
      frontImage,
      beanAmount,
      length,
      title,
      username,
      userProfile,
      imageNum,
      frontImageWidth,
      frontImageHeight,
      watchStatus,
      merchantLnt,
      merchantLat,
      merchantAddress,
      userLikeStatus,
      beanFlag
    } = data
    console.log(data)
    return (
      <View className='explore_box'>
        <View className='explore_img dakale_nullImage' style={{...backgroundObj(frontImage)}}
              onClick={() => {
                if (contentType === 'video') {
                  navigateTo(`/pages/kol/shareVideo/index?kolMomentId=${kolMomentsId}`)
                } else {
                  navigateTo(`/pages/kol/shareImage/index?kolMomentId=${kolMomentsId}`)
                }
              }}
        >
          {contentType == 'video' ?
            <View className='explore_share_imgTag'>
              {filterTime(length)}
            </View> :
            <View className='explore_share_videoTag'>
              <View className='explore_share_imgIcon'></View>
              <View className='explore_share_imgfont'>{imageNum}</View>
            </View>
          }
          {contentType == 'video' && <View className='explore_video'></View>}
          <View className='explore_share_accress'>
            <View className='explore_share_limitIcon'></View>
            <View className='explore_share_limit'>{''} {merchantAddress || ''}  </View>
          </View>
        </View>
        <View className='explore_message font_noHide'>
          {topicName && <View className='tip_box'>
            <View className='explore_tip font_hide'>{'#' + topicName}</View>
          </View>}
          {title}
        </View>
        {beanFlag === '1' &&
        <View className={classNames('explore_bean', watchStatus === '1' && 'getbeanColor2')}>
          <View className={classNames('explore_lookGet', watchStatus === '0' ? 'explore_beanBg1' : 'explore_beanBg2')}>

          </View>
          {watchStatus === '1' ? `已捡${beanAmount}卡豆` : `观看可捡${beanAmount}卡豆`}
        </View>}
        <View className='explore_user'>
          <View className='explore_user_left'
                onClick={() => navigateTo(`/pages/newUser/userDetails/index?userStingId=${userIdString}&type=share`)}>
            <View className='explore_user_profile' style={{...backgroundObj(userProfile)}}></View>
            <View className='explore_user_name font_hide'>{username}</View>
          </View>
          <View className='explore_user_right'>
            <View
              className={classNames('explore_user_zan ', userLikeStatus === '1' ? 'explore_user_zan_bg1' : 'explore_user_zan_bg2')}
              onClick={(e) => {
                e.stopPropagation();
                let that = _this
                if (fn) {
                  return fn()
                }
                const {
                  kolMomentsInfo: {userLikeStatus}, kolMomentsInfo
                } = that.state
                if (userLikeStatus === '1') {
                  deleteFall({
                    kolMomentsId: kolMomentsId,
                  }, () => {
                    that.setState({
                      kolMomentsInfo: {
                        ...kolMomentsInfo,
                        userLikeStatus: '0',
                        likeAmount: kolMomentsInfo.likeAmount - 1
                      }
                    })
                  })
                } else {
                  saveFall({
                    kolMomentsId: kolMomentsId,
                  }, () => {
                    that.setState({
                      kolMomentsInfo: {
                        ...kolMomentsInfo,
                        userLikeStatus: '1',
                        likeAmount: kolMomentsInfo.likeAmount + 1
                      }
                    })
                  })
                }
              }}></View>
            <View className='explore_user_number'>{likeAmount}</View>
          </View>
        </View>
      </View>
    )
  }

}
//店铺卡片
export const shopCard = (_this, data, obj) => {
  if (data) {
    const {
      merchantName,
      merchantId,
      merchantIdString,
      merchantLogo,
      perCapitaConsumption,
      businessTime,
      tag,
      merchantAddress,
      lat, lnt
    } = data
    return (
      <View className='shopCard_box'>
        <View className='shop_card_details'>
          <View className='dakale_nullImage shop_card_left'
                style={merchantLogo ? {...backgroundObj(merchantLogo)} : {}}>

            <View className='merchant_mit  public_center font20 color6'>
              {'距你' + GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
          <View className='shop_card_right'>
            <View className='shopCard_right1'>
              <View className='shopCard_userName font_hide'>
                {merchantName || '--'}
              </View>
              <View className='shopCard_go'
                    onClick={() => navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`)}>
              </View>
            </View>
            <View className='shopCard_right2 font_hide'>
              {`人均￥${perCapitaConsumption || 0}元 | ${businessTime}`}
            </View>
            <View className='shopCard_right3'>
              {filterStrList(tag).map(item => {
                return (
                  <View className='shopCard__right3_tags'>
                    {item}
                  </View>
                )
              })}

            </View>
            <View className='shopCard_right4 font_hide'>
              杭州市萧山区 | {merchantAddress}
            </View>
          </View>
        </View>
      </View>
    )
  }
  return null
}

//套餐详情
export const shopGoodsDetails = (_this, data, obj) => {
  const list = JSON.parse(data) || []
  return (
    <View className='goods_boxs'>
      <View className='goods_box_details'>
        <View className='goods_box_title'>套餐详情</View>
        {list.map(item => {
          const {
            goodsName,
            goodsNum,
            goodsPrice
          } = item
          return (
            <View className='goods_box_center'>
              <View className='goods_box_font1 font_hide'>{goodsName}
                <Text
                  className='goods_box_font3'>({goodsNum}份)</Text>
              </View>
              <View className='goods_box_font2'>¥{goodsPrice}</View>
            </View>
          )
        })}

      </View>
    </View>
  )
}

export const createdShareKol = (item) => {
  const {
    frontImage,
    frontImageHeight,
    frontImageWidth,
    merchantName,
    contentType,
    length,
    topicName,
    title,
    watchStatus,
    beanAmount,
    userProfile,
    username,
    likeAmount,
    imageNum,
    merchantAddress,
    userLikeStatus,
    beanFlag,
    kolMomentsId,
    merchantLat,
    merchantLnt
  } = item
  return (
    <View className='userDetails_falls_details' onClick={() => {
      if (contentType === 'video') {
        navigateTo(`/pages/kol/shareVideo/index?kolMomentId=${kolMomentsId}`)
      } else {
        navigateTo(`/pages/kol/shareImage/index?kolMomentId=${kolMomentsId}`)
      }
    }}>
      <View className='userDetails_falls_makebg'
            style={{
              ...backgroundObj(frontImage),
              height: Taro.pxTransform(computedHeight(frontImageWidth, frontImageHeight, 335))
            }}>
        {contentType == 'video' ?
          <View className='userDetails_share_imgTag'>
            {filterTime(length)}
          </View> :
          <View className='userDetails_share_videoTag'>
            <View className='userDetails_share_imgIcon'></View>
            <View className='userDetails_share_imgfont'>{imageNum}</View>
          </View>
        }
        <View className='userDetails_share_accress'>
          <View className='userDetails_share_limitIcon'></View>
          <View
            className='userDetails_share_limit'>{GetDistance(getLat(),
            getLnt(), merchantLat, merchantLnt) + ''} {merchantAddress || ''}  </View>
        </View>
      </View>
      <View className='userDetails_share_about'>
        {topicName && <View className='userDetails_share_tip'>{'#' + topicName}</View>}
        <View className='userDetails_share_title'>{title}</View>
        {beanFlag == '1' ?
          watchStatus == '1' ?
            <View className='userDetails_share_getBean getbeanColor2'>
              已捡{beanAmount}豆
            </View>
            :
            <View className='userDetails_share_getBean getbeanColor1'>
              观看可捡{beanAmount}豆
            </View>
          : null
        }

        <View className='userDetails_share_aboutUser'>
          <View className='userDetails_share_userbox'>
            <View style={{...backgroundObj(userProfile)}} className='userDetails_share_userProfile'>

            </View>
            <View className='userDetails_share_userName'>
              {username}
            </View>
          </View>
          <View className='userDetails_share_status'>
            <View
              className={classNames(userLikeStatus == '1' ? 'status_box userDetails_share_icon1' : 'status_box userDetails_share_icon2')}>
            </View>
            <View className='userDetails_share_nums'>{setPeople(likeAmount)}</View>
          </View>
        </View>
      </View>
    </View>
  )
}
//达人带货tab ui
export const createMerchants = (item) => {
  const {
    address,
    brandFlag,
    businessHub,
    categoryName,
    cityName,
    coverImg,
    districtName,
    lat,
    lnt,
    markBean,
    markFlag,
    merchantName,
    provinceName,
    specialGoodsAmount,
    specialGoodsFlag,
    merchantId,
    userMerchantIdString
  } = item
  return (
    <View className='createMerchant_box'
          onClick={() => navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${merchantId}`)}>
      <View className='createMerchant_image dakale_nullImage'
            style={backgroundObj(coverImg)}>
        <View className='createMerchant_toast'>
          <View className='createMerchant_city'>
            <View className='createMerchant_city_icon'></View>
            <View className='createMerchant_city_font color6 font_hide'>
              {GetDistance(getLat(), getLnt(), lat, lnt) + ' ' + address}</View>
          </View>
        </View>
      </View>
      <View className='createMerchant_center'>
        <View className='font28 color1 bold createMerchant_merchantTitle font_hide'> {merchantName} </View>
        <View className='font24 color2 createMerchant_shopRadius'>
          {businessHub && businessHub + '·'}{categoryName}
        </View>
        {markFlag && markBean !== 0 &&
        <View className='merchant_take_card font24 color9 bold'>
          到店打卡捡豆{markBean}
        </View>
        }
        {specialGoodsFlag && specialGoodsAmount !== 0 &&
        <View className='merchant_take_special'>
          {specialGoodsAmount}款特价热卖中
        </View>
        }
      </View>
    </View>
  )
}
//店铺 ui
export const createMerchantByMap = (item) => {

  const {coverImg, merchantName, businessHub, categoryName, perCapitaConsumption, lat, lnt,markFlag,markBean} = item
  return (
    <CoverView className='createMerchantByMap_fathers'>
      <CoverView className='createMerchantByMap_box'>
        <CoverView className='createMerchantByMap_child_box'>
          <CoverImage className='createMerchantByMap_image' src={coverImg}></CoverImage>
          <CoverView className='createMerchantByMap_child_right'>
            <CoverView className='createMerchantByMap_text'>
              <CoverView className='createMerchantByMap_child_title1 font_hide color1 font28'>{merchantName}</CoverView>
              <CoverView className='createMerchantByMap_child_title2 public_auto'>
                {businessHub && <CoverView style={{marginRight: Taro.pxTransform(12)}}>{businessHub + ''}</CoverView>}
                {categoryName && <CoverView style={{marginRight: Taro.pxTransform(12)}}>{categoryName + ' '}</CoverView>}
                {perCapitaConsumption && <CoverView>{'人均' + perCapitaConsumption + ' '}</CoverView>}
                <CoverView
                  className='createMerchantByMap_child_marginRight'>距你 {GetDistance(getLat(), getLnt(), lat, lnt)}</CoverView>
              </CoverView>
              <CoverView className='createMerchantByMap_child_title3'>
                <CoverView className='createMerchantByMap_child_tags'>人气商家</CoverView>
                <CoverView className='createMerchantByMap_child_tags'>品牌连锁</CoverView>
              </CoverView>
            </CoverView>
          </CoverView>
        </CoverView>
      </CoverView>
      {markFlag === '1' &&
      <CoverView className='createMerchantByMap_bottomBox public_center bold color6'>
      <CoverView>到店打卡捡{markBean}</CoverView>
      <CoverImage className='createMerchantByMap_bottom_image' src={'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon358.png'}></CoverImage></CoverView>
      }
    </CoverView>

  )
}
export const goodsNullStatus = (_this, data, obj) => {
  return (
    <View className='goodsNullStatus'>
      <View className='goodsNullStatus_image'></View>
      <View className='goodsNullStatus_goods'>您还没有相关的订单哦</View>
    </View>
  )
}
export const nullShop = () => {
  return (
    <View className='nullShop_box'>
      <View className='nullShop_img'></View>
      <View className='nullShop_font'>来晚了，商品已下架</View>
    </View>
  )
}
export const nullMerchantFav = () => {
  return (
    <View className='nullMerchantFav_box'>
      <View className='nullMerchantFav_img'></View>
      <View className='nullMerchantFav_font'>没有找到相关商家，换一个关键词试试吧</View>
      <View className='nullMerchantFav_img_title color1 font28'>- 你可能想找 -</View>
    </View>
  )
}
export const nullGoodsFav = () => {
  return (
    <View className='nullGoodsFav_box'>
      <View className='nullGoodsFav_img'></View>
      <View className='nullGoodsFav_font'>没有找到相关商品，换一个关键词试试吧</View>
      <View className='nullGoodsFav_img_title color1 font28'>- 你可能喜欢 -</View>
    </View>
  )
}
