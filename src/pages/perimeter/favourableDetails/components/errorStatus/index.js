import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import Recommend from "@/components/public_ui/specalActive";
import "./index.scss";

export default ({ userInfo, children }) => {
  return (
    <View className="specialActivity_box">
      <View className="specialActivity_nullImage"></View>
      <View className="specialActivity_nullfont">商品已下架，下次早点来呀</View>
      <View className="specialActivity_lovely">
        <Recommend current={true} userInfo={userInfo}></Recommend>
      </View>
      {children}
    </View>
  );
};
