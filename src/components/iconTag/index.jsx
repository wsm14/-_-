import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";
export default ({ list = [], className }) => {
  return (
    <View className={`public_auto  ${className}`}>
      {list.map((item) => {
        const { icon, label, fn } = item;
        return (
          <View
            className={icon}
            onClick={() => {
              fn && fn();
            }}
          >
            {label}
          </View>
        );
      })}
    </View>
  );
};
