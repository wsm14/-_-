import Taro, { getCurrentPages } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Button } from "@tarojs/components";
import { observer, inject } from "mobx-react";
import { navigateTo, removeLogin } from "@/common/utils";
import { authWxLogin } from "@/common/authority";
import { getOpenId, getUserInfo, bindTelephone } from "@/server/auth";
import "./index.scss";
import { goBack, toast } from "../../common/utils";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      btnStatus: 0, //0，未授权所有信息  ，1未授权手机号
      openId: "",
      unionId: "",
      visible: false,
    };
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
        } else if (userInfo && userInfo.mobile.length == 0) {
          this.setState({
            openId: openId,
            unionId: userInfo.unionId || unionId,
            btnStatus: 1,
          });
          that.props.store.authStore.setUserInfoStore(userInfo);
        } else {
          this.setState({
            openId: openId,
            unionId: userInfo.unionId || unionId,
          });
        }
      }
    );
  }

  async getUserInfo(e) {
    const { openId, unionId } = this.state;
    if (openId) {
      const {
        detail: { errMsg },
      } = e;
      const {
        encryptedData,
        iv,
        rawData,
        userInfo: { nickName, gender, avatarUrl },
      } = e.detail;
      if (errMsg === "getUserInfo:ok") {
        getUserInfo(
          { avatarUrl, gender, nickName, encryptedData, iv, openId, unionId },
          (res) => {
            const { mobile } = res.userInfo;
            const { userInfo = {} } = res;
            if (mobile && mobile.length === 11) {
              Taro.setStorageSync("userInfo", res.userInfo);
              return goBack(() => toast("登录成功"));
            } else {
              let oldObj = Taro.getStorageSync("userInfo") || {};
              Object.keys(userInfo).forEach((item) => {
                if (!userInfo[item]) {
                  delete userInfo[item];
                }
              });
              let obj = { ...oldObj, ...userInfo };
              Taro.setStorageSync("userInfo", obj);
              this.setState({
                btnStatus: 1,
                visible: true,
              });
            }
          }
        );
      } else {
        toast("授权用户信息失败");
      }
    } else {
      await authWxLogin(this.getOpenId.bind(this));
      toast("获取OpenId失败，请重试");
    }
  }

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
            const { userInfo } = res;
            Taro.setStorageSync("userInfo", userInfo);
            that.props.store.authStore.setUserInfoStore(userInfo);
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

  filterType() {
    const { btnStatus } = this.state;
    if (btnStatus === 0) {
      return "getUserInfo";
    } else if (btnStatus === 1) {
      return "getPhoneNumber";
    } else {
      return null;
    }
  }

  getLayerBtn(e) {
    this.setState(
      {
        visible: false,
      },
      (res) => {
        this.getTelephone(e);
      }
    );
  }

  render() {
    const { btnStatus, visible } = this.state;
    return (
      <View className="auth_box">
        <View className="auth_login"></View>
        <View className="auth_dec color1 font24">
          打卡改变生活 让生活更有价值
        </View>
        <Button
          openType={this.filterType()}
          onGetUserInfo={(e) => this.getUserInfo(e)}
          onGetPhoneNumber={(e) => this.getTelephone(e)}
          className="auth_btn"
        >
          {btnStatus === 0 ? "微信授权一键登录" : "请授权手机号"}
        </Button>
        <View className="auth_bottom color2 font24">
          登录表示您已阅读并同意
          <Text className="color4" onClick={() => this.goUserConceal()}>
            {" "}
            用户协议{" "}
          </Text>
          和
          <Text className="color4" onClick={() => this.goConceal()}>
            {" "}
            隐私政策{" "}
          </Text>
        </View>
        {visible && (
          <View
            className="auth_layer public_center"
            onClick={(e) => {
              this.setState({ visible: false });
            }}
          >
            <View
              className="auth_toast"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <View className="auth_title bold">
                小程序希望获取您的授权 以便一键注册哒卡乐
              </View>
              <View className="auth_toast_btn public_auto bold">
                <View
                  className="auth_toast_btnBox auth_color1"
                  onClick={(e) => {
                    this.setState({ visible: false });
                  }}
                >
                  取消
                </View>
                <Button
                  openType={"getPhoneNumber"}
                  className="auth_toast_btnBox auth_color2"
                  onGetPhoneNumber={(e) => this.getLayerBtn(e)}
                >
                  确定
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
