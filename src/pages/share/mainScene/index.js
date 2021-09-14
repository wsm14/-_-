import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, WebView, Image } from "@tarojs/components";
import {
  getAuthStatus,
  scanCard,
  authUpdateGeography,
} from "@/common/authority";
import { inject, observer } from "mobx-react";
import { getRestapiAddress } from "@/server/common";
import { fetchListActivityGoods } from "@/server/share";
import { fetchUserShareCommission } from "@/server/index";
import {
  resiApiKey,
  toast,
  getLat,
  getLnt,
  loginStatus,
  computedLimit,
} from "@/common/utils";
import { getMainPage } from "@/server/user";
import Top from "./components/mainSceneTop";
import Center from "@/components/componentView/active/importScice";
import FriendScice from "@/components/componentView/active/friendScice";
import PayScice from "@/components/componentView/active/payScice";
import ShareFriend from "@/components/componentView/active/shareView";
import BeanToast from "@/components/componentView/active/beanToast";
import Router from "@/common/router";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {
      goodsList: [],
      configUserLevelInfo: {},
      userInfo: {},
      changeInfo: {},
      visible: false,
      specailList: [],
      playerList: [],
      cityCode: 3301,
    };
  }
  componentDidMount() {}
  componentDidShow() {
    this.fetchUserShare();
    this.fetchUserDetails();
  }
  fetchUserDetails() {
    getMainPage({}, (res) => {
      const { userInfo } = res;
      this.setState({
        userInfo: userInfo,
      });
    });
  }
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  setCityName() {
    this.fetchGoods();
    this.fetchSpecailList();
    this.fetchPlayerList();
  }
  onchangeInfo(item) {
    const { goodsIdString, ownerIdString, realPrice } = item;
    Router({
      routerName: "favourableDetails",
      args: {
        merchantId: ownerIdString,
        specialActivityId: goodsIdString,
      },
    });
  }

  fetchGoods() {
    const { cityCode } = this.state;
    fetchListActivityGoods({
      activityType: "midautumn",
      activityGoodsType: "hot",
      cityCode: cityCode,
      lat: getLat(),
      lnt: getLnt(),
    }).then((val) => {
      const { goodsList = [] } = val;
      this.setState({
        goodsList: this.filterList(goodsList),
      });
    });
  }
  fetchSpecailList() {
    const { cityCode } = this.state;
    fetchListActivityGoods({
      activityType: "midautumn",
      activityGoodsType: "special",
      cityCode: cityCode,
      lat: getLat(),
      lnt: getLnt(),
    }).then((val) => {
      const { goodsList = [] } = val;
      this.setState({
        specailList: this.filterList(goodsList),
      });
    });
  }
  fetchPlayerList() {
    const { cityCode } = this.state;
    fetchListActivityGoods({
      activityType: "midautumn",
      activityGoodsType: "player",
      cityCode: cityCode,
      lat: getLat(),
      lnt: getLnt(),
    }).then((val) => {
      const { goodsList = [] } = val;
      this.setState({
        playerList: this.filterList(goodsList),
      });
    });
  }
  filterList(list) {
    return list
      .map((item) => {
        const { lat, lnt } = item;
        return {
          ...item,
          limit: computedLimit(getLat(), getLnt(), lat, lnt),
        };
      })
      .sort(function (a, b) {
        return a.limit - b.limit;
      });
  }
  onShareAppMessage(res) {
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: "中秋9.9元抢肯德基下午茶套餐",
        path: `/pages/share/mainScene/index?shareUserId=${userIdString}&shareUserType=user`,
      };
    } else {
      return {
        title: "中秋9.9元抢肯德基下午茶套餐",
        path: `/pages/share/mainScene/index`,
      };
    }
  }
  onRouterInit() {
    Router({
      routerName: "webView",
      args: {
        link: "https://dakale-wx-hutxs-1302395972.tcloudbaseapp.com/dakale-web-page/wechant/page/active/midautumnRule.html",
      },
    });
  }
  render() {
    const {
      city,
      goodsList,
      userInfo,
      configUserLevelInfo,
      visible,
      specailList,
      playerList,
    } = this.state;
    const { login } = this.props.store.authStore;
    const { locationStore } = this.props.store;
    const { locationStatus } = locationStore;

    return (
      <View className="mainScene_box">
        <ShareFriend
          close={() =>
            this.setState({
              visible: false,
            })
          }
          visible={visible}
        ></ShareFriend>
        <Top
          setLocation={this.setCityName.bind(this)}
          locationStatus={locationStatus}
          onRouterInit={this.onRouterInit.bind(this)}
          shareInfo={() =>
            this.setState({
              visible: true,
            })
          }
          auth={login}
        ></Top>
        <Center
          onChange={this.onchangeInfo.bind(this)}
          list={goodsList}
          userInfo={configUserLevelInfo}
        ></Center>
        <FriendScice
          list={specailList}
          userInfo={configUserLevelInfo}
          onChange={this.onchangeInfo.bind(this)}
        ></FriendScice>
        <PayScice
          list={playerList}
          userInfo={configUserLevelInfo}
          onChange={this.onchangeInfo.bind(this)}
        ></PayScice>
      </View>
    );
  }
}
export default Index;
