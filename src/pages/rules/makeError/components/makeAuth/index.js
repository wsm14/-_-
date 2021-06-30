/*
 到点打卡,无权限
*/
import React from "react";
import { View } from "@tarojs/components";
import evens from "@/common/evens";
import { goBack } from "@/common/utils";
import evens from "@/common/evens";
export default (props) => {
  const { Store } = props;
  return (
    <View className="makeError_makeRepeat_init">
      <View className="makeError_img_box makeError_beyondLimit_img"></View>
      <View className="makeError_make_toast">哒卡乐温馨提示</View>
      <View className="makeError_error_toast">
        您的定位权限未开启，请开启定位授权
      </View>
      <View className="makeError_make_btnBox public_auto">
        <View
          className="makeError_btn_box makeError_btn_color1"
          onClick={() => {
            goBack();
          }}
        >
          取消
        </View>
        <View
          className="makeError_btn_box makeError_btn_color2"
          onClick={() => {
            evens.$emit("setLocation");
          }}
        >
          去授权
        </View>
      </View>
    </View>
  );
};
