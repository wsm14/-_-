import React, { useMemo } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  computedPrice,
} from "@/utils/utils";
import "./index.scss";
//逛逛普通 商品瀑布流
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
    ownerIdString,
  } = item;
  return (
    <View
      className="lookAround_selectSpecal animated  fadeIn"
      onClick={() => linkTo(specialActivityIdString, ownerIdString)}
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

//逛逛自我游商品瀑布流
export const gameShop = (item, userInfo, linkTo) => {
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
    ownerIdString,
    commission,
  } = item;
  return (
    <View
      className="lookAround_selectSpecal animated  fadeIn"
      onClick={() => linkTo(specialActivityIdString, ownerIdString)}
    >
      <View
        style={backgroundObj(goodsImg)}
        className="lookAround_image_box"
      ></View>
      <View className="lookAround_content">
        <View className="lookAround_title  font_noHide">{goodsName}</View>
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
