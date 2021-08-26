import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { backgroundObj } from "@/common/utils";
export default (props) => {
  const { count, data, onChange } = props;
  const { realPrice = 0, goodsName, goodsImg } = data;
  return (
    <View className="order_shopCard_box">
      <View className="order_shopCard_paddingBox">
        <View
          className="order_shopCard_profile dakale_nullImage"
          style={backgroundObj(goodsImg)}
        ></View>
        <View className="order_shopCard_content">
          <View className="order_shopCard_shopTitle font_hide">
            {goodsName}
          </View>
          <View className="order_shopCard_price">¥ {realPrice}</View>
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
        <Text className="color2 font20">共{count}件</Text>
        <Text className="font28 color1 bold price_margin4"> 小计：</Text>
        <Text className="price_margin8 font20 color3">¥ </Text>
        <Text className="font28 color3">{(count * realPrice).toFixed(2)}</Text>
      </View>
    </View>
  );
};
