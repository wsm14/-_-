/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React from "react";
import { View } from "@tarojs/components";

export default (props) => {
  const { list = [], index, change } = props;
  return (
    <View className="relay_tabbar">
      {list.map((item) => {
        const { title, icon, selectIcon, count } = item;
        return (
          <View
            className="relay_tabbar_icon"
            onClick={() => {
              change(count);
            }}
          >
            <View className="relay_tabbar_bg"></View>
            <View className="relay_tabbar_text">{title}</View>
          </View>
        );
      })}
    </View>
  );
};
