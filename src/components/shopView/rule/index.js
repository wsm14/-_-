import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import Router from "@/common/router";
import {
  getLat,
  getLnt,
  GetDistance,
  filterStrList,
  mapGo,
} from "@/common/utils";
import MakePhone from "@/components/payTelephone";
import classNames from "classnames";
import "./index.scss";

export default (props) => {
  return (
    <View className="rule_box">
      <View className="rule_title">使用方法</View>
      <View className="rule_img"></View>
    </View>
  );
};
