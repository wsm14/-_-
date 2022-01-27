import React from "react";
import { View, Text } from "@tarojs/components";
import { filterWeek } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  const {
    needOrder,
    allowExpireRefund,
    allowRefund,
    useStartTime,
    useEndTime,
    useTime,

    useWeek,
    activeDays,
    delayDays,
  } = data;
  const templateTime = () => {
    if (activeDays) {
      return `购买后${
        delayDays === 0 ? "立刻" : delayDays + "天"
      }生效，有效期${activeDays}天`;
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
          <Text className="color1">
            {needOrder === "0" ? " | 免预约" : " | 需要预约"}
          </Text>
        </View>
        <View className="order_shop_getTime font28 color2">到店核销时段：</View>
        <View className="order_shop_week color1 font28">
          {filterWeek(useWeek)}
          {"  " + useTime}
        </View>
        <View className="order_shop_getTime font28 color2">退款原则：</View>
        <View className="order_shop_week color1 font28">
          {allowExpireRefund === "1" ? "支持" : "不支持"}
          随时退、{allowRefund === "1" ? "支持" : "不支持"}过期自动退
        </View>
      </View>
    </View>
  );
};
