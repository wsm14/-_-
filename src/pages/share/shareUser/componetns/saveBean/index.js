import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./index.scss";
import { backgroundObj, fetchStorage } from "@/common/utils";
export default ({ data, change }) => {
  const { profile, prizeBean, prizeName } = data;
  return (
    <View className="shareSaveBean_img">
      <View className="shareSaveBean_height"></View>
      <View className="shareSaveBean_top"></View>
      <View
        className="shareSaveBean_profile"
        style={backgroundObj(profile)}
      ></View>
      <View className="shareSaveBean_desc">“谢谢你帮我～”</View>
      <View className="shareSaveBean_getbean shre_margin1">送你免费获得</View>
      <View className="shareSaveBean_getbean font_hide">
        {prizeName || prizeBean + "卡豆"}机会
      </View>
      <View className="shareSaveBean_font">赶紧去拿吧</View>
      <View
        className="shareSaveBean_btn public_center"
        onClick={() => change()}
      >
        立即去拿
      </View>
    </View>
  );
};
