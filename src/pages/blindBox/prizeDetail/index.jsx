import React, { useState } from "react";
import { useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import UserInfo from "./components/UserInfo";
import OrderInfo from "./components/OrderInfo";
import "./index.scss";

/**
 * 奖品详情
 */
export default () => {
  return (
    <View className="prize_detail">
      {/* 用户联系地址商品信息 */}
      <UserInfo></UserInfo>
      {/* 订单信息 */}
      <OrderInfo></OrderInfo>
    </View>
  );
};
