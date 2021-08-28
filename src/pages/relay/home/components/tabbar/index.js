import React from "react";

import { View } from "@tarojs/components";
import classNames from "classnames";

export default (props) => {
  const { index, change, list } = props;

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
            <View
              className={classNames(
                "relay_tabbar_bg",
                count == index ? selectIcon : icon
              )}
            ></View>
            <View
              className={classNames(
                "relay_tabbar_text",
                count == index ? "color4" : "color2"
              )}
            >
              {title}
            </View>
          </View>
        );
      })}
    </View>
  );
};
