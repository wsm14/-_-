import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { count, data, onChange } = props;
  return (
    <View className="order_shopCard_box">
      <View className="order_shopCard_paddingBox">
        <View className="order_shopCard_profile dakale_nullImage"></View>
        <View className="order_shopCard_content">
          <View className="order_shopCard_shopTitle font_hide">
            商品名称商品名称商品名称商品…
          </View>
          <View className="order_shopCard_price">¥ 69</View>
        </View>
        <View className="order_buyCard_collection">
          <View
            className="order_buyCard_icon order_buyCard_remove"
            onClick={() => onChange("remove")}
          ></View>
          <View className="order_buyCard_text">{count}</View>
          <View
            className="order_buyCard_icon order_buyCard_add"
            onClick={() => onChange("add")}
          ></View>
        </View>
      </View>
      <View className="order_shopCard_countBox">
        <Text className="color2 font20">共2件</Text>
        <Text className="font28 color1 bold price_margin4"> 小计：</Text>
        <Text className="price_margin8 font20 color3">¥ </Text>
        <Text className="font28 color3">108</Text>
      </View>
    </View>
  );
};
