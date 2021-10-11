import React from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import { observer } from "mobx-react";
import "./index.scss";

/**
 * 获取盲盒机会
 */
export default ({ data }) => {
  const { blindBoxInvitationTimes } = data;
  console.log();
  const getNumberList = [
    {
      icon: "video",
      title: "看视频捡卡豆",
      tip: "每天看视频最高可捡500卡豆",
      btn: "video",
      fn: () => {
        Router({
          routerName: "home",
          type: "switchTab",
        });
      },
    },
    {
      icon: "invite",
      title: "邀请好友得免费机会",
      tip: `每天最高可获得${blindBoxInvitationTimes}次免费拆盲盒机会  `,
      btn: "invite",
      fn: () => {
        Router({
          routerName: "blindShare",
        });
      },
    },
  ];

  return (
    <View className="bind_getNumber">
      <View className="bind_getNumber_title"></View>
      <View className="bind_getNumber_group">
        {getNumberList.map((item) => (
          <View className="bind_getNumber_cell" onClick={() => item.fn()}>
            <View className={`bind_getNumber_icon ${item.icon}`}></View>
            <View className="bind_getNumber_info">
              <View className="bind_getNumberInfo_title">{item.title}</View>
              <View className="bind_getNumber_tip">{item.tip}</View>
            </View>
            <View className={`bind_getNumber_btn ${item.btn}`}></View>
          </View>
        ))}
      </View>
      <View
        className="bind_recharge"
        onClick={() => Router({ routerName: "recharge" })}
      >
        <View className="bind_recharge_title"></View>
        <View className="bind_recharge_cell">
          <View className="bind_rechargeCell_content">
            <View className="bind_rechargeCell_title">话费充值</View>
            <View className="bind_rechargeCell_tip">卡豆充话费 省钱又省力</View>
          </View>
        </View>
      </View>
    </View>
  );
};
