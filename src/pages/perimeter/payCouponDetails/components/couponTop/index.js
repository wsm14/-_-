/*
店铺详情优惠券公共样式
*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Router from "@/common/router";
import {
  computedPrice,
  setBuyRule,
  backgroundObj,
  computedBeanPrice,
} from "@/common/utils";
import classNames from "classnames";
import ButtonView from "@/components/Button";
import "./../../index.scss";
export default ({
  data,
  configUserLevelInfo,
  setCollection,
  getShareInfo,
  onChange,
}) => {
  const {
    anytimeRefund,
    expireRefund,
    buyPrice,
    buyRule,
    dayMaxBuyAmount,
    maxBuyAmount,
    couponName,
    couponPrice,
    personLimit,
    userCollectionStatus,
    buyUserImageList = [],
    rightFlag = "0",
    paymentModeObject = {},
  } = data;
  const { payBeanCommission = 50 } = configUserLevelInfo;
  const { bean = 10, cash = 1 } = paymentModeObject;
  const templateSelect = () => {
    if (buyRule === "unlimited") {
      return `不限购`;
    } else {
      if (buyRule === "personLimit") {
        return `每人限购${personLimit}份`;
      } else {
        return `每人每天限购${dayMaxBuyAmount}份`;
      }
    }
  };

  return (
    <View className="coupon_bg">
      <View className="coupon_top_bg">
        <View className="coupon_top_title font_hide">
          {buyPrice} 元代 {couponPrice}元抵扣券
        </View>
        <View className="coupon_top_name  font_noHide">{couponName}</View>
      </View>
      {rightFlag === "1" ? (
        <>
          <View className="couponInfo_box">
            <View className="couponInfo_box_left">卡豆价:</View>
            <View className="couponInfo_box_right">
              ¥{cash.toFixed(2)}+{bean}卡豆 
            </View>
          </View>
          <View className="couponInfo_rel">
            <Text className="color2 font28"> 原价:</Text>
            <Text className="font36 font_hide price_margin4 color2 bold text_through">
              ¥{couponPrice}
            </Text>
          </View>
        </>
      ) : (
        <View>
          <View className="coupon_price_people font_hide">
            <Text className="font28 color1">优惠价: </Text>
            <Text className="font48 color1 bold price_margin4">
              ¥{buyPrice}
            </Text>
            <Text className="coupon_price_style color2">原价:</Text>
            <Text className="font36 font_hide price_margin8 color2 bold text_through">
              ¥{couponPrice}
            </Text>
          </View>
          <View onClick={() => onChange()} className="coupon_bean_showPay">
            <View className="color3 font24">卡豆再省</View>
            <View className="color3 font36 bold price_margin8">
              ¥{computedPrice(buyPrice, payBeanCommission)}
            </View>
            <View className="coupon_bean_mx">{"卡豆抵扣明细" + " >"}</View>
          </View>
        </View>
      )}

      <View className="coupon_top_price">
        <View className="coupon_top_right">
          <View className="coupon_getPrice_tag">{templateSelect()}</View>
        </View>
      </View>
      <View className="coupon_setting public_auto">
        <ButtonView>
          <View
            onClick={() => setCollection()}
            className={classNames(
              userCollectionStatus === "1"
                ? "coupon_isCollect"
                : "coupon_collect"
            )}
          >
            {userCollectionStatus === "1" ? "已收藏" : "收藏"}
          </View>
        </ButtonView>
        <ButtonView>
          <View onClick={() => getShareInfo()} className="coupon_share">
            分享
          </View>
        </ButtonView>
      </View>
    </View>
  );
};
