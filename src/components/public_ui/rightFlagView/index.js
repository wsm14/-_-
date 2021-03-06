import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import "./index.scss";
import { backgroundObj, fetchStorage } from "@/utils/utils";
export default ({ data, close }) => {
  const { img, bean, name, price } = data;
  const { profile } = fetchStorage("userInfo") || {};
  return (
    <View className="rightFlagView_img">
      <View className="rightFlagView_box0 "></View>
      <View
        className="rightFlagView_box1 merchant_dakale_logo"
        style={backgroundObj(profile)}
      ></View>
      <View className="rightFlagView_box2">
        <Text className="color1">仅差</Text>
        <Text className="color3">{bean}卡豆</Text>
        <Text className="color1">就可把</Text>
      </View>
      <View className="rightFlagView_box3 font_hide">{name}</View>
      <View className="rightFlagView_box4">{price}元带回家</View>
      <View
        className="rightFlagView_box5  public_center"
        onClick={() => {
          close &&
            close(() => {
              Router({
                routerName: "nearVideo",
                args: {
                  type: "goods",
                },
              });
            });
        }}
      >
        刷视频捡卡豆
      </View>
    </View>
  );
};
