import React from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/taro";
import { billboard } from "@/components/public_ui/shopInfo";

export default ({ data, list }) => {
  const { merchantId } = data;
  if (list.length > 0) {
    return (
      <>
        <View className="merchant_active">
          <View className="merchant_active_title">
            <View className="merchant_active_iconBox active_icon3"></View>
            <View className="merchant_active_biaoti">商品橱窗</View>
          </View>
          <View className="merchant_active_dec">本店商品展示</View>
        </View>
        <ScrollView scrollX className="merchant_billboard">
          {goodsList.map((item, index) => {
            return billboard(item, merchantId);
          })}
        </ScrollView>
      </>
    );
  }
  return null;
};
