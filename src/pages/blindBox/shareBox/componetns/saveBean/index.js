import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/utils/router";
import "./index.scss";
import { backgroundObj, fetchStorage } from "@/utils/utils";
export default ({ data, change }) => {
  const { profile, newUserBean } = data;
  return (
    <View className="saveBean_img">
      <View className="saveBean_height"></View>
      <View className="saveBean_top"></View>
      <View className="saveBean_profile" style={backgroundObj(profile)}></View>
      <View className="saveBean_desc">“感谢您的支援”</View>
      <View className="saveBean_getbean">恭喜你获得{newUserBean}卡豆</View>
      <View className="saveBean_font"></View>
      <View className="saveBean_btn public_center" onClick={() => change()}>
        去领取
      </View>
    </View>
  );
};
