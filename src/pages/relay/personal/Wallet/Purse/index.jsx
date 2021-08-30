import React from "react";
import { useRouter } from "@tarojs/taro";
import Router from "@/common/router";
import { View, Text, Button } from "@tarojs/components";
import "./index.scss";

/**
 * 我的钱包
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { settlerPrice = "" } = routeParams;

  return (
    <View className="Purse_content">
      <View className="purse_tip">资金到账时间预计有1分钟延迟，请耐心等待</View>
      <View className="purse_price_content">
        <Text className="purse_price_all">总金额</Text>
        <Text className="purse_price">{settlerPrice}</Text>
        <Button className="purse_price_submit">提现至零钱</Button>
      </View>
      <View className="purse_price_menu">
        <View className="purse_menu_group">
          <View className="purse_menu_cell">资产明细</View>
        </View>
      </View>
      <View className="purse_bottom_tip">哒卡乐支付安全保障中</View>
    </View>
  );
};
