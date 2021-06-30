/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
export default (props) => {
  const {} = props;
  return (
    <View className="makeError_makeRepeat_init">
      <View className="makeError_img_box makeError_makeAuth_img"></View>
      <View className="makeError_make_toast">哒卡乐温馨提示</View>
      <View className="makeError_error_toast">
        您的定位权限未开启，请开启定位授权  
      </View>
      <View className="makeError_make_btnBox public_auto">
        <View
          className="makeError_btn_box makeError_btn_color2"
          onClick={() => {
            goBack();
          }}
        >
          取消
        </View>
        <View
          className="makeError_btn_box makeError_btn_color2"
          onClick={() => {
            scanCard();
          }}
        >
          去授权
        </View>
      </View>
    </View>
  );
};
