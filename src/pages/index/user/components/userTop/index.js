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
    bean = 0,
  } = data;
  const goUser = () => {
    if (status === 1 && loginStatus()) {
      fetchUserDetails();
    } else {
      Router({
        routerName: "login",
      });
    }
  };
  //判断是否登录，未登录跳转登录页
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
  //同步微信信息
  const User = () => {
    return (
      <View className="user_top_box">
        <View
          onClick={() => goUser()}
          className="user_top_userProfile dakale_profile"
          style={backgroundObj(profile)}
        ></View>
        <View
          onClick={() => {
            if (!loginStatus()) {
              goUser();
            }
          }}
          className="user_top_usercontent"
        >
          <View className="user_top_username">
            <View className="user_max_width  font_hide">
              {status === 1 && loginStatus() ? username : "登录后玩转哒卡乐"}
            </View>
          </View>
          <View className="user_top_beanName font_hide">
            {" "}
            {status === 1 && loginStatus()
              ? loginStatus().mobile.replace(
                  /^(\d{3})\d{4}(\d{4})$/,
                  "$1****$2"
                )
              : "打卡，记录美好生活"}
          </View>
          {status === 1 && loginStatus() && (
            <View className="user_other_box public_auto">
              <View className="user_goLink" onClick={() => fetchUserDetails()}>
                <View className="color6 font24">同步微信账号</View>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };
  //顶部用户信息渲染组件
  const TopTabbar = () => {
    const list = [
      {
        icon: "user_tabbar_one",
        val: "我的券包",
        fn: () => {
          if (loginStatus()) {
            Router({
              routerName: "wraparound",
            });
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
      {
        icon: "user_tabbar_two",
        val: `${bean}卡豆`,
        fn: () => {
          if (loginStatus()) {
            Router({
              routerName: "rewardDetails",
            });
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
      {
        icon: "user_tabbar_three",
        val: `关注公众号`,
        fn: () => {
          if (loginStatus()) {
            Router({
              routerName: "webView",
              args: {
                link: "https://dakale-wx-hutxs-1302395972.tcloudbaseapp.com/dakale-web-page/wechant/page/interface.html",
                title: "关注公众号",
              },
            });
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
      {
        icon: "user_tabbar_four",
        val: `我要赚钱`,
        fn: () => {
          if (loginStatus()) {
            Router({
              routerName: "download",
              args: {
                link: "https://dakale-wx-hutxs-1302395972.tcloudbaseapp.com/dakale-web-page/wechant/page/interface.html",
                title: "关注公众号",
              },
            });
          } else {
            Router({
              routerName: "login",
            });
          }
        },
      },
    ];
    return (
      <View className="user_tabbarBox">
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
    );
  };
  //顶部用户权益功能组件
  const TopGoods = () => {
    const linkGoods = (val) => {
      if (loginStatus()) {
        Router({
          routerName: "goods",
          args: {
            defaultRouter: val,
          },
        });
      } else {
        Router({
          routerName: "login",
        });
      }
    };
    return (
      <View className="user_topGoods">
        <View className="user_top_title">我的订单</View>
        <View className="user_top_goods">
          <View className="user_goods_one" onClick={() => linkGoods(1)}>
            待付款
          </View>
          <View className="user_goods_two" onClick={() => linkGoods(2)}>
            可使用
          </View>
          <View className="user_goods_three" onClick={() => linkGoods(3)}>
            退款/售后
          </View>
          <View className="user_goods_four" onClick={() => linkGoods(0)}>
            全部订单
          </View>
        </View>
      </View>
    );
  };
  //顶部用户权益功能组件
  return (
    <View className="user_top_newBox">
      <User></User>
      <TopTabbar></TopTabbar>
      <TopGoods></TopGoods>
    </View>
  );
};
