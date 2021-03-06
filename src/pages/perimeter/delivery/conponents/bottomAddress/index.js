import React from "react";
import { View } from "@tarojs/components";

export default (props) => {
  const { onChange } = props;
  return (
    <View className="delivery_bottom_box">
      <View onClick={() => onChange("add")} className="delivery_bottom_btn">
        <View className="delivery_bottom_icon"></View>
        <View className="delivery_bottom_text price_margin8">添加新地址</View>
      </View>
    </View>
  );
};
