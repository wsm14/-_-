import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import Drawer from "@/components/Drawer";
import Router from "@/utils/router";
import "./index.scss";

export default ({ data, onclose, show }) => {
  const {
    couponName,
    useScenesType,
    dayNum,
    activeBeginDate,
    activeEndDate,
    couponValue,
    thresholdPrice,
    unavailableReason,
    otherDesc,
    consortUserOs,
    classType,
    increaseStatus,
    increaseRuleObject = {},
  } = data;
  const { type, beanNum, increaseMaxValue } = increaseRuleObject;
  const renter = () => {
    if (classType === "universal" && useScenesType === "goodsBuy") {
      return "商品通用券";
    } else if (classType === "category" && useScenesType === "goodsBuy") {
      return "行业商品券";
    } else if (classType === "merchant" && useScenesType === "goodsBuy") {
      return "店铺商品券";
    } else if (classType === "goods" && useScenesType === "goodsBuy") {
      return "指定商品券";
    } else if (classType === "universal" && useScenesType === "virtual") {
      return "虚拟通用券";
    } else if (classType === "goods" && useScenesType === "virtual") {
      return "指定虚拟券";
    } else if (classType === "universal" && useScenesType === "commerce") {
      return "电商通用券";
    } else if (classType === "goods" && useScenesType === "commerce") {
      return "指定电商券";
    }
  };
  return (
    <Drawer
      show={show}
      close={() => {
        onclose();
      }}
    >
      <View className="drawer_download">
        <View className="drawer_download_left">
          <View className="drawer_download_price">
            <View className="font24">¥</View>
            <View className="font40 price_margin4">{couponValue}</View>
          </View>
          <View className="drawer_download_thou">满{thresholdPrice}可用</View>
          <View className="drawer_download_coupon">{renter()}</View>
        </View>
        <View className="drawer_download_right">
          <View className="drawer_download_max public_center">最高</View>
          <View className="drawer_download_rghtPrice">
            <View className="font24">¥</View>
            <View className="font60 price_margin4">{beanNum}</View>
          </View>
          <View className="drawer_download_thou1">满{thresholdPrice}可用</View>
          <View className="drawer_download_coupon1">{renter()}</View>
        </View>
        <View
          className="drawer_download_btn public_center"
          onClick={() => {
            Router({
              routerName: "download",
            });
            onclose();
          }}
        >
          打开「哒卡乐APP」膨胀
        </View>
      </View>
    </Drawer>
  );
};
