import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { goodsView } from "@/components/componentView/active/activeView";
import "./index.scss";
export default ({ list = [], userInfo = {}, onChange }) => {
  return (
    <View className="importScice_box">
      <View className="importScice_title"></View>
      <View className="importScice_shop_good"></View>
      <View className="importScice_goods_box">
        {list.map((item) => {
          return goodsView(item, userInfo, onChange);
        })}
      </View>
    </View>
  );
};
