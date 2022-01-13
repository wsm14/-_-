import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { fakeStorage, fetchStorage } from "@/utils/utils";
import "./index.scss";
let touchStartY = 0;
let touchMoveY = 0;
export default () => {
  useEffect(() => {
    let falg = fetchStorage("videoFlag");
    if (!falg) {
      setVisible(() => {
        let time = setTimeout(() => {
          fakeStorage("videoFlag", true);
          setVisible(false);
          clearTimeout(time);
        }, 10000);
        return true;
      });
    }
  }, []);
  const [visible, setVisible] = useState(false);
  if (visible) {
    return (
      <View
        className="newsPilot_box public_center"
        onTouchStart={(e) => {
          touchStartY = e.touches[0].clientY;
        }}
        onTouchMove={(e) => {
          touchMoveY = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          if (touchStartY - touchMoveY > 150) {
            fakeStorage("videoFlag", true);
            setVisible(false);
          }
        }}
      >
        <View>
          <View className="newsPilot_title">向上滑动</View>
          <View className="newsPilot_title">观看下一个视频</View>
          <View className="newsPilot_icon"></View>
        </View>
      </View>
    );
  } else return null;
};
