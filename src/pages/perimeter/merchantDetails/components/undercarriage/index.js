import React from "react";
import { View } from "@tarojs/components";
export default ({ data, children }) => {
  const { merchantStatus } = data;
  if (merchantStatus === "1") {
    return null;
  } else {
    return (
      <View catchMove className="merchantFlex">
        <View>
          <View className="merchantFlex_img"></View>
          <View className="merchantFlex_content">商家已下架</View>
        </View>
        {children}
      </View>
    );
  }
};
