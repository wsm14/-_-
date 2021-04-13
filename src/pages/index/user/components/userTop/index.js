import React from "react";
import Taro from "@tarojs/taro";
import Banner from "@/components/banner";
import { View } from "@tarojs/components";
import { backgroundObj, loginStatus, navigateTo } from "@/common/utils";
import Router from "@/common/router";
import classnames from "classnames";
import Skeleton from "taro-skeleton";
import "./../../index.scss";

export default (props) => {
  const { data, status } = props;
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
      navigateTo("/pages/newUser/userDetails/index");
    } else {
      login();
    }
  };
  return (
    <View className="user_top_box">
      <View
        onClick={() => goUser()}
        className="user_top_userProfile dakale_profile"
        style={backgroundObj(profile)}
      ></View>
      <View onClick={() => goUser()} className="user_top_usercontent">
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
      <View className="user_goLink" onClick={() => goUser()}>
        <View className="color1 font24">个人主页</View>
      </View>
    </View>
  );
};
