import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./index.scss";
import { backgroundObj, fetchStorage } from "@/common/utils";
export default ({ change }) => {
  return (
    <View className="shareNewsInfo_img">
      <View className="shareNewsInfo_height"></View>
      <View className="shareNewsInfo_font_title">只有新用户才可以助力哦！</View>
      <View className="shareNewsInfo_font_content shareNewsInfo_font_bold">
        送你免费获得 霸王餐机会 赶紧去拿吧
      </View>
      <View
        className="shareNewsInfo_btn public_center"
        onClick={() => change()}
      >
        立即去拿
      </View>
    </View>
  );
};
