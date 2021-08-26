import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import UserInfo from "./components/UserInfo";
import DataCenter from "./components/DataCenter";
import "./index.scss";

export default (props) => {
  const { index } = props;

  return (
    <View style={{ display: index == 3 ? "block" : "none" }}>
      <View className="tabBar_personal">
        <UserInfo></UserInfo>
        <DataCenter></DataCenter>
      </View>
    </View>
  );
};
