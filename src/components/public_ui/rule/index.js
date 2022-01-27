import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";

import "./index.scss";

export default (props) => {
  return (
    <View className="rule_box">
      <View className="rule_title">使用方法</View>
      <View className="rule_img"></View>
    </View>
  );
};
