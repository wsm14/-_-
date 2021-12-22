import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * Empty
 * @param {show}   show 是否展示
 * @param {type}   type 类型
 * @param {toast}  toast 提示语
 *
 */
export default (props) => {
  const { show = false, type = "home", toast, fn } = props;
  const template = {
    home: <View className="empty_img_home  empty_img_box"></View>,
    error: <View className="empty_img_error  empty_img_box"></View>,
    shop: <View className="empty_img_nullShop  empty_img_box"></View>,
  }[type];
  if (show) {
    return (
      <View className="empty_box">
        {template}
        <View className="empty_info_font">{toast}</View>
        {fn && (
          <View onClick={() => fn()} className="empty_info_btn public_center">
            刷新
          </View>
        )}
      </View>
    );
  } else {
    return null;
  }
};
