import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * 底部悬浮按钮容器
 * @param {*} children
 */
export default ({ className = "", children }) => {
  return (
    <View className="dakale_footer_block">
      <View className={`dakale_footer_btn_box ${className}`}>
        <View className="dakale_footer_btn">{children}</View>
      </View>
    </View>
  );
};
