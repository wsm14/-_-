import React, { useState } from "react";
import Router from "@/common/router";
import { useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { fetchPcUserInfo } from "@/server/relay";
import "./index.scss";

export default () => {
  const [userInfo, setUserInfo] = useState({});

  useDidShow(() => {
    getUserInfo();
  });

  // 跳转自提点佣金设置
  const goPage = (routerName, args = {}) => {
    Router({
      routerName,
      args,
    });
  };

  // 获取用户信息
  const getUserInfo = () => {
    fetchPcUserInfo().then((res) => {
      setUserInfo(res);
    });
  };

  const toolsArr = [
    {
      leble: `￥${userInfo.cash || 0}`,
      icon: "tools_wallet",
      onClick: () => goPage("purse", { cash: userInfo.cash }),
    },
    {
      leble: `${userInfo.bean || 0}卡豆`,
      icon: "tools_bean",
    },
    {
      leble: "团员",
      icon: "tools_member",
      onClick: () => goPage("teamPlayer"),
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
          {/* <View className="pu_name_btn">切换身份</View> */}
        </View>
        <View className="pu_home">主页</View>
      </View>
      <View className="pu_tools">
        {toolsArr.map((i) => (
          <View className="pu_tools_cell" onClick={i.onClick}>
            <View className={`${i.icon} tools_text`}>{i.leble}</View>
          </View>
        ))}
      </View>
    </View>
  );
};
