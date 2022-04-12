import React from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default (props) => {
  const { data, computedCount } = props;
  const {
    goodsImg,
    goodsName,
    paymentModeObject = {},
    realPrice,
    goodsCount,
  } = data;
  const { bean = 0, cash = 0, type = "defaultMode" } = paymentModeObject;

  return (
    <>
      <View className="commerOrder_content_Box">
        <View className="commerOrder_shop_card">
          <View
            className="commerOrder_shop_img"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="commerOrder_shop_content">
            <View className="commerOrder_shop_name font_noHide">
              {goodsName}
            </View>
            <View className="commerOrder_shop_count">数量：1</View>
          </View>
          <View className="order_shopDetails_price">
            <View
              className="order_shop_btnBox order_shop_btn1"
              onClick={() => computedCount()}
            ></View>
            <View className="order_shop_num">{goodsCount}</View>
            <View
              className="order_shop_btnBox order_shop_btn2"
              onClick={() => computedCount("add")}
            ></View>
          </View>
        </View>
        <View className="order_shop_price">
          <View className="order_shop_label">商品总额</View>
          {type === "defaultMode" ? (
            <View className="order_shop_count">{realPrice}</View>
          ) : (
            <View className="order_shop_count">
              ¥{(cash * goodsCount).toFixed(2)}
              {bean > 0 ? `+${bean * goodsCount}卡豆` : ""}
            </View>
          )}
        </View>
      </View>
    </>
  );
};
