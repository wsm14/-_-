import React from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import "./index.scss";
export default (props) => {
  const { computedPrice, submit, payFlag = true } = props;
  return (
    <View className="order_details_btn">
      <View className="order_details_payLabel">
        <View className="color1 font28 bold">实付:</View>
        <View className="color3 font24">¥</View>
        <View className="color3 font48 bold">{computedPrice()}</View>
      </View>
      <View
        className="order_details_button public_center"
        style={{ opacity: payFlag ? 1 : 0.4 }}
        onClick={() => {
          payFlag && submit();
        }}
      >
        立即支付
      </View>
    </View>
  );
};
