import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Store from "./model/index";
import { Provider } from "mobx-react";
import { authUpdateGeography } from "@/common/authority";
import { getShareParamInfo } from "@/server/common";
import "./assets/css/app.scss";
import "./assets/css/color.scss";
import "./assets/css/font.scss";
import "./assets/css/background.scss";
const store = {
  ...Store,
};

class App extends Component {
  constructor() {
    super(...arguments);
  }
  componentDidMount() {
    this.fetchLocation();
  }

  componentDidShow() {
    this.fetchCheckUpdate();
    this.getShareType();
  }

  componentDidHide() {}

  componentDidCatchError() {}
  componentWillUnmount() {}
  getShareType() {
    const {
      shareUserId,
      shareUserType,
      scene,
    } = getCurrentInstance().router.params;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        const {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          Store.authStore.setShareType({
            ...JSON.parse(param),
          });
        }
      });
    } else if (shareUserId && shareUserType) {
      Store.authStore.setShareType({
        shareUserId,
        shareUserType,
      });
    } else {
      return;
    }
  }
  fetchCheckUpdate() {
    // 判断目前微信版本是否支持自动更新
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        //检测是否有新版本
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: "更新提示",
              confirmText: "确定",
              showCancel: false,
              content: "新版本已经准备好，需要重新启动",
              success: function (res) {
                if (res.confirm) {
                  // 更新
                  updateManager.applyUpdate();
                }
              },
            });
          });
        }
      });
    } else {
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  }

  fetchLocation() {
    authUpdateGeography(this.fetchUpdataLocation.bind(this));
  }

  fetchUpdataLocation(res) {
    const { latitude, longitude } = res;
    Taro.setStorageSync("lat", latitude);
    Taro.setStorageSync("lnt", longitude);
    Store.locationStore.setLocation(latitude, longitude);
  }

  // this.props.children 就是要渲染的页面
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
