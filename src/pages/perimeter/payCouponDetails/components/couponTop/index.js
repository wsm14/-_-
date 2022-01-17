/*
店铺详情优惠券公共样式
*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { computedPrice } from "@/utils/utils";
import classNames from "classnames";
import Router from "@/utils/router";
export default ({
  data,
  configUserLevelInfo,
  onChange,
  setCollection,
  close,
  show,
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
      return `每人不限购买数量`;
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
      <View style={{ position: "relative" }}>
        {rightFlag === "1" ? (
          <>
            <View className="couponInfo_box">
              <View className="couponInfo_box_left">卡豆价:</View>
              <View className="couponInfo_box_right">
                ¥{cash}+{bean}卡豆
              </View>
            </View>
            <View className="couponInfo_rel">
              <Text className="color2 font28"> 原价:</Text>
              <Text className="font36 font_hide price_margin4 color2 bold text_through">
                ¥{couponPrice}
              </Text>
              {rightFlag !== "1" && (
                <View
                  onClick={() => collect()}
                  className={classNames(
                    userCollectionStatus === "1"
                      ? "shopdetails_isCollect"
                      : "shopdetails_collect"
                  )}
                ></View>
              )}
            </View>
          </>
        ) : (
          <>
            <View className="coupon_price_people font_hide">
              <Text className="font28 color1">优惠价: </Text>
              <Text className="font48 color1 bold price_margin4">
                ¥{buyPrice}
              </Text>
              <Text className="coupon_price_style color2">原价:</Text>
              <Text className="font36 font_hide price_margin8 color2 bold text_through">
                ¥{couponPrice}
              </Text>
              <View
                onClick={() => setCollection()}
                className={classNames(
                  userCollectionStatus === "1"
                    ? "shopdetails_isCollect"
                    : "shopdetails_collect"
                )}
              ></View>
            </View>
            <View onClick={() => onChange()} className="coupon_bean_showPay">
              <View className="color3 font24">卡豆再省</View>
              <View className="color3 font36 bold price_margin8">
                ¥{computedPrice(buyPrice, payBeanCommission)}
              </View>
              <View className="coupon_bean_mx">{"卡豆抵扣明细" + " >"}</View>
            </View>
          </>
        )}
        {show && (
          <View
            className="shopdetails_collect_toast public_center"
            onClick={() => {
              close();
              Router({
                routerName: "download",
              });
            }}
          >
            已成功收藏，打开APP查看关注详情{" "}
            <View className="shopdetails_collect_btn public_center">
              去打开
            </View>
          </View>
        )}
      </View>

      <View className="coupon_top_price">
        <View className="coupon_top_right">
          <View className="coupon_getPrice_tag">{templateSelect()}</View>
        </View>
      </View>
    </View>
  );
};
