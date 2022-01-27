/*
 到点打卡,已打卡的异常状态
*/
import React from "react";
import { View } from "@tarojs/components";
import Router from "@/utils/router";
export default (props) => {
  return (
    <View className="makeError_makeRepeat_init">
      <View className="makeError_img_box makeError_makeRepeat_img"></View>
      <View className="makeError_make_toast">哒卡乐温馨提示</View>
      <View className="makeError_error_toast">你打卡的商家已经暂停营业</View>
      <View className="makeError_make_btnBox public_center">
        <View
          className="makeError_btn_box makeError_btn_color2"
          onClick={() => {
            Router({
              routerName: "home",
              type: "reLaunch",
            });
          }}
        >
          去捡豆
        </View>
      </View>
    </View>
  );
};
