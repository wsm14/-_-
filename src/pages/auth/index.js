import Taro, { getCurrentPages } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Button } from "@tarojs/components";
import { observer, inject } from "mobx-react";
import { authWxLogin } from "@/common/authority";
import { getOpenId, bindTelephone } from "@/server/auth";
import { goBack, toast, removeLogin } from "@/utils/utils";
import evens from "@/common/evens";
import Router from "@/utils/router";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      openId: "",
      unionId: "",
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
    Router({
      rouerName: "webView",
      args: {
        link,
      },
    });
  }
  //跳转隐私协议
  goUserConceal() {
    const link =
      "https://dakale-wx-hutxs-1302395972.tcloudbaseapp.com/dakale-web-page/wechant/page/policy/userConceal.html";
    Router({
      rouerName: "webView",
      args: {
        link,
      },
    });
  }
  //跳转用户协议
  getOpenId(code) {
    const that = this;
    getOpenId(
      {
        code: code,
      },
      (res) => {
        const { openId, unionId, userInfo } = res;
        if (userInfo && userInfo.mobile.length >= 11) {
          //用户存在手机号的情况视为已登录 返回上一页
          Taro.setStorageSync("userInfo", userInfo);
          that.props.store.authStore.setUserInfoStore(userInfo);
          return goBack(() => toast("登录成功"));
        } else {
          this.setState({
            openId: openId,
            unionId: unionId,
          });
          //保存检验字段用户获取 手机号码
        }
      }
    );
  }
  //获取用户openId unionId
  async getTelephone(e) {
    let that = this;
    const {
      detail: { errMsg },
    } = e;
    const { openId, unionId } = this.state;
    const { shareType } = this.props.store.authStore;
    //拿取全局绑定关系
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
  //用户注册手机号
  render() {
    return (
      <View className="auth_box">
        <View className="auth_login">
          <View className="auth_btnTitle1">哒卡乐小程序</View>
          <View className="auth_btnTitle2">
            <Text className="bold">哒卡乐小程序</Text>获得以下授权
          </View>
          <View className="auth_btnTitle3">获取您的手机号，以享受更多优惠</View>
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
      </View>
    );
  }
}

export default Index;
