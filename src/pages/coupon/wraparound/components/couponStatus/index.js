import React, {useEffect, useState} from "react";
import {Image, View} from "@tarojs/components";
import {navigateTo} from "@/common/utils";

export default (props) => {
  const {data = [], visible = true} = props
  const [close, onClose] = useState(true)
  const [list, setList] = useState([])
  const goMerchant = merchantId => {
    navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${merchantId}`)
  }
  const goCouponDetails = id => {
    navigateTo(`/pages/coupon/couponDetails/index?id=${id}`)
  }
  useEffect(() => {
    setList(data)
  }, [data])
  useEffect(() => {
    onClose(visible)
  }, [visible])
  let nullImage = 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/morenLogo.png'
  const couponType = {
    '0': (item) => {
      const {
        couponImg,
        merchantLogo,
        couponTitle,
        merchantName,
        couponName,
        dayNum,
        merchantIdString,
        userCouponIdString
      } = item
      return (<View className='wraparound_center_box' onClick={(e) => {
        e.stopPropagation();
        goCouponDetails(userCouponIdString)
      }}>
        <View className='wraparound_topBox' onClick={(e) => {
          e.stopPropagation();
          goMerchant(merchantIdString)
        }}>
          <View className='wraparound_logo'>
            <Image className='wraparound_logo' lazyLoad mode={"aspectFill"}
                   src={merchantLogo ? merchantLogo : nullImage}></Image>
          </View>
          <View className='wraparound_title font_hide'>{merchantName}</View>
          <View className='wraparound_data color3 font24'>还有{dayNum}天过期</View>
        </View>
        <View className='wraparound_couponBox'>
          <View className='wraparound_couponImg'>
            <Image className='wraparound_couponImg' lazyLoad mode={"aspectFill"}
                   src={couponImg ? couponImg : nullImage}></Image>
          </View>
          <View className='wraparound_couponContent'>
            <View className='wraparound_couponContent_title font_hide font28 color1 bold'>{couponName}</View>
            <View className='wraparound_couponContent_details font_hide font24 color2'>{couponTitle}</View>
          </View>
        </View>
        <View className='wraparound_liner'></View>
      </View>)
    },
    '1': (item) => {
      const {
        merchantIdString,
        couponImg,
        merchantLogo,
        couponTitle,
        merchantName,
        couponName,
        verificationTime,
        userCouponIdString
      } = item
      (<View className='wraparound_center_box' onClick={(e) => {
        e.stopPropagation();
        goCouponDetails(userCouponIdString)
      }}>
        <View className='wraparound_topBox' onClick={(e) => {
          e.stopPropagation();
          goMerchant(merchantIdString)
        }}>
          <Image className='wraparound_logo' lazyLoad mode={"aspectFill"}
                 src={merchantLogo ? merchantLogo : nullImage}></Image>
          <View className='wraparound_title font_hide'>{merchantName}</View>
          <View className='wraparound_data color2 font24'>已使用</View>
          <View className='wraparound_liner'></View>
        </View>
        <View className='wraparound_couponBox'>
          <Image className='wraparound_couponImg' lazyLoad mode={"aspectFill"}
                 src={couponImg ? couponImg : nullImage}></Image>
          <View className='wraparound_couponContent'>
            <View className='wraparound_couponContent1_title font_hide font28 color2 bold'>{couponName}</View>
            <View className='wraparound_couponContent1_details font_hide font24 color2'>{couponTitle}</View>
            <View className='wraparound_couponContent1_details font_hide font24 color2'>使用时间：{verificationTime}</View>
          </View>
        </View>
        <View className='wraparound_couponType_icon wraparound_couponType_type1'></View>
        <View className='wraparound_liner'></View>
      </View>)
    },
    '2': (item) => {
      const {
        merchantIdString,
        couponImg,
        merchantLogo,
        couponTitle,
        merchantName,
        couponName,
        activeEndDate,
        userCouponIdString
      } = item
      (<View className='wraparound_center_box' onClick={(e) => {
        e.stopPropagation();
        goCouponDetails(userCouponIdString)
      }}>
        <View className='wraparound_topBox' onClick={(e) => {
          e.stopPropagation();
          goMerchant(merchantIdString)
        }}>
          <Image className='wraparound_logo' lazyLoad mode={"aspectFill"}
                 src={merchantLogo ? merchantLogo : nullImage}></Image>
          <View className='wraparound_title font_hide'>{merchantName}</View>
          <View className='wraparound_data color2 font24'>已使用</View>
        </View>
        <View className='wraparound_couponBox'>
          <Image className='wraparound_couponImg' lazyLoad mode={"aspectFill"}
                 src={couponImg ? couponImg : nullImage}></Image>
          <View className='wraparound_couponContent'>
            <View className='wraparound_couponContent1_title font_hide font28 color2 bold'>{couponName}</View>
            <View className='wraparound_couponContent1_details font_hide font24 color2'>{couponTitle}</View>
            <View className='wraparound_couponContent1_details font_hide font24 color2'>过期时间：{activeEndDate}</View>
          </View>
        </View>
        <View className='wraparound_couponType_icon wraparound_couponType_type2'></View>
        <View className='wraparound_liner'></View>
      </View>)
    },
    '3': (item) => {
      const {
        merchantIdString,
        couponImg,
        merchantLogo,
        couponTitle,
        merchantName,
        couponName,
        dayNum,
        userCouponIdString
      } = item
      return <View className='wraparound_center_box' onClick={(e) => {
        e.stopPropagation();
        goCouponDetails(userCouponIdString)
      }}>
        <View className='wraparound_topBox' onClick={(e) => {
          e.stopPropagation();
          goMerchant(merchantIdString)
        }}>
          <View className='wraparound_logo'>
            <Image className='wraparound_logo' lazyLoad mode={"aspectFill"}
                   src={merchantLogo ? merchantLogo : nullImage}></Image>
          </View>
          <View className='wraparound_title font_hide'>{merchantName}</View>
          <View className='wraparound_data color3 font24'>还有{dayNum}天过期</View>
        </View>
        <View className='wraparound_couponBox'>
          <View className='wraparound_couponImg'>
            <Image className='wraparound_couponImg' lazyLoad mode={"aspectFill"}
                   src={couponImg ? couponImg : nullImage}></Image>
          </View>
          <View className='wraparound_couponContent'>
            <View className='wraparound_couponContent_title font_hide font28 color1 bold'>{couponName}</View>
            <View className='wraparound_couponContent_details font_hide font24 color2'>{couponTitle}</View>
          </View>
        </View>
      </View>
    },

  }
  return (
    <>
      {list.map((item, index) => {
        const {couponStatus} = item
        if (!close && index >= 2) {
          return null
        }
        return couponType[couponStatus](item)
      })}
      {((!close) && (list.length > 2)) &&
      <View className='wraparound_couponType_down' onClick={() => onClose(true)}></View>
      }
    </>


  )
}
