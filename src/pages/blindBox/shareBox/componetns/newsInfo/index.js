import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./index.scss";
import { backgroundObj, fetchStorage } from "@/common/utils";
export default ({ change }) => {
  return (
    <View className="newsInfo_img">
      <View className="newsInfo_height"></View>
      <View className="newsInfo_font_title">只有新用户才可以助力哦！</View>
      <View className="newsInfo_font_content newsInfo_font_bold">
        解锁更多盲盒大奖
      </View>
      <View className="newsInfo_font_bold">动动手指</View>
      <View className="newsInfo_font_bold">iPhone13到手</View>
      <View className="newsInfo_btn public_center" onClick={() => change()}>
        立即拆盲盒
      </View>
    </View>
  );
};
