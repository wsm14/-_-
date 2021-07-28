import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView, ScrollView } from "@tarojs/components";
import {
  getAuthStatus,
  scanCard,
  authUpdateGeography,
} from "@/common/authority";
import { inject, observer } from "mobx-react";
import { getRestapiAddress } from "@/server/common";
import {
  resiApiKey,
  toast,
  getLat,
  getLnt,
  loginStatus,
  computedLimit,
} from "@/common/utils";
import { fetchUserShareCommission } from "@/server/index";
import { fetchInActivityAchievement } from "@/server/share";
import Top from "./components/top";
import { getMainPage } from "@/server/user";
import Center from "@/components/componentView/active/importScice";
import FriendScice from "@/components/componentView/active/friendScice";
import PayScice from "@/components/componentView/active/payScice";
import ShareFriend from "@/components/componentView/active/shareView";
import Toast from "@/components/dakale_toast";
import { fetchListActivityGoods } from "@/server/share";
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
      cityCode: getCurrentInstance().router.params.cityCode,
      configUserLevelInfo: {},
      userInfo: {},
      visible: false,
      orderInfo: {},
      ruleVisible: false,
    };
  }
  componentDidMount() {
    this.fetchGoods();
    this.fetchSpecailList();
    this.fetchPlayerList();
  }
  componentDidShow() {
    this.fetchUserShare();
    this.fetchUserDetails();
    this.fetchInActivityAchievement();
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
  onchangeInfo(item) {
    const { goodsIdString, ownerIdString } = item;
    Router({
      routerName: "favourableDetails",
      args: {
        merchantId: ownerIdString,
        specialActivityId: goodsIdString,
      },
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
  fetchInActivityAchievement() {
    fetchInActivityAchievement({ activityType: "88activity" }).then((val) => {
      const { orderInfo } = val;
      const { statisticOrderCount = "0" } = orderInfo;
      this.setState({
        orderInfo: { statisticOrderCount },
      });
    });
  }
  setRuleVisible(val) {
    this.setState({
      ruleVisible: val,
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
  fetchUserDetails() {
    getMainPage({}, (res) => {
      const { userInfo } = res;
      this.setState({
        userInfo: userInfo,
      });
    });
  }
  onShareAppMessage(res) {
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: "达人招募令",
        path: `/pages/share/mainScene/index?shareUserId=${userIdString}&shareUserType=user`,
      };
    }
  }
  render() {
    const {
      configUserLevelInfo,
      visible,
      userInfo,
      orderInfo,
      ruleVisible,
      specailList,
      playerList,
      goodsList,
      cityCode,
    } = this.state;
    console.log(configUserLevelInfo);
    return (
      <View className="shopScene_box">
        <View
          className="active_Rule"
          onClick={() => this.setRuleVisible(true)}
        ></View>
        <Top
          userInfo={userInfo}
          orderInfo={orderInfo}
          onShare={() => this.setState({ visible: true })}
          configUserLevelInfo={configUserLevelInfo}
        ></Top>
        {ruleVisible && (
          <Toast title={"活动规则"} close={() => this.setRuleVisible(false)}>
            <ScrollView scrollY className="shop_dakale_content">
              <View>
                1、活动期间，哒卡乐注册用户通过前述活动参与渠道进入活动页面即可根据页面提示参与活动；
              </View>
              <View>
                2、活动期间，每位用户每日仅有1次拉新用户—领取卡豆膨胀金的机会，进入拉新卡豆膨胀金会场，可进行拉好友注册，膨胀卡豆金活动，只需将个人哒卡乐邀请码或本活动页面转发给好友，好友通过邀请码或分享的活动页面注册成功后，即算作成功拉新1人，邀请好友注册人数越多，获得卡豆奖励越多；
              </View>
              <View>3、 每日0点更新第二日活动；</View>
              <View>
                4、当日完成拉新任务达到指标后，需用户主动领取卡豆，领取后卡豆自动流入“我的一我的钱包”，若用户当日没有主动领取，第二日活动开始时，完成任务未领取的卡豆将自动流入“我的一我的钱包”中，具体卡豆使用规则及有效期详见卡豆钱包中卡豆规则；
              </View>
              <View>
                5、
                同一哒卡乐账户、微信账户、身份证、手机号、手机设备，符合以上任一条件，均视为同一用户，同一用户每日仅限参与一次拉新卡豆膨胀金活动。
              </View>
            </ScrollView>
          </Toast>
        )}
        <View className="shopScene_ceil_margin"></View>
        <Center
          onChange={this.onchangeInfo.bind(this)}
          list={goodsList}
          type={"share"}
          userInfo={configUserLevelInfo}
        ></Center>
        <FriendScice
          cityCode={cityCode}
          list={specailList}
          userInfo={configUserLevelInfo}
          type={"share"}
          onChange={this.onchangeInfo.bind(this)}
        ></FriendScice>
        <PayScice
          cityCode={cityCode}
          list={playerList}
          userInfo={configUserLevelInfo}
          type={"share"}
          onChange={this.onchangeInfo.bind(this)}
        ></PayScice>
        <ShareFriend
          close={() => this.setState({ visible: false })}
          visible={visible}
        ></ShareFriend>
      </View>
    );
  }
}
export default Index;
