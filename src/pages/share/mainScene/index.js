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
      count: 0,
      city: "杭州",
      cityCode: "3301",
      goodsList: [],
      configUserLevelInfo: {},
      userInfo: {},
      changeInfo: {},
      visible: false,
      specailList: [],
      playerList: [],
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
  setCityName(lat, lnt) {
    this.fetchGoods();
    this.fetchSpecailList();
    this.fetchPlayerList();
  }
  onchangeInfo(item) {
    const { configUserLevelInfo, userInfo } = this.state;
    const { payBeanCommission } = configUserLevelInfo;
    const { bean } = userInfo;
    const { goodsIdString, ownerIdString, realPrice } = item;
    if (realPrice * payBeanCommission > bean) {
      this.setState({
        visible: true,
        changeInfo: { ...item },
      });
    } else {
      Router({
        routerName: "favourableDetails",
        args: {
          merchantId: ownerIdString,
          specialActivityId: goodsIdString,
        },
      });
    }
  }
  setTabLocation() {
    const { cityCode } = this.state;
    if (cityCode === "3301") {
      this.setState(
        {
          city: "湘西",
          cityCode: "4331",
        },
        (res) => {
          this.fetchGoods();
        }
      );
    } else {
      this.setState(
        {
          city: "杭州",
          cityCode: "3301",
        },
        (res) => {
          this.fetchGoods();
        }
      );
    }
  }
  fetchGoods() {
    const { cityCode } = this.state;
    fetchListActivityGoods({
      activityType: "88activity",
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
      activityType: "88activity",
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
      activityType: "88activity",
      activityGoodsType: "hot",
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
        title: "哒卡乐88线下消费节",
        path: `/pages/share/mainScene/index?shareUserId=${userIdString}&shareUserType=user`,
      };
    }
  }
  onRouterInit() {
    Router({
      routerName: "webView",
      args: {
        link: "https://dakale-wx-hutxs-1302395972.tcloudbaseapp.com/dakale-web-page/wechant/page/active/rule.html?sign=9fcd12080c041f4f09f552f2ac070ceb&t=1627044102",
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
    const { locationStore } = this.props.store;
    const { cityName, flag, locationStatus, cityCode } = locationStore;
    const { activeInfoStore = {} } = this.props.store;
    const { activityStatus, needCountDown, dayCount } = activeInfoStore;
    if (needCountDown !== "1") {
      return (
        <View className="mainScene_box">
          <ShareFriend></ShareFriend>
          <View
            className="active_Rule"
            onClick={() => this.onRouterInit()}
          ></View>
          <Top
            store={locationStore}
            locationStatus={locationStatus}
            city={city}
            cityCode={cityCode}
            setTab={this.setTabLocation.bind(this)}
            setLocation={this.setCityName.bind(this)}
          ></Top>
          <Center
            onChange={this.onchangeInfo.bind(this)}
            list={goodsList}
            userInfo={configUserLevelInfo}
          ></Center>
          <FriendScice
            cityCode={cityCode}
            list={specailList}
            userInfo={configUserLevelInfo}
            onChange={this.onchangeInfo.bind(this)}
          ></FriendScice>
          <PayScice
            cityCode={cityCode}
            list={playerList}
            userInfo={configUserLevelInfo}
            onChange={this.onchangeInfo.bind(this)}
          ></PayScice>
          <BeanToast
            onClose={() => {
              this.setState({ visible: false });
            }}
            onLink={() => {
              this.setState({ visible: false }, (res) => {
                Router({
                  routerName: "friendScene",
                  args: { cityCode },
                });
              });
            }}
            onChange={() => {
              this.setState({ visible: false }, (res) => {
                const { changeInfo } = this.state;
                const { ownerIdString, goodsIdString } = changeInfo;
                Router({
                  routerName: "favourableDetails",
                  args: {
                    merchantId: ownerIdString,
                    specialActivityId: goodsIdString,
                  },
                });
              });
            }}
            show={visible}
          ></BeanToast>
        </View>
      );
    } else {
      return (
        <View className="mainScene_box">
          <View
            className="active_Rule"
            onClick={() => this.onRouterInit()}
          ></View>
          <ShareFriend></ShareFriend>
          <View className="mainScene_top">
            <View className="mainScene_box_location">
              <View
                className="mainScene_box_sceneInfo"
                style={{ alignItems: "baseline" }}
              >
                <Text className="mainScene_box_styleFont">活动倒计时</Text>
                <Text className="mainScene_box_styleFontBold">{dayCount}</Text>
                <Text className="mainScene_box_styleFont">天</Text>
              </View>
            </View>
            <View className="mainScene_box_card mainScene_box_cardbg2">
              <View className="mainScene_box_height"></View>
              <View className="mainScene_card_box mainScene_card_style1">
                <View className="mainScene_card_btn mainScene_card_style4"></View>
              </View>
              <View className="mainScene_card_box mainScene_card_style2">
                <View className="mainScene_card_btn mainScene_card_style4"></View>
              </View>
              <View className="mainScene_card_box mainScene_card_style3">
                <View className="mainScene_card_btn mainScene_card_style4"></View>
              </View>
              <View
                className="mainScene_card_linkH5"
                onClick={() => {
                  Router({
                    routerName: "webView",
                    args: {
                      link: "https://web-new.dakale.net/product/dakale-web-page/user/page/bannerShare/8.8upActive.html",
                    },
                  });
                }}
              ></View>
            </View>
          </View>
          <Image
            src={
              "https://wechat-config.dakale.net/miniprogram/active/8.8/active8_8_42.png"
            }
            mode="widthFix"
            className="mainScene_pp_box"
            lazyLoad
          ></Image>

          <View className="mainScene_logo_box">
            <View className="mainScene_card_logo"></View>
          </View>
        </View>
      );
    }
  }
}
export default Index;
