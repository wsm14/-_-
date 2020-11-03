import React from 'react'
import Taro from '@tarojs/taro'
import {Text, View} from "@tarojs/components";
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
  deleteFall
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
export const shopDetails = (_this, data, obj) => {
  return (
    <View className='shopDetails_box'>
      <View className='shopDetails_Img'>
        <View className='shopDetails_city'>
          <View className='shopDetails_city_icon'></View>
          <View className='shopDetails_city_font'>200m</View>
        </View>
        <View className='shopDetails_user'>
          <View className='user_profile'>

          </View>
          <View className='user_name font_hide'>
            鲜丰水果
          </View>
        </View>
      </View>
      <View className='shopDetails_dec'>
        <View className='shopDetails_shopName font_hide'>
          特价橘子特价橘子特价橘...
        </View>
        <View className='shopDetails_tag'>
          <View className='shopDetails_tag_box'>新鲜爆品</View>
          <View className='shopDetails_tag_box'>新鲜爆品</View>
          <View className='shopDetails_tag_box'>新鲜爆品</View>
        </View>
        <View className='shopDetails_biaoti'>哒卡乐专享价</View>
        <View className='shopDetails_price'>
          <View className='shopDetails_left'><Text style={{fontSize: Taro.pxTransform(20)}}>¥</Text> 9.9</View>
          <View className='shopDetails_right'>
            ¥ 22
          </View>
        </View>
        <View className='shopDetails_bean'>
          (990卡豆)
        </View>

      </View>
      {/*<View className='shopDetails_btnBox shopDetails_btnColor1'>*/}
      {/*  立即抢购*/}
      {/*</View>*/}
      <View className='shopDetails_btnColor2'>
      </View>
    </View>
  )
}


//商品标签
export const billboard = (_this, data, obj) => {
  return (
    <View className='billboard_box'>
      <View className='billboard_img'></View>
      <View className='billboard_title font_hide'>抹茶法式烤面包...</View>
    </View>
  )
}
//达人视频图文
export const exploreShop = (_this, data, obj) => {
  if(data){
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
        {beanFlag &&
        <View className={classNames('explore_bean', watchStatus === '1' && 'getbeanColor2')}>
          <View className={classNames('explore_lookGet', watchStatus === '0' ? 'explore_beanBg1' : 'explore_beanBg2')}>

          </View>
          {watchStatus === '1' ? `已捡${beanAmount}卡豆` : `观看可捡${beanAmount}卡豆`}
        </View>}
        <View className='explore_user'>
          <View className='explore_user_left'>
            <View className='explore_user_profile' style={{...backgroundObj(userProfile)}}></View>
            <View className='explore_user_name font_hide'>{username}</View>
            {/*  <View*/}
            {/*    className={classNames('explore_user_fallBox', userLikeStatus === '0' ? 'explore_user_color1' : 'explore_user_color2')}>*/}
            {/*    {userLikeStatus === '0' ? '未关注' : '已关注'}*/}
            {/*  </View>*/}
          </View>
          <View className='explore_user_right'>
            <View
              className={classNames('explore_user_zan ', userLikeStatus === '1' ? 'explore_user_zan_bg1' : 'explore_user_zan_bg2')}
              onClick={(e) => {
                e.stopPropagation();
                let that = _this
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
  const {
    merchantName,
    merchantId,
    merchantIdString,
    merchantLogo,
    perCapitaConsumption,
    businessTime,
    tag,
    merchantAddress
  } = data
  return (
    <View className='shopCard_box'>
      <View className='shop_card_details'>
        <View className='dakale_nullImage shop_card_left'
              style={merchantLogo ? {...backgroundObj(merchantLogo)} : {}}></View>
        <View className='shop_card_right'>
          <View className='shopCard_right1'>
            <View className='shopCard_userName font_hide'>
              {merchantName || '--'}
            </View>
            <View className='shopCard_go' onClick={() => navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`)}>
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
// GetDistance(lat,lnt,merchantLat,merchantLnt)||
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
               <View className='goods_box_font1'>{goodsName} <Text className='goods_box_font3'>({goodsNum}份)</Text></View>
               <View className='goods_box_font2'>¥{goodsPrice}</View>
             </View>
           )
         })}

      </View>
    </View>
  )
}
