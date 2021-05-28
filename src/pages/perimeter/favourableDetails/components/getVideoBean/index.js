import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import "./index.scss";

export default (props) => {
  const { price, data } = props;
  const { userBean, userIncomeBean } = data;
  console.log(price,userBean,userIncomeBean)
  if ((price*100) < userBean ||(price*100) < userIncomeBean) {
    return null;
  } else
    return (
      <View
        className="videoBean_box public_auto"
        onClick={() =>
          Router({
            routerName: "nearVideo",
            args: {
              type: "goods",
            },
          })
        }
      >
        <View>卡豆不足？刷视频捡豆最高可抵¥{price}</View>
        <View>{">"}</View>
      </View>
    );
};