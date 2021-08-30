import React from "react";
import { useRouter } from "@tarojs/taro";
import Router from "@/common/router";
import { View, Text, Form, Button, Input } from "@tarojs/components";
import "./index.scss";

/**
 * 我的钱包
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { settlerPrice = "" } = routeParams;

  return (
    <View className="PurseWithdraw_content">
      <View className="purseWithdraw_info">
        <View className="purseWithdraw_info_cell">
          <View style={{ flex: 1 }}>到账账户</View>
          <Text>微信零钱</Text>
        </View>
        <View className="purseWithdraw_info_cell">
          <View style={{ flex: 1 }}>账户实名</View>
          <Text>某某某</Text>
        </View>
      </View>
      <View className="purseWithdraw_handle"></View>
    </View>
  );
};
