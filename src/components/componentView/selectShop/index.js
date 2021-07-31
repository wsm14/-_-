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
  computedPrice,
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
            className="lookAround_select_userProfile merchant_dakale_logo"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="lookAround_select_userHide font_hide">
            <View className="lookAround_select_merchantName font_hide">
              {merchantName}
            </View>
            <View className="lookAround_hot_limit price_margin8">
              {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
        </View>
        <View className="shopInit_hotOld_price color1 font_hide">
          <View className="font20">原价:</View>
          <View className="font24 bold price_margin4 text_through">
            ¥{oriPrice}
          </View>
        </View>
        <View className="shopInit_real_price font_hide">
          <View className="font20 color1">优惠价:</View>
          <View className="font28 color1 bold price_margin4  real_max font_hide">
            ¥{realPrice}
          </View>
          {shareCommission > 0 && (
            <View className="font22 color3 price_margin4">
              /赚
              <Text className="bold">
                ¥{computedPrice(realPrice - merchantPrice, shareCommission)}
              </Text>
            </View>
          )}
        </View>
        <View className="shopInit_new_bean">
          <View className="bean_getBigInfo shopInit_new_img"></View>
          <View className="shopInit_new_pay font_hide">
            ¥{computedPrice(realPrice, payBeanCommission)}
          </View>
        </View>
      </View>
    </View>
  );
};
