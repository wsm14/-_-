import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  return (
    <View className="delivery_bottom_box">
      <View className="delivery_bottom_btn">
        <View className="delivery_bottom_icon"></View>
        <View className="delivery_bottom_text price_margin8">添加新地址</View>
      </View>
    </View>
  );
};
