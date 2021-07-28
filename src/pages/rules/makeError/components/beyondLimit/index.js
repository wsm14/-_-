/*
 到点打卡,位置不在打卡范围
*/
import React from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import { goBack } from "@/common/utils";
import { scanCard } from "@/common/authority";
export default (props) => {
  const {} = props;
  return (
    <View className="makeError_makeRepeat_init">
      <View className="makeError_img_box makeError_beyondLimit_img"></View>
      <View className="makeError_make_toast">哒卡乐温馨提示</View>
      <View className="makeError_error_toast">
        您当前位置不在打卡范围内，请前往商户进行打卡
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
          重新定位
        </View>
      </View>
    </View>
  );
};
