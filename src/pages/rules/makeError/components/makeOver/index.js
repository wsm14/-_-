/*
 到点打卡,到店打卡奖励今日已被领完
*/
import React from "react";
import { View } from "@tarojs/components";
import Router from "@/utils/router";
import { goBack } from "@/utils/utils";
export default (props) => {
  const {} = props;
  return (
    <View className="makeError_makeRepeat_init">
      <View className="makeError_img_box makeError_makeOver_img"></View>
      <View className="makeError_make_toast">哒卡乐温馨提示</View>
      <View className="makeError_error_toast">
        来晚了，到店打卡奖励今日已被领完，请明天再来
      </View>
      <View className="makeError_make_btnBox public_center">
        <View
          className="makeError_btn_box makeError_btn_color2"
          onClick={() => {
            goBack();
          }}
        >
          知道了
        </View>
      </View>
    </View>
  );
};
