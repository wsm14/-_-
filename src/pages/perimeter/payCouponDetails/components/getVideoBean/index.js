import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import "./index.scss";

export default (props) => {
  const { price, data } = props;
  const { userBean, userIncomeBean, visible = true } = data;
  if (price * 100 < userBean || !visible) {
    return null;
  } else
    return (
      <View
        className="videoBean_liner"
        onClick={() =>
          Router({
            routerName: "nearVideo",
            args: {
              type: "goods",
            },
          })
        }
      >
        <View className="videoBean_icon"></View>
        <View className="videoBean_desc">您还有</View>
        <View className="bold color3">5元</View>
        <View>卡豆红包待领取</View>
        <View className="bold videoBean_left">立即领取{" >"}</View>
      </View>
    );
};
