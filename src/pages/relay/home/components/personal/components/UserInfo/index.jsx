import React from "react";
import Router from "@/common/router";
import { View } from "@tarojs/components";
import "./index.scss";

export default ({ userInfo }) => {
  // 跳转自提点佣金设置
  const goPage = (routerName, args = {}) => {
    Router({
      routerName,
      args,
    });
  };

  const toolsArr = [
    {
      leble: `${userInfo.incomeBean || 0}卡豆`,
      icon: "tools_bean",
      onClick: () => goPage("purse"),
    },
    {
      leble: "团员",
      icon: "tools_member",
      onClick: () => goPage("teamPlayer"),
    },
    {
      leble: "社群",
      icon: "tools_group",
      onClick: () => goPage("dicPlayer"),
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
