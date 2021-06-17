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
    buyUserImageList = [],
  } = data;
  const { payBeanCommission = 50 } = configUserLevelInfo;
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
      </View>
      <View className="coupon_top_view">
        <View className="coupon_view_left">
          <View className="color3 font24">¥</View>
          <View className="color3 font48 bold">{buyPrice}</View>
          <View className="color2 font28 coupon_margin1 bold">原价</View>
          <View className="color2 font28 coupon_margin2 coupon_text_thour">
            ¥{couponPrice}
          </View>
        </View>
        <View className="coupon_view_right">
          <View className="coupon_pay_logo">
            {buyUserImageList.map((item, index) => {
              if (index === 0) {
                return (
                  <View
                    className=".coupon_profile_box dakale_profile"
                    style={backgroundObj(item)}
                  ></View>
                );
              } else {
                return (
                  <View
                    className=".coupon_profile_box dakale_profile .coupon_profile_left"
                    style={backgroundObj(item)}
                  ></View>
                );
              }
            })}
            <View className=".coupon_left_pay">抢购中</View>
          </View>
        </View>
      </View>
      <View className="coupon_top_price">
        <View className="coupon_top_left">
          <View className="coupon_bean_hander">
            <View className="coupon_bean_price">
              <View className="font22 color6">卡豆抵扣到手价</View>
              <View className="font20 color6 coupon_bean_priceLeft">¥</View>
              <View className="font28 color6 bold coupon_bean_priceLeft">
                {computedBeanPrice(buyPrice, payBeanCommission)}
              </View>
            </View>
          </View>
        </View>
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
