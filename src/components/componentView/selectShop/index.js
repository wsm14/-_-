import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  setPeople,
  computedBeanPrice,
  computedPrice
} from "@/common/utils";
import "./index.scss";
export const selectShop = (item, userInfo, linkTo) => {
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const {
    goodsId,
    goodsName,
    goodsImg,
    oriPrice,
    realPrice,
    lnt,
    lat,
    status,
    goodsType,
    merchantAddress,
    merchantName,
    merchantLogo,
    merchantId,
    specialActivityIdString,
    merchantPrice,
    discount,
    merchantIdString,
  } = item;
  return (
    <View
      className="lookAround_selectSpecal animated  fadeIn"
      onClick={() => linkTo(specialActivityIdString, merchantIdString)}
    >
      <View
        style={backgroundObj(goodsImg)}
        className="lookAround_image_box"
      ></View>
      <View className="lookAround_content">
        <View className="lookAround_title  font_noHide">{goodsName}</View>
        <View className="lookAround_select_user">
          <View
            className="lookAround_select_userProfile"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className='lookAround_select_userHide font_hide'>
            <View className="lookAround_select_merchantName font_hide">
              {merchantName}
            </View>
            <View className="lookAround_hot_limit price_margin8">
              {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>

        </View>
        <View className="shopInit_hot_price color1 font_hide">
          <View className='font20'>原价:</View>
          <View className='shopInit_hot_priceMax font_hide font24 price_margin4 bold text_through'>{oriPrice}</View>
          <View className='font20 price_margin8'>优惠价: </View>
          <View className='font24 price_margin4 bold'>{realPrice}</View>
        </View>
        <View className='shopInit_bean_price'>
          卡豆抵扣后最低到手价
        </View>
        <View className='shopInit_bean_show'>
          <View className='color3 font36 bold shopInit_bean_showText'>
            <View className='color3 font20 bold'>¥</View>
            <View className='price_margin4'>{computedBeanPrice(realPrice, payBeanCommission)}</View>
          </View>
          {shareCommission > 0 && (
            <View
              style={{ border: "1px solid #ef476f" }}
              className="shopInit_bean_getMoney font_hide"
            >
              赚
              <Text className='bold'>¥{computedPrice(realPrice - merchantPrice, shareCommission)}</Text>
            </View>

          )}
        </View>

      </View>
    </View>
  );
};
