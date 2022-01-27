import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
export default ({ data }) => {
  const {
    activeDays,
    delayDays,
    activeDate,
    endDate,
    useStartTime,
    useEndTime,
    anytimeRefund,
    expireRefund,
    thresholdPrice = "0",
  } = data;
  const templateTime = () => {
    if (activeDays) {
      return `购买后${
        delayDays === 0 ? "立刻" : delayDays + "天"
      }生效，有效期${activeDays}天`;
    } else if (activeDate) {
      return `${activeDate}至${endDate}`;
    } else {
      return `${useStartTime}至${useEndTime}`;
    }
  };
  return (
    <View className="order_shop_desc">
      <View className="order_shop_descBox">
        <View className="order_shop_descTitle">购买须知</View>
        <View className="order_shop_getTime font28 color2">使用有效期：</View>
        <View className="order_shop_timeDesc font28">
          <Text>{templateTime()}</Text>
        </View>
        <View className="order_shop_getTime font28 color2">使用门槛</View>
        <View className="order_shop_week color1 font28">
          {thresholdPrice !== "0" && thresholdPrice !== ""
            ? `满${thresholdPrice}元可用`
            : "无门槛"}
        </View>
        <View className="order_shop_getTime font28 color2">退款原则：</View>
        <View className="order_shop_week color1 font28">
          {anytimeRefund === "1" ? "支持" : "不支持"}
          随时退、{expireRefund === "1" ? "支持" : "不支持"}过期自动退
        </View>
      </View>
    </View>
  );
};
