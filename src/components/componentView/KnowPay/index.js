/*
店铺详情优惠券公共样式

*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { filterWeek } from "@/common/utils";
import "./index.scss";
export const knowPay = (data, type = "good") => {
  const {
    activeDays,
    useStartTime,
    useEndTime,
    delayDays,
    useWeek = "",
    useTime = "",
    buyDesc = "",
    activeDate,
    thresholdPrice,
    endDate,
  } = data;
  const templateTime = () => {
    if (activeDays) {
      return `购买后${
        delayDays === 0 ? "立刻" : delayDays + "天"
      }生效，有效期${activeDays}天，请在有效期内使用`;
    } else if (activeDate) {
      return `${activeDate}至${endDate}`;
    } else {
      return `${useStartTime}至${useEndTime}`;
    }
  };
  return (
    <View className="shopdetails_shop_toast">
      <View className="shop_toastTitle">使用须知</View>
      <View className="shop_toastDec shop_toastDate">有效期：</View>
      <View className="shop_toastText">
        <Text className="shop_toastTextColor">{templateTime()}</Text>
      </View>
      <View className="shop_toastDec shop_getDate">使用时间：</View>
      <View className="shop_toastText">
        <Text className="shop_toastTextColor">
          {filterWeek(useWeek) + " " + useTime}
        </Text>
        ，具体以门店供应时段为准；
      </View>
      {type === "coupon" && thresholdPrice !== "0" && thresholdPrice !== "" && (
        <>
          <View className="shop_toastDec shop_getDate">使用门槛：</View>
          <View className="shop_toastText">满{thresholdPrice}元可用；</View>
        </>
      )}
      {buyDesc.length > 0 && (
        <>
          <View className="shop_toastDec shop_showNow">购买须知：</View>
          <View
            style={{ lineHeight: Taro.pxTransform(36) }}
            className="shop_toastText"
          >
            {buyDesc.slice(2, buyDesc.length - 3)}
          </View>
        </>
      )}
    </View>
  );
};
