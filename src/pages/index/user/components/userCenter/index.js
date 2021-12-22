import React from "react";
import Taro from "@tarojs/taro";
import Banner from "@/components/banner";
import { View, Button } from "@tarojs/components";
import Router from "@/common/router";
import classnames from "classnames";
import { backgroundObj, loginStatus, navigateTo, toast } from "@/common/utils";
import "./index.scss";
export default ({ bannerList }) => {
  const BeanBar = () => {
    const list = [
      {
        icon: "user_centerBar_iconOne",
        val: "分享赚豆",
        fn: () => {
          if (loginStatus()) {
            Router({
              routerName: "shareFriend",
            });
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
      {
        icon: "user_centerBar_iconTwo",
        val: `卡豆农场`,
        fn: () => {
          if (loginStatus()) {
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
      {
        icon: "user_centerBar_iconThree",
        val: `集碎片`,
        fn: () => {
          if (loginStatus()) {
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
      {
        icon: "user_centerBar_iconFour",
        val: `签到赚豆`,
        fn: () => {
          if (loginStatus()) {
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
      {
        icon: "user_centerBar_iconFive",
        val: `免费领商品`,
        fn: () => {
          if (loginStatus()) {
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
    ];
    return (
      <View className="user_centerBar_beanBox">
        <View className="user_centerBar_title">玩赚卡豆</View>
        <View className="user_centerBar_icon">
          {list.map((item) => {
            return (
              <View
                onClick={() => {
                  item.fn && item.fn();
                }}
                className={item.icon}
              >
                {item.val}
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  const BottomShare = () => {
    const listTem = [
      {
        style: "users_setting_icon5",
        font: "我的地址",
        fn: () =>
          Router({
            routerName: "delivery",
            args: {
              mode: "list",
            },
          }),
      },
      {
        style: "users_setting_icon1",
        font: "微信客服",
        type: "connet",
      },
      {
        style: "users_setting_icon3",
        font: "我要合作",
        fn: () =>
          Router({
            routerName: "webView",
            args: {
              title: "我要合作",
              url: "shareUserId|1+shareUserType|2",
              link: "https://web-new.dakale.net/product/page/policy/cooperation.html",
            },
          }),
      },
      {
        style: "users_setting_icon2",
        font: "商户入驻",
        fn: () => {
          Router({
            routerName: "webView",
            args: {
              title: "商户入驻",
              link: "https://web-new.dakale.net/product/page/registerDownload/merchantRegustration.html",
            },
          });
        },
      },
    ];
    return (
      <View className="users_ourSetting_bg">
        <View className="users_setting_bg public_auto">
          {listTem.map((item, index) => {
            if (item.type) {
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
    );
  };
  return (
    <View className="user_centerBar_box">
      {/* <BeanBar></BeanBar> */}
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
      <View className="user_centerBar_banner">
        <Banner
          boxStyle={{ width: "100%", height: "100%", position: "relative" }}
          imgName="coverImg"
          linerSuccessColor={"rgba(255, 255, 255, 1)"}
          linerFallColor={`rgba(255, 255, 255, 0.5)`}
          data={[...bannerList]}
          showNear
        ></Banner>
      </View>
      <BottomShare></BottomShare>
    </View>
  );
};
