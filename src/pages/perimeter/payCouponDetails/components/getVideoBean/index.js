import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import "./index.scss";

export default (props) => {
  const { price, data } = props;
  const { userBean, userIncomeBean } = data;
  console.log(price, userBean, userIncomeBean);
  if (price * 100 < userBean || price * 100 < userIncomeBean) {
    return null;
  } else
    return (
      <View
        className="coupon_videoBean_liner"
        onClick={() =>
          Router({
            routerName: "nearVideo",
            args: {
              type: "goods",
            },
          })
        }
      >
        <View>卡豆不足？刷视频捡豆最高可抵¥</View>
        <View className="bold">{price}</View>
        <View className="bold coupon_videoBean_left">{" >"}</View>
      </View>
    );
};
