import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./index.scss";
import { backgroundObj, fetchStorage } from "@/common/utils";
export default ({ data, change }) => {
  const { profile, newUserBean } = data;
  return (
    <View className="saveBean_img">
      <View className="saveBean_height"></View>
      <View className="saveBean_top"></View>
      <View className="saveBean_profile" style={backgroundObj(profile)}></View>
      <View className="saveBean_desc">“谢谢你帮我～”</View>
      <View className="saveBean_getbean">送你{newUserBean}卡豆</View>
      <View className="saveBean_font">你也来拆盲盒赢大奖吧</View>
      <View className="saveBean_btn public_center" onClick={() => change()}>
        立即拆盲盒
      </View>
    </View>
  );
};
