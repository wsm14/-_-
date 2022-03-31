import React, { useEffect, useState, useRef } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";

import { toast } from "@/utils/utils";
export default ({ type }) => {
  useEffect(() => {}, []);
  useEffect(() => {}, []);
  const template = {
    0: (
      <>
        <View className="collage_card_left">
          <View className="collage_card_toastInfo">每日08点更新开团商品</View>
        </View>
        <View className="collage_card_banner"></View>
      </>
    ),
    1: (
      <View className="collage_card_contentInfo">
        <View className="collage_card_change">
          <View className="collage_change_title">500</View>
          <View className="collage_change_label">预计返佣/元</View>
        </View>
        <View className="collage_card_change">
          <View className="collage_change_title">500</View>
          <View className="collage_change_label">累计返佣/元 {">"}</View>
        </View>
        <View className="collage_change_liner"></View>
      </View>
    ),
  }[type];
  return <View className="collage_card_box">{template}</View>;
};
