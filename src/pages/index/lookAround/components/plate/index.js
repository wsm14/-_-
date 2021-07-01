import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj } from "@/common/utils";
import Taro from "@tarojs/taro";
import { template } from "@/components/specalTemplate";
import Router from "@/common/router";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const { levelKey = "normal" } = userInfo;
  const normalList = [
    "https://wechat-config.dakale.net/miniprogram/image/icon658.png",
    "https://wechat-config.dakale.net/miniprogram/image/icon659.png",
    "https://wechat-config.dakale.net/miniprogram/image/icon660.png",
  ];
  const kolList = [
    "https://wechat-config.dakale.net/miniprogram/image/icon661.png",
    "https://wechat-config.dakale.net/miniprogram/image/icon662.png",
    "https://wechat-config.dakale.net/miniprogram/image/icon663.png",
  ];
  const memo = useMemo(() => {
    return (
      <View className="lookAround_active_box public_auto">
        {levelKey === "normal"
          ? normalList.map((item) => {
              return (
                <View className="lookAround_active_card">
                  <Image
                    lazyLoad
                    src={item}
                    className="lookAround_active_image"
                  ></Image>
                </View>
              );
            })
          : kolList.map((item) => {
              return (
                <View className="lookAround_active_card">
                  <Image
                    lazyLoad
                    src={item}
                    className="lookAround_active_image"
                  ></Image>
                </View>
              );
            })}
      </View>
    );
  }, [levelKey]);
  return memo;
};
