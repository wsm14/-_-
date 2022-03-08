import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import Drawer from "@/components/Drawer";
import {} from "@/utils/utils";
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
  const renter = {
    goodsBuy: "商品通用券",
    scan: "扫码通用券",
    virtual: "虚拟商品券",
    commerce: "电商券",
    community: "团购券",
  }[useScenesType];
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
          <View className="drawer_download_coupon">{renter}</View>
        </View>
        <View className="drawer_download_right">
          <View className="drawer_download_max public_center">最高</View>
          <View className="drawer_download_rghtPrice">
            <View className="font24">¥</View>
            <View className="font60 price_margin4">{beanNum}</View>
          </View>
          <View className="drawer_download_thou1">满{thresholdPrice}可用</View>
          <View className="drawer_download_coupon1">{renter}</View>
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
