import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { rssConfigData } from "./components/data";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import ButtonView from "@/components/Button";
import { loginStatus, mapGo, navigateTo, toast } from "@/common/utils";
import { getWechatKefuAccount } from "@/server/share";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cavansObj: {
        data: null,
        start: false,
      },
      visible: false,
      wechatAccount: "",
    };
  }
  componentWillUnmount() {}
  componentDidMount() {
    this.getWechatKefuAccount();
  }
  getWechatKefuAccount() {
    getWechatKefuAccount({}, (res) => {
      const { wechatAccount = "" } = res;
      console.log(wechatAccount);
      this.setState({
        wechatAccount,
      });
    });
  }
  getShareInfo() {
    const { profile, username } = Taro.getStorageSync("userInfo") || {};
    getShareInfo(
      {
        shareType: "activity",
        subType: "baolongActivity20210417",
      },
      (res) => {
        const { qcodeUrl } = res;
        this.setState({
          cavansObj: {
            start: true,
            data: rssConfigData({
              wxCode: qcodeUrl,
              username,
              userProfile: profile,
            }),
          },
        });
      }
    );
  }
  onShareAppMessage(res) {
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: "邀请函",
        path: `/pages/share/invitation/index?shareUserId=${userIdString}&shareUserType=user`,
      };
    }
  }
  setClipboard() {
    const { wechatAccount } = this.state;
    Taro.setClipboardData({
      data: wechatAccount,
      success: function (res) {
        toast("已复制哒卡乐官方微信，打开微信添加好友吧");
      },
      fail: function (res) {
        toast("复制失败");
      },
    });
  }
  render() {
    const { cavansObj, visible } = this.state;

    return (
      <View className="invitation_box">
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("点击保存")}
          onClose={() =>
            this.setState({ cavansObj: { start: false, data: null } })
          }
        ></TaroShareDrawer>
        <View className="invitation_img1">
          <Image
            className="invitation_img_style"
            lazyLoad
            src={
              "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/invitation_1_1.png"
            }
          />
          <ButtonView>
            <View
              className="goMap_btn"
              onClick={() =>
                mapGo({
                  lat: 30.312431,
                  lnt: 120.382048,
                  address: "下沙宝龙广场",
                  merchantName: "永辉超市入口处",
                })
              }
            ></View>
          </ButtonView>
          <ButtonView>
            <View
              className="shareFriend_btn"
              onClick={() => {
                loginStatus()
                  ? this.setState({ visible: true })
                  : navigateTo("/pages/auth/index");
              }}
            ></View>
          </ButtonView>
        </View>
        <View className="invitation_img2">
          <Image
            className="invitation_img_style"
            lazyLoad
            src={
              "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/invitation_4_15.png"
            }
          />
          <View
            className="getShop_btn"
            onClick={() => this.getShareInfo()}
          ></View>
        </View>
        <View className="invitation_img3">
          <Image
            className="invitation_img_style"
            lazyLoad
            src={
              "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/invitation_3_1.png"
            }
          />
        </View>
        <View
          onClick={() => this.getShareInfo()}
          className="invitation_img4"
        ></View>
        {visible && (
          <View
            catchMove
            className="invitation_active"
            onClick={(e) => {
              e.stopPropagation();
              this.setState({ visible: false });
            }}
          >
            <View
              className="invitation_childRenBox"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <View
                className="invitation_closeBox"
                onClick={(e) => {
                  this.setState({ visible: false });
                }}
              ></View>
              <View className="invitation_active_title"></View>
              <ButtonView>
                <View
                  className="invitation_active_btn"
                  onClick={() => {
                    this.setState(
                      {
                        visible: false,
                      },
                      (res) => {
                        mapGo({
                          lat: 30.312431,
                          lnt: 120.382048,
                          address: "下沙宝龙广场",
                          merchantName: "永辉超市入口处",
                        });
                      }
                    );
                  }}
                ></View>
              </ButtonView>
              <View className="invitation_active_bottom">
                活动地点：下沙宝龙广场永辉超市入口处
              </View>
              <View className="invitation_active_bottomFont">
                复制活动官方微信了解活动详情
              </View>
              <ButtonView>
                <View
                  className="invitation_active_bottomBtn"
                  onClick={() => {
                    this.setState({ visible: false }, (res) => {
                      this.setClipboard();
                    });
                  }}
                ></View>
              </ButtonView>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
