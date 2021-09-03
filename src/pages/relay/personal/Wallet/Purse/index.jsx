import React, { useState } from "react";
import { useDidShow } from "@tarojs/taro";
import Router from "@/common/router";
import { View, Text, Button } from "@tarojs/components";
import { fetchPcUserInfo } from "@/server/relay";
import "./index.scss";

/**
 * 我的钱包
 */
export default () => {
  const [price, setPrice] = useState(0);

  useDidShow(() => {
    getUserInfo();
  });

  // 获取用户信息
  const getUserInfo = () => {
    fetchPcUserInfo().then((res) => {
      setPrice(res.cash);
    });
  };
  const template = {
    0: (
      <View className="purse_bank_box">
        <View className="purse_bank_toast">银行卡</View>
        <View className="purse_bank_add">添加银行卡</View>
      </View>
    ),
  }[0];
  return (
    <View className="Purse_content">
      {/* <View className="purse_tip">资金到账时间预计有1分钟延迟，请耐心等待</View> */}
      <View className="purse_price_content">
        <View className="purse_bean_iconBox"></View>
        <Text className="purse_price_all">卡豆余额</Text>
        <Text className="purse_price">{price}</Text>
      </View>
      <View className="purse_price_menu">
        <View className="purse_menu_group">
          <View
            className="purse_menu_cell"
            onClick={() => Router({ routerName: "purseDetail" })}
          >
            资产明细
          </View>
        </View>
      </View>
      {template}
      <View className="purse_bottom_tip">哒卡乐支付安全保障中</View>
    </View>
  );
};
