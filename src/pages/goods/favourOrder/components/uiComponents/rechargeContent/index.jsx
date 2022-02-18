import React from "react";
import { View } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import "./index.scss";

export default (props) => {
  const { data = {} } = props;
  const { image, name, oriPrice, realPrice } = data;

  return (
    <>
      <View className="rechargeContent_content_Box">
        <View className="commerOrder_shop_card">
          <View
            className="commerOrder_shop_img"
            style={backgroundObj(image)}
          ></View>
          <View className="commerOrder_shop_content">
            <View className="commerOrder_shop_name font_noHide">{name}</View>
            <View className="commerOrder_shop_price">¥{oriPrice}</View>
            <View className="commerOrder_shop_count">数量：1</View>
          </View>
        </View>
        <View className="order_shop_price">
          <View className="order_shop_label">商品总额</View>
          <View className="order_shop_count">¥{realPrice}</View>
        </View>
      </View>
    </>
  );
};
