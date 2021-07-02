import React from "react";
import Taro from "@tarojs/taro";
import Banner from "@/components/banner";
import { View } from "@tarojs/components";
import { backgroundObj, loginStatus, navigateTo, toast } from "@/common/utils";
import { scanCode } from "@/common/authority";
import Router from "@/common/router";
import classnames from "classnames";
import { bindTelephone } from "@/server/auth";
import { saveUpdateLoginUserInfo } from "@/server/user";
import "./../../index.scss";

export default (props) => {
  const { data, status, reload } = props;
  const {
    profile,
    username,
    beanCode,
    levelName = "",
    levelIcon,
    level = "0",
  } = data;
  const login = () => {
    Router({
      routerName: "login",
    });
  };
  const goUser = () => {
    if (status === 1 && loginStatus()) {
      fetchUserDetails();
    } else {
      login();
    }
  };

  const fetchUserDetails = () => {
    const { xcxOpenId = "", unionId = "" } = loginStatus() || {};
    if (wx.getUserProfile) {
      wx.getUserProfile({
        desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          const { errMsg, userInfo } = res;
          if (errMsg === "getUserProfile:ok") {
            const { nickName, avatarUrl } = userInfo;
            saveUpdateLoginUserInfo(
              {
                username: nickName,
                profile: avatarUrl,
              },
              (res) => {
                reload();
              }
            );
          } else {
            console.log(errMsg);
            toast("获取失败");
          }
        },
      });
    } else {
      toast("基础库版本过低 无法同步,请升级微信");
    }
  };
  return (
    <View className="user_top_newBox">
      <View className="user_top_box">
        <View
          onClick={() => goUser()}
          className="user_top_userProfile dakale_profile"
          style={backgroundObj(profile)}
        ></View>
        <View onClick={() => {
          if (!loginStatus()) {
            goUser()
          }
        }} className="user_top_usercontent">
          <View className="user_top_username">
            <View className="user_max_width  font_hide">
              {status === 1 && loginStatus() ? username : "登录后玩转哒卡乐"}
            </View>
            {level !== "0" && (
              <View
                className={classnames(
                  "user_top_Icon",
                  levelName.indexOf("哒人") > -1 ? "user_color1" : "user_color2"
                )}
              >
                {levelName}
                <View
                  className="user_icons_box"
                  style={backgroundObj(levelIcon)}
                ></View>
              </View>
            )}
          </View>
          <View className="user_top_beanName font_hide">
            {" "}
            {status === 1 && loginStatus()
              ? "豆号：" + beanCode
              : "打卡，记录美好生活"}
          </View>
        </View>
      </View>
      {status === 1 && loginStatus() && (
        <View className="user_other_box public_auto">
          <View
            className="user_goLink"
            onClick={() => fetchUserDetails()}
          >
            <View className="color6 font24">同步微信账号</View>
          </View>
          <View className="user_scan" onClick={() => scanCode()}></View>
        </View>
      )}
    </View>
  );
};
