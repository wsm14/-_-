import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./../../index.scss";
import { navigateTo, loginStatus } from "@/common/utils";
import { loginBtn } from "@/common/authority";
import Router from "@/common/router";
import Download from "./components/index";
export default (props) => {
  const {
    status,
    data = {},
    levelDetails = {},
    nextLevel = {},
    infoCollect,
    fetchLever,
  } = props;
  const { informCount, level = "0" } = data;
  const { bean } = data;
  const {
    teamUserCount = 0,
    nextLevelInfo,
    monthIncome = 0,
    monthToIncome = 0,
    totalIncome = 0,
  } = levelDetails;
  const { levelProgress = {}, processInfo, currentProgress = {} } = nextLevel;
  const { normal } = levelProgress;
  const list = [
    {
      style: "user_tab_icon1",
      font: "我的券包",
      fn: () => navigateTo("/pages/coupon/wraparound/index"),
    },
    {
      style: "user_tab_icon2",
      font: "关注店铺",
      fn: () =>
        Router({
          routerName: "download",
        }),
    },
    {
      style: "user_tab_icon3",
      font: "商品收藏",
      fn: () =>
        Router({
          routerName: "download",
        }),
    },
    {
      style: "user_tab_icon4",
      font: "打卡足迹",
      fn: () =>
        Router({
          routerName: "download",
        }),
    },
    {
      style: "user_tab_icon5",
      font: "我的圈层",
      fn: () =>
        Router({
          routerName: "download",
        }),
    },
  ];
  const templateKol = () => {
    if (level === "0") {
      return (
        <View className="user_content_kolBox">
          <View className="user_content_kol">
            <View className="user_kol_lever public_auto">
              <View className="user_kol_leverLeft">
                <View className="user_kol_leverIcon"></View>
                <View className="user_kol_leverTitle">升级哒人</View>
                <View className="user_kol_leverDesc">自购省 分享赚</View>
              </View>
              <View
                className="user_kol_leverRight public_center"
                onClick={() => {
                  if (currentProgress.normal / normal >= 1) {
                    fetchLever();
                  } else {
                    infoCollect();
                  }
                }}
              >
                解锁哒人
              </View>
            </View>

            {teamUserCount != 0 && status === 1 && (
              <React.Fragment>
                <View className="user_content_toast">
                  <View className="user_content_toastLiner">
                    <View
                      className="user_content_toastChecked"
                      style={{ width: (teamUserCount / normal) * 100 + "%" }}
                    ></View>
                  </View>
                  <View className="color1  font24 user_toastLeft">{`${teamUserCount}/${normal}`}</View>
                </View>
                <View className="user_content_desc font24 color2">
                  {processInfo}
                </View>
              </React.Fragment>
            )}
          </View>
        </View>
      );
    } else {
      return <Download levelDetails={levelDetails}></Download>;
    }
  };
  const linkTo = (item) => {
    if (item.fn) {
      item.fn();
    } else return;
  };
  return (
    <View className="user_content">
      <View
        onClick={() => {
          loginBtn(() => {
            Router({
              routerName: "wallet",
            });
          });
        }}
        className="user_content_card"
      >
        <View className="public_auto user_card_box">
          <View className="user_card_left">我的钱包</View>
          <View className="user_card_right">
            <View className="user_card_bean">卡豆余额</View>
            <View className="user_card_beanNum">{bean}</View>
            <View className="user_card_goLink"></View>
          </View>
        </View>
      </View>
      {templateKol()}
    </View>
  );
};
