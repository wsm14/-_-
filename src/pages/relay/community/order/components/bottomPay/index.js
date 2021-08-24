import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  return (
    <View className="order_bottomPay_Box">
      <View className="order_bottomPay_payOne">
        <Text className="font28 color1">实付：</Text>
        <Text className="font20 color1 bold">¥</Text>
        <Text className="font32 bold">105.12</Text>
      </View>
      <View className="order_bottomPay_payTwo">
        抵扣：
        <View className="price_margin8">¥2.88</View>
      </View>
      <View className="order_bottomPay_btn public_center">立即支付</View>
    </View>
  );
};
