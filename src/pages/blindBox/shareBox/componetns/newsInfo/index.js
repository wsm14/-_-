import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/utils/router";
import "./index.scss";
import { backgroundObj, fetchStorage } from "@/utils/utils";
export default ({ change }) => {
  return (
    <View className="newsInfo_img">
      <View className="newsInfo_height"></View>
      <View className="newsInfo_font_title">只有新用户才可以助力哦！</View>
      <View className="newsInfo_font_content newsInfo_font_bold">
        超多好礼尽在拆盲盒 去拆盲盒吧
      </View>
      <View style={{ visibility: "hidden" }} c className="newsInfo_font_bold">
        iPhone13到手
      </View>
      <View className="newsInfo_btn public_center" onClick={() => change()}>
        去拆盲盒
      </View>
    </View>
  );
};
