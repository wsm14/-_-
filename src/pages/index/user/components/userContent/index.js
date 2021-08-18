import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { navigateTo, loginStatus, toast } from "@/common/utils";
import { loginBtn } from "@/common/authority";
import Router from "@/common/router";
import Download from "./components/index";
import Banner from "@/components/banner";
export default (props) => {
  const {
    status,
    data = {},
    levelDetails = {},
    nextLevel = {},
    infoCollect,
    fetchLever,
    fetchLoad,
    bannerList = [],
    fetchUserLeverToast,
  } = props;
  const { informCount, level = "0", incomeBean = 0 } = data;
  const { bean } = data;
  let {
    teamUserCount = 0,
    nextLevelInfo = "",
    monthIncome = 0,
    monthToIncome = 0,
    totalIncome = 0,
  } = levelDetails;
  const {
    levelProgress = {},
    processInfo = "",
    currentProgress = {},
    nextLevelUnlockBean = 0,
  } = nextLevel;
  const { normal } = levelProgress;
  const templateKol = () => {
    if (level === "0") {
      return (
        <View className="user_content_kolBox">
          <View className="user_content_kol">
            <View className="user_kol_lever public_auto">
              <View className="user_kol_leverLeft">
                <View className="user_kol_leverIcon"></View>
              </View>
              <View className="user_kol_leverContent">
                <View className="user_kol_leverTitle">解锁哒人</View>
                <View className="user_kol_leverDesc">
                  自购省分享赚，{nextLevelUnlockBean}卡豆免费领
                </View>
              </View>

              <View
                className="user_kol_leverRight public_center"
                onClick={() => {
                  if (currentProgress.normal >= normal) {
                    fetchLever();
                  } else {
                    toast("跳转权益中心");
                  }
                }}
              >
                {currentProgress.normal >= normal ? "解锁哒人" : "权益中心"}
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
          {loginStatus() && nextLevelInfo && (
            <View
              className="user_card_nextNever"
              onClick={() => {
                toast("跳转权益中心");
              }}
            >
              <View className="user_card_nextfont">{nextLevelInfo + " >"}</View>
              <View
                className="user_card_nextBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchUserLeverToast();
                }}
              ></View>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <Download
          fetchUserLeverToast={fetchUserLeverToast}
          incomeBean={incomeBean}
          levelDetails={levelDetails}
        ></Download>
      );
    }
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
      {bannerList.length > 0 && (
        <View className="banner_view">
          <Banner
            showNear={true}
            autoplay={bannerList.length > 1 ? true : false}
            imgStyle
            data={bannerList}
            imgName={"coverImg"}
            style={{ width: "100%", height: "100%" }}
            boxStyle={{ width: "100%", height: "100%" }}
          ></Banner>
        </View>
      )}
    </View>
  );
};
