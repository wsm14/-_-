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
          <View className="lookAround_select_merchantName font_hide">
            {merchantName}
          </View>
          <View className="lookAround_hot_limit">
            {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="lookAround_pay_hander">卡豆抵扣到手价</View>
        <View className="lookAround_pay_price bold">
          <Text className="lookAround_price_text  font20">¥ </Text>
          <Text className="bold font36">
            {computedBeanPrice(realPrice,payBeanCommission)}
          </Text>
          <View className="lookAround_bottom_left">¥ {oriPrice}</View>
        </View>
        {shareCommission > 0 && (
          <View className="lookAround_bean_border">
            <View
              style={{ border: "1px solid #ef476f" }}
              className="lookAround_tag_box"
            >
              赚¥{" "}
              {computedPrice(realPrice - merchantPrice, shareCommission)}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
