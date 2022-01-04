/*
 到点打卡,-1
*/
import React from "react";
import { View } from "@tarojs/components";
import { scanCard } from "@/common/authority";
import { goBack } from "@/utils/utils";

export default (props) => {
  return (
    <View className="makeError_makeRepeat_init">
      <View className="makeError_img_box makeError_makeAgain_img"></View>
      <View className="makeError_make_toast">哒卡乐温馨提示</View>
      <View className="makeError_error_toast">
        不好意思，打卡失败，请重新尝试一下
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
            goBack(() => scanCard());
          }}
        >
          再次尝试
        </View>
      </View>
    </View>
  );
};
