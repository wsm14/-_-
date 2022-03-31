import React, { useEffect, useState, useRef } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import { toast } from "@/utils/utils";
export default ({ type = 0 }) => {
  const template = () => {
    return (
      <View className="collage_shop_content font_hide">
        <View className="collage_shop_profile"></View>
        <View className="collage_shop_right">
          <View className="collage_shop_title font_hide">
            电商商品名称电商商品名称电商商…
          </View> 
          <View className="collage_shop_price">
            <Text className="color1 font20">拼团价:</Text>
            <Text className="color3 font28">¥100</Text>
            <Text className="color2 font20"> 原价:</Text>
            <Text className="color2 font24 text_through">¥200</Text>
          </View>
          <View className="collage_shop_tagsBox"></View>
        </View>
      </View>
    );
  };
  const bottom = {
    0: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_stepBox">
          <View className="collage_shop_step">
            <View className="collage_shop_stepContent"></View>
          </View>
          <View className="collage_shop_stepFont">
            <Text className="color1">6</Text>/10
          </View>
        </View>
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox public_auto">
          <View className="collage_bottom_left">
            等待成团 | 5小时24分32秒后结束
          </View>
          <View className="collage_bottom_right">邀请好友</View>
        </View>
      </View>
    ),
    1: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_stepBox">
          <View className="collage_shop_step">
            <View className="collage_shop_stepContent"></View>
          </View>
          <View className="collage_shop_stepFont">
            <Text className="color1">6</Text>/10
          </View>
        </View>
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox">
          <View className="collage_bottom_left">
            等待成团 | 5小时24分32秒后结束
          </View>
        </View>
      </View>
    ),
    2: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox public_auto">
          <View className="collage_bottom_left">
            等待成团 | 5小时24分32秒后结束
          </View>
          <View className="collage_bottom_open">开团</View>
        </View>
      </View>
    ),
  }[type];
  return (
    <View className="collage_shop_box">
      {template()}
      {bottom}
    </View>
  );
};
