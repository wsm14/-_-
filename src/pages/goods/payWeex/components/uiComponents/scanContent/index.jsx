import React from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import { backgroundObj } from "@/utils/utils";
import "./index.scss";
export default (props) => {
  const { data } = props;
  const { totalFee, payFee, beanFee, payTitle } = data;
  return (
    <View className="payWeex_scanContent_box">
      <View className="payWeex_scanContent_title">实付款</View>
      <View className="payWeex_scanContent_price">
        <View className="font36">¥</View>
        <View className="font60 price_margin4">{payFee}</View>
      </View>
      <View className="payWeex_scanContent_liner"></View>
      <View className="payWeex_scanContent_initBox">
        {payTitle && (
          <View className="payWeex_scanContent_tags font_hide">
            <View className="payWeex_label">商品名称</View>
            <View className="payWeex_value font">{payTitle}</View>
          </View>
        )}

        <View className="payWeex_scanContent_tags font_hide">
          <View className="payWeex_label">订单金额</View>
          <View className="payWeex_value font">{totalFee}</View>
        </View>

        {beanFee > 0 && (
          <View className="payWeex_scanContent_tags font_hide">
            <View className="payWeex_label">卡豆优惠抵扣</View>
            <View className="payWeex_value font">
              -{beanFee}(¥{(beanFee / 100).toFixed(2)})
            </View>
          </View>
        )}
      </View>

      <View></View>
      <View></View>
      <View></View>
    </View>
  );
};
