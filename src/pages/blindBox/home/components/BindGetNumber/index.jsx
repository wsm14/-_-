import React from "react";
import { View, Button } from "@tarojs/components";
import Router from "@/common/router";
import { observer, MobXProviderContext } from "mobx-react";
import "./index.scss";
import { loginStatus } from "@/common/utils";

/**
 * 获取盲盒机会
 */
export default observer(({ data }) => {
  const { store } = React.useContext(MobXProviderContext);
  const { commonStore } = store;
  const { beanLimit } = commonStore;
  const { blindBoxInvitationTimes, blindBoxInvitationNum } = data;
  console.log();
  const getNumberList = [
    {
      icon: "video",
      title: "看视频捡卡豆",
      tip: `每天看视频最高可捡${beanLimit}卡豆`,
      btn: "video",
      fn: () => {
        Router({
          routerName: "nearVideo",
          args: {
            type: "goods",
          },
        });
      },
    },
    {
      icon: "invite",
      title: "邀请好友得免费机会",
      tip: `每邀请${blindBoxInvitationNum}个好友助力即可获得${blindBoxInvitationTimes}次机会 `,
      btn: "invite",
      fn: () => {
        if (!loginStatus()) {
          Router({
            routerName: "login",
          });
        }
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
            <View className={`bind_getNumber_btn ${item.btn}`}>
              {item.btn === "invite" && loginStatus() && (
                <Button
                  data-info="zl"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "none",
                    position: "absolute",
                  }}
                  openType={"share"}
                ></Button>
              )}
            </View>
          </View>
        ))}
      </View>
      {/* <View
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
      </View> */}
    </View>
  );
});
