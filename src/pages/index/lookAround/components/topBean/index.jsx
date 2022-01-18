import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { loginStatus, backgroundObj } from "@/utils/utils";

import "./index.scss";
export default ({ data }) => {
  const { bean, todayTotalIncome } = data;
  const { profile } = loginStatus() || {};
  return (
    <View className="topBean_box public_auto">
      <View className="topBean_left">
        <View
          style={backgroundObj(profile)}
          className="topBean_profile merchant_dakale_logo"
        ></View>
        <View className="topBean_bean">{bean}</View>
      </View>
      <View className="topBean_right">{todayTotalIncome}</View>
    </View>
  );
};
// 头部卡豆显示区域
