import React from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import InterTime from "@/components/InterTime";
import { goBack } from "@/utils/utils";
import "./index.scss";
export default (props) => {
  const { data } = props;
  const { createTime, expiredTime, payFee } = data;
  return (
    <View className="payWeex_payContent">
      <View className="payWeex_title">
        支付剩余时间 
        {createTime && (
          <InterTime
            mint={expiredTime}
            times={createTime}
            fn={() => {
              goBack();
            }}
          ></InterTime>
        )}
      </View>
      <View className="payWeex_price">
        <View className="payWeex_icon">¥</View>
        <View className="payWeex_total">{payFee}</View>
      </View>
    </View>
  );
};
