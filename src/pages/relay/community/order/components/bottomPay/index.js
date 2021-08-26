import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { onSubmit, data } = props;
  const { zk, realPrice } = data();
  return (
    <View className="order_bottomPay_Box">
      <View className="order_bottomPay_payOne">
        <Text className="font28 color1">实付：</Text>
        <Text className="font20 color1 bold">¥</Text>
        <Text className="font32 bold">{realPrice || ""}</Text>
      </View>
      <View className="order_bottomPay_payTwo">
        抵扣：
        <View className="price_margin8">¥{zk || ""}</View>
      </View>
      <View className="order_bottomPay_btn public_center" onClick={onSubmit}>
        立即支付
      </View>
    </View>
  );
};
