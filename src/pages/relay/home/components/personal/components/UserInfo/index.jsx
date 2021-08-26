import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { fetchStorage } from "@/common/utils";
import "./index.scss";

export default (props) => {
  const userInfo = fetchStorage("userInfo") || {};

  const toolsArr = [
    {
      leble: "¥0",
      icon: "tools_wallet",
    },
    {
      leble: "¥0",
      icon: "tools_wallet",
    },
    {
      leble: "团员",
      icon: "tools_member",
    },
    {
      leble: "社群",
      icon: "tools_group",
    },
  ];

  return (
    <View className="personal_UserInfo">
      <View className="pu_heard">
        <View
          className="pu_heard_avatar dakale_profile"
          style={{
            background: userInfo.profile
              ? `url(${userInfo.profile}) no-repeat center/cover`
              : "",
          }}
        ></View>
        <View className="pu_name">
          <View className="pu_name_text">{userInfo.username}</View>
          <View className="pu_name_btn">切换身份</View>
        </View>
        <View className="pu_home">主页</View>
      </View>
      <View className="pu_tools">
        {toolsArr.map((i) => (
          <View className="pu_tools_cell">
            <View className={`${i.icon} tools_text`}>{i.leble}</View>
          </View>
        ))}
      </View>
    </View>
  );
};
