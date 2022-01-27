import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
;
import "./index.scss";
export default ({ change, data }) => {
  const { profile, prizeBean, prizeName } = data;
  return (
    <View className="shareNewsInfo_img">
      <View className="shareNewsInfo_height"></View>
      <View className="shareNewsInfo_font_title">只有新用户才可以助力哦！</View>
      <View className="shareNewsInfo_font_content shareNewsInfo_font_bold font_hide">
        送你免费获得
      </View>
      <View className="shareNewsInfo_font_bold  font_hide">
        {prizeName || prizeBean + "卡豆"}机会
      </View>
      <View className="shareNewsInfo_font_bold font_hide">感觉去拿吧</View>
      <View
        className="shareNewsInfo_btn public_center"
        onClick={() => change()}
      >
        立即去拿
      </View>
    </View>
  );
};
