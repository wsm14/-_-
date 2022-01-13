import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * 按钮样式
 * @param {String} type 类型 yellow red
 * @param {String} className 样式名称
 * @param {Function} onClick 点击事件
 */
export default ({ type = "red", className, onClick, children }) => {
  const classNameType = { yellow: "yellow", red: "red" }[type];

  return (
    <View
      className={`ClockInButton ${classNameType} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </View>
  );
};
