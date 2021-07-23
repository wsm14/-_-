import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { getLat, getLnt } from "@/common/utils";
import { View, Text, WebView } from "@tarojs/components";
export default ({ locationStatus, setLocation, city, setTab }) => {
  useEffect(() => {
    if (locationStatus) {
      setLocation(getLnt(), getLat());
    }
  }, [locationStatus]);
  return (
    <View className="mainScene_top">
      <View className="mainScene_box_location">
        <View className="mainScene_box_scene">
          <View className="color3 font26  bold">当前城市:{city}</View>
          <View
            className="mainScene_location_btn public_center"
            onClick={() => setTab()}
          >
            切换
          </View>
        </View>
      </View>
      <View className="mainScene_box_card">
        <View className="mainScene_box_height"></View>
        <View className="mainScene_card_box mainScene_card_style1">
          <View className="mainScene_card_btn mainScene_card_btnStyle1"></View>
        </View>
        <View className="mainScene_card_box mainScene_card_style2">
          <View className="mainScene_card_btn mainScene_card_btnStyle2"></View>
        </View>
        <View className="mainScene_card_box mainScene_card_style3">
          <View className="mainScene_card_btn mainScene_card_btnStyle3"></View>
        </View>
      </View>
    </View>
  );
};
