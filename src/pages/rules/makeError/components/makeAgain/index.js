/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React from "react";
import { View } from "@tarojs/components";
import { scanCard } from "@/common/authority";
import { goBack } from "@/utils/utils";

export default (props) => {
  const {} = props;
  return (
    <View className="makeError_makeRepeat_init">
      <View className="makeError_img_box makeError_makeAgain_img"></View>
      <View className="makeError_make_toast">哒卡乐温馨提示</View>
      <View className="makeError_error_toast">
        您打卡的商户暂不支持到店打卡，请联系商户开通设置
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
