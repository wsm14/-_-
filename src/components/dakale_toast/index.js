import { Text, View } from "@tarojs/components";
import React from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
export default ({ title, Components, close, btn, children, width }) => {
  return (
    <View
      className="dakale_toasts"
      catchMove
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <View className="dakale_layer" onClick={(e) => e.stopPropagation()}>
        <View
          style={width ? { width: Taro.pxTransform(width) } : {}}
          className="dakale_layer_toast"
        >
          <View className="dakale_layer_title font32 bold color1">{title}</View>
          {children}
          {Components && Components()}
          <View
            className="dakale_layer_btn color6 font32"
            onClick={(e) => close()}
          >
            {btn || "知道了"}
          </View>
        </View>
      </View>
    </View>
  );
};
