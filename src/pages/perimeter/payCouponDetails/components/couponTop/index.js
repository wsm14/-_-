/*
店铺详情优惠券公共样式
*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Router from "@/common/router";
import { computedPrice, setBuyRule } from "@/common/utils";
import classNames from "classnames";
import ButtonView from "@/components/Button";
import "./../../index.scss";
export default ({ data, configUserLevelInfo, setCollection, getShareInfo }) => {
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
  } = data;
  const { payBeanCommission = 50 } = configUserLevelInfo;
  console.log(configUserLevelInfo);
  const templateSelect = () => {
    if (buyRule === "unlimited") {
      return `不限购`;
    } else {
      if (buyRule === "personLimit") {
        return `每人限购${personLimit}`;
      } else {
        return `每人每天限购${dayMaxBuyAmount}`;
      }
    }
  };

  return (
    <View className="coupon_bg">
      <View className="coupon_top_bg">
        <View className="coupon_top_title font_hide">
          ¥{buyPrice} 代 {couponPrice}元抵扣券
        </View>
        <View className="coupon_top_name  font_hide">{couponName}</View>
        <View className="coupon_top_desc">
          {anytimeRefund === "1" && (
            <>
              <View className="shopDetails_tab_icon"></View>
              <View className="shopDetails_tab_font">随时退</View>
            </>
          )}
          {expireRefund === "1" && (
            <>
              <View className="shopDetails_tab_icon"></View>
              <View className="shopDetails_tab_font">过期退</View>
            </>
          )}

          <>
            <View className="shopDetails_tab_icon"></View>
            <View className="shopDetails_tab_font">卡豆抵扣</View>
          </>
          <View
            onClick={() => Router({ routerName: "interests" })}
            className="shop_question question_icon"
          ></View>
        </View>
      </View>
      <View className="coupon_top_price">
        <View className="coupon_top_left">
          <View className="font24">限购数量</View>
          <View className="font24 color1 coupon_top_margin">
            {" "}
            {templateSelect()}
          </View>
        </View>
        <View className="coupon_top_right">
          卡豆可抵 ¥{computedPrice(buyPrice, payBeanCommission)}
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
