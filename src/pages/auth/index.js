import Taro, { getCurrentPages } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Button } from "@tarojs/components";
import { observer, inject } from "mobx-react";
import { navigateTo, removeLogin } from "@/common/utils";
import { authWxLogin } from "@/common/authority";
import { getOpenId, getUserInfo, bindTelephone } from "@/server/auth";
import "./index.scss";
import { goBack, toast } from "../../common/utils";
import evens from "@/common/evens";
import Router from "@/common/router";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      openId: "",
      unionId: "",
      visible: false,
    };
  }
  componentWillUnmount() {
    var url = getCurrentPages()[getCurrentPages().length - 2].route || "";
    if (url && url.includes("pages/index/home/index")) {
      evens.$emit("reload");
    }
  }

  componentWillMount() {
    removeLogin();
  }

  componentDidMount() {
    authWxLogin(this.getOpenId.bind(this));
  }

  goConceal() {
    const link = "https://web-new.dakale.net/product/page/policy/conceal.html";
    navigateTo(`/pages/share/webView/index?link=${link}&title=隐私协议`);
  }

  goUserConceal() {
    const link =
      "https://web-new.dakale.net/product/page/policy/userConceal.html";
    navigateTo(`/pages/share/webView/index?link=${link}&title=用户协议`);
  }

  getOpenId(code) {
    const that = this;
    getOpenId(
      {
        code: code,
      },
      (res) => {
        const { openId, unionId, userInfo } = res;
        if (userInfo && userInfo.mobile.length >= 11) {
          Taro.setStorageSync("userInfo", userInfo);
          that.props.store.authStore.setUserInfoStore(userInfo);
          return goBack(() => toast("登录成功"));
        } else {
          this.setState({
            openId: openId,
            unionId: unionId,
          });
        }
      }
    );
  }

  // bindUser() {
  //   const { btnStatus, openId, unionId } = this.state;
  //   if (openId && unionId) {
  //     if (btnStatus === 0 && wx.getUserProfile) {
  //       wx.getUserProfile({
  //         desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //         success: (res) => {
  //           const { errMsg, userInfo } = res;
  //           if (errMsg === "getUserProfile:ok") {
  //             getUserInfo(
  //               {
  //                 openId,
  //                 unionId,
  //                 ...userInfo,
  //               },
  //               (res) => {
  //                 const { mobile } = res.userInfo;
  //                 const { userInfo = {} } = res;
  //                 if (mobile && mobile.length === 11) {
  //                   Taro.setStorageSync("userInfo", res.userInfo);
  //                   return goBack(() => toast("登录成功"));
  //                 } else {
  //                   let oldObj = Taro.getStorageSync("userInfo") || {};
  //                   Object.keys(userInfo).forEach((item) => {
  //                     if (!userInfo[item] || userInfo[item] === "") {
  //                       delete userInfo[item];
  //                     }
  //                   });
  //                   let obj = { ...oldObj, ...userInfo };
  //                   Taro.setStorageSync("userInfo", obj);
  //                   this.setState({
  //                     btnStatus: 1,
  //                     visible: true,
  //                   });
  //                 }
  //               }
  //             );
  //           } else {
  //             console.log(errMsg);
  //             toast("获取失败");
  //           }
  //         },
  //       });
  //     }
  //   } else {
  //     authWxLogin(this.getOpenId.bind(this));
  //     toast("获取OpenId失败，请重试");
  //   }
  // }

  // async getUserInfo(e) {
  //   const { openId, unionId } = this.state;
  //   console.log(e);
  //   if (openId) {
  //     const {
  //       detail: { errMsg },
  //     } = e;
  //     const {
  //       encryptedData,
  //       iv,
  //       rawData,
  //       userInfo: { nickName, gender, avatarUrl },
  //     } = e.detail;
  //     if (errMsg === "getUserInfo:ok") {
  //       getUserInfo(
  //         { avatarUrl, gender, nickName, encryptedData, iv, openId, unionId },
  //         (res) => {
  //           const { mobile } = res.userInfo;
  //           const { userInfo = {} } = res;
  //           if (mobile && mobile.length === 11) {
  //             Taro.setStorageSync("userInfo", res.userInfo);
  //             return goBack(() => toast("登录成功"));
  //           } else {
  //             let oldObj = Taro.getStorageSync("userInfo") || {};
  //             Object.keys(userInfo).forEach((item) => {
  //               if (!userInfo[item] || userInfo[item] === "") {
  //                 delete userInfo[item];
  //               }
  //             });
  //             let obj = { ...oldObj, ...userInfo };
  //             Taro.setStorageSync("userInfo", obj);
  //             this.setState({
  //               btnStatus: 1,
  //               visible: true,
  //             });
  //           }
  //         }
  //       );
  //     } else {
  //       toast("授权用户信息失败");
  //     }
  //   } else {
  //     await authWxLogin(this.getOpenId.bind(this));
  //     toast("获取OpenId失败，请重试");
  //   }
  // }

  async getTelephone(e) {
    let that = this;
    const {
      detail: { errMsg },
    } = e;
    const { openId, unionId } = this.state;
    const { shareType } = this.props.store.authStore;
    if (errMsg === "getPhoneNumber:ok") {
      //如果用户点击同意授权
      if (openId) {
        const { encryptedData, iv } = e.detail;
        bindTelephone(
          { openId, unionId, encryptedData, iv, ...shareType },
          (res) => {
            let { userInfo = {} } = res;
            let oldObj = Taro.getStorageSync("userInfo") || {};
            Object.keys(userInfo).forEach((item) => {
              if (!userInfo[item] || userInfo[item] === "") {
                delete userInfo[item];
              }
            });
            let obj = { ...oldObj, ...userInfo };
            Taro.setStorageSync("userInfo", obj);
            that.props.store.authStore.setUserInfoStore(obj);
            goBack(() => toast("登录成功"));
          }
        );
      } else {
        await authWxLogin(this.getOpenId.bind(this));
        toast("获取OpenId失败，请重试");
      }
      //获取手机号加密数据
    }
    //请求回调
    else {
      toast("授权手机号码失败");
    }
  }
  render() {
    const { btnStatus } = this.state;
    return (
      <View className="auth_box">
        <View className="auth_login"></View>
        <View className="auth_btn">
          <Button
            openType={"getPhoneNumber"}
            onGetPhoneNumber={(e) => this.getTelephone(e)}
            className="clearBtn"
          ></Button>
        </View>

        <View className="auth_bottom color2 font24">
          登录表示您已阅读并同意{" "}
          <Text className="textThould" onClick={() => this.goUserConceal()}>
            用户协议
          </Text>{" "}
          和{" "}
          <Text className="textThould" onClick={() => this.goConceal()}>
            隐私政策
          </Text>
        </View>
      </View>
    );
  }
}

export default Index;
