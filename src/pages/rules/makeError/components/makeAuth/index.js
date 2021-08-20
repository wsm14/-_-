/*
 到点打卡,无权限
*/
import React from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { goBack } from "@/common/utils";
import { useState } from "react";
import evens from "@/common/evens";
import { getAuthStatus, scanCard } from "@/common/authority";
export default (props) => {
  const [type, setType] = useState(false);
  useDidShow(() => {
    getAuthStatus({
      key: "location",
      success: (res) => {
        setType(res);
      },
      fail: (res) => {
        setType(res);
      },
    });
  });
  return (
    <View className="makeError_makeRepeat_init">
      <View className="makeError_img_box makeError_makeAuth_img"></View>
      <View className="makeError_make_toast">哒卡乐温馨提示</View>
      <View className="makeError_error_toast">
        {type
          ? "已成功开启定位，请您重新扫码 "
          : "您的定位权限未开启，请开启定位授权"}
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
            type ? goBack(() => scanCard()) : evens.$emit("setLocation");
          }}
        >
          {type ? "去打卡" : "去授权"}
        </View>
      </View>
    </View>
  );
};
