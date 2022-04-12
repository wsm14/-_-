/*券的为你推荐*/
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  const { giftValue, paymentModeObject = {}, buyPrice, platformGiftId } = data;
  const { type = "defaultMode", bean, cash } = paymentModeObject;
  return (
    <View className="submit_box">
      <View className="submit_ks_box">
        <View className="submit_ks_title font28">可省:</View>
        <View className="submit_ks_price font32">
          ¥<Text className="font48 ">{giftValue}</Text>
        </View>
      </View>
      <View
        className="submit_btn public_center"
        onClick={() => {
          Router({
            routerName: "favourableOrder",
            args: {
              mode: "beanGiftPack",
              platformGiftId,
            },
          });
        }}
      >
        <View className="submit_btn_font font_hide">
          {type === "defaultMode"
            ? `${buyPrice}元 `
            : `${cash}元${bean > 0 && `+${bean}卡豆`}`}
        </View>
        <View className="submit_btn_font1"> 抢购</View>
      </View>
    </View>
  );
};
