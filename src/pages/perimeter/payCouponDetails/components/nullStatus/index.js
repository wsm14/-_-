import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import Lovely from "@/components/couponLovely";
import "./index.scss";

export default () => {
  return (
    <View className="specialActivity_box">
      <View className="specialActivity_nullImage"></View>
      <View className="specialActivity_nullfont">商品已下架，下次早点来呀</View>
      <View className="specialActivity_lovely">
        <Lovely title={"小伙伴们还喜欢"}></Lovely>
      </View>
    </View>
  );
};
