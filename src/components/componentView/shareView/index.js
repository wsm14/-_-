/*
店铺详情优惠券公共样式

*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Router from "@/common/router";
import "./index.scss";
export default (props) => {
  return (
    <View className="share_info public_auto" onClick={() => Router({routerName:'download'})}>
      <View>邀请好友，解锁升级哒人，卡豆抵更多</View>
      <View>{">"}</View>
    </View>
  );
};
