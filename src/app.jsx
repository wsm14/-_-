import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Store from "./model/index";
import { Provider } from "mobx-react";
import { authUpdateGeography } from "@/common/authority";
import {
  fetchShareParamInfo,
  fetchDictionary,
  fetchAllGlobalConfig,
  fetchPreferential,
  fetchFestivalConfigs,
} from "@/server/common";
import { authWxLogin } from "@/common/authority";
import { getOpenId } from "@/server/auth";
import evens from "@/common/evens";
import { fakeOperatingLog } from "@/server/common";
import "./assets/css/app.scss";
import "./assets/css/color.scss";
import "./assets/css/font.scss";
import "./assets/css/background.scss";
import "taro-skeleton/dist/index.css"; // 引入组件样式
const store = {
  ...Store,
};
class App extends Component {
  constructor() {
    super(...arguments);
  }
  componentDidMount() {
    this.fetchLocation();
    this.fetchNetwork();
    authWxLogin(this.fetchOpenId.bind(this));
    evens.$on("setLocation", this.fetchLocation.bind(this));
    this.fetchDictionary();
    this.fetchGlobalConfig();
    this.fetchPreferentialGlobal();
    this.fetchFestival();
  }
  componentDidHide() {
    const data = Taro.getStorageSync("operatingLog");
    if (data) {
      fakeOperatingLog({ wechatLogObjectList: data }).then((val) => {
        Taro.removeStorageSync("operatingLog");
      });
    }
    return;
  }

  componentDidShow(e) {
    this.fetchScene(e);
    this.fetchCheckUpdate();
    this.getShareType();
    if (!Taro.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      Taro.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: "dakale-wx-hutxs",
        traceUser: true,
      });
    }
  }
  getShareType() {
    const {
      shareUserId,
      shareUserType,
      scene,
      sourceKey = "",
      sourceType = "",
    } = getCurrentInstance().router.params;
    if (scene) {
      fetchShareParamInfo({ uniqueKey: scene }, (res) => {
        const {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          console.log(param);
          Store.authStore.setShareType({
            ...JSON.parse(param),
          });
        }
      });
    } else if (shareUserId && shareUserType) {
      Store.authStore.setShareType({
        shareUserId,
        shareUserType,
        sourceKey,
        sourceType,
      });
    } else {
      return;
    }
  }
  //获取分享绑定关系
  fetchPreferentialGlobal() {
    fetchPreferential({}).then((val) => {
      const { preferentialGlobalDefaultList = [] } = val;
      Store.commonStore.setCommonData(
        "preferentialGlobalDefaultList",
        preferentialGlobalDefaultList
      );
    });
  }
  //获取全局视频比例
  fetchGlobalConfig() {
    fetchAllGlobalConfig({}).then((val) => {
      let { configGlobalPopUpObjectList } = val;
      Store.commonStore.setCommonData(
        "configGlobalPopUpObjectList",
        configGlobalPopUpObjectList
      );
    });
  }
  //全局弹窗
  fetchScene(e) {
    const { scene } = e;
    Taro.setStorageSync("utm-medium", scene);
  }
  //设置渠道场景值
  fetchCheckUpdate() {
    // 判断目前微信版本是否支持自动更新
    if (Taro.canIUse("getUpdateManager")) {
      const updateManager = Taro.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        //检测是否有新版本
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            Taro.showModal({
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
      Taro.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  }
  fetchOpenId(code) {
    getOpenId(
      {
        code: code,
      },
      (res) => {
        const { userInfo } = res;
        if (userInfo && userInfo.mobile.length >= 11) {
          Taro.setStorageSync("userInfo", userInfo);
          Store.authStore.setUserInfoStore(userInfo);
        }
        Store.authStore.setLoginStatus();
      }
    );
  }
  //获取全局登录
  fetchLocation() {
    authUpdateGeography(this.fetchUpdataLocation.bind(this));
  }
  //设置默认地理位置
  fetchUpdataLocation(res = {}) {
    const { latitude, longitude } = res;
    Taro.setStorageSync("lat", latitude);
    Taro.setStorageSync("lnt", longitude);
    Store.locationStore.setLocation(latitude, longitude);
  }
  fetchFestival() {
    fetchFestivalConfigs({
      type: "topBackgroundWeChat",
      topType: "wanderAround",
    }).then((val) => {
      const { festivalConfigs = [] } = val;
      Store.commonStore.setCommonData("festivalConfigs", festivalConfigs);
    });
  }
  fetchDictionary() {
    fetchDictionary({
      parent: "moments",
      child: "preventSizeBeanNum",
    }).then((val) => {
      const { keyValueInfo = {} } = val;
      const { extraParam = "{}" } = keyValueInfo;
      const { beanLimit, weChatBeanLimit } = JSON.parse(extraParam) || {};
      Store.commonStore.setBean(weChatBeanLimit);
      Store.commonStore.setBalancen(beanLimit - weChatBeanLimit);
    });
  }
  //读取默认卡豆数量
  fetchNetwork() {
    Taro.onNetworkStatusChange((res) => {
      const { isConnected, networkType } = res;
      if (!isConnected) {
        Taro.showToast({
          title: "网络信号不稳定,请检查您的网络",
          duration: 2000,
          icon: "none",
        });
      } else {
        if (networkType === "2g" || networkType === "3g") {
          Taro.showToast({
            title: "当前网络信号差",
            duration: 2000,
            icon: "none",
          });
        }
      }
    });
  }
  // this.props.children 就是要渲染的页面
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
