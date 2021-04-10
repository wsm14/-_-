import React from "react";
import Taro from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import Banner from "@/components/banner";
import { navigateTo, toast } from "@/common/utils";
import "./../../index.scss";

export default ({ list = [] }) => {
  const listTem = [
    {
      style: "users_setting_icon1",
      font: "微信客服",
    },
    {
      style: "users_setting_icon2",
      font: "意见反馈",
      fn: () => toast("暂无反馈"),
    },
    {
      style: "users_setting_icon3",
      font: "我要合作",
      fn: () =>
        navigateTo(
          `/pages/share/webView/index?link=${"https://web-new.dakale.net/product/page/policy/cooperation.html?shareUserId=1&shareUserType=2"}&title=我要合作`
        ),
    },
  ];
  return (
    <View className="user_bottom_box">
      <View className="user_bottom_title public_auto">
        <View className="user_bottom_titleLeft">玩赚卡豆</View>
        <View className="user_bottom_titleRight" onClick={() =>navigateTo(`/pages/share/webView/index?link=${"https://web-new.dakale.net/product/page/policy/eQuity.html"}&title=卡豆攻略`)}>
          <View>卡豆攻略</View>
        </View>
      </View>
      <View className="user_bottom_share public_auto">
        <View
          className="user_share_image user_share_img1"
          onClick={() => navigateTo("/pages/share/shareFriend/index")}
        >
          <View className="share_name">分享赚豆</View>
          <View className="share_title">好友注册 你领卡豆</View>
          <View className="share_link public_center">去邀请</View>
        </View>
        <View
          className="user_share_image user_share_img2"
          onClick={() =>
            navigateTo(
              `/pages/share/webView/index?link=${"https://web-new.dakale.net/product/page/bannerShare/merchantPlaybill.html"}&title=我要推店`
            )
          }
        >
          <View className="share_name">推店赚豆</View>
          <View className="share_title">推店成家主 赚豆</View>
          <View className="share_link public_center">去推店</View>
        </View>
      </View>
      <View className="banner_view">
        <Banner
          showNear={true}
          autoplay={list.length > 1 ? true : false}
          imgStyle
          data={list}
          imgName={"coverImg"}
          style={{ width: "100%", height: "100%" }}
          boxStyle={{ width: "100%", height: "100%" }}
          bottom={{ bottom: Taro.pxTransform(104) }}
        ></Banner>
      </View>
      <View className="users_ourSetting">
        <View className="users_ourSetting_title font40 color1 bold">
          更多功能
        </View>
        <View className="users_ourSetting_bg">
          <View className="users_setting_bg public_auto">
            {listTem.map((item, index) => {
              if (index === 0) {
                return (
                  <View
                    className="users_set_box"
                    onClick={() => item.fn && item.fn()}
                  >
                    <View className={`users_setting_icons ${item.style}`}>
                      <Button
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          background: "none",
                        }}
                        openType={"contact"}
                      ></Button>
                    </View>
                    <View className="users_setting_font font24 color1">
                      {item.font}
                    </View>
                  </View>
                );
              }
              return (
                <View
                  className="users_set_box"
                  onClick={() => item.fn && item.fn()}
                >
                  <View className={`users_setting_icons ${item.style}`}></View>
                  <View className="users_setting_font font24 color1">
                    {item.font}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};
