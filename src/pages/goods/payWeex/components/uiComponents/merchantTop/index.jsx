import React from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import { backgroundObj } from "@/utils/utils";
import "./index.scss";
export default (props) => {
  const { data } = props;
  const { merchantImg, merchantName } = data;
  return (
    <View className="payWeex_topMerchant">
      <View
        className="payWeex_merchantProfile  merchant_dakale_logo"
        style={backgroundObj(merchantImg)}
      ></View>
      <View className="payWeex_merchantName font_hide">{merchantName}</View>
    </View>
  );
};
