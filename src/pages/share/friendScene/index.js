import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView, ScrollView } from "@tarojs/components";
import { inject, observer } from "mobx-react";
import {
  getRestapiAddress,
  fetchBeanBarrage,
  getRootAndParent,
} from "@/server/common";
import {
  resiApiKey,
  toast,
  getLat,
  getLnt,
  loginStatus,
  computedLimit,
} from "@/common/utils";
import { fetchUserShareCommission } from "@/server/index";
import { fetchInActivityChildUser } from "@/server/share";
import { getMainPage, getLevel, getBeanDetailByUserId } from "@/server/user";
import Top from "./components/top";
import Toast from "@/components/dakale_toast";
import Center from "@/components/componentView/active/importScice";
import FriendScice from "@/components/componentView/active/friendScice";
import PayScice from "@/components/componentView/active/payScice";
import ShareFriend from "@/components/componentView/active/shareView";
import BeanToast from "@/components/componentView/active/beanToast";
import Router from "@/common/router";
import { fetchListActivityGoods } from "@/server/share";
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
      visible: false,
      userInfo: {},
      userList: [],
      keyValueList: [],
      ruleVisible: false,
      beanDetailList: [],
      specailList: [],
      playerList: [],
      goodsList: [],
      changeInfo: {},
      changeVisible: false,
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
    this.fetchBeanDetailByUserId();
    this.fetchInActivityChildUser();
  }
  setRuleVisible(val) {
    this.setState({
      ruleVisible: val,
    });
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
  fetchUserDetails() {
    getMainPage({}, (res) => {
      const { userInfo } = res;
      this.setState({
        userInfo: userInfo,
      });
    });
  }
  fetchBeanDetailByUserId() {
    getBeanDetailByUserId(
      {
        beanType: "platformSubsidy",
        detailType: "add",
        limit: 999,
        page: 1,
      },
      (res) => {
        const { beanDetailList = [] } = res;
        this.setState({
          beanDetailList,
        });
      }
    );
  }
  fetchInActivityChildUser() {
    fetchInActivityChildUser({ activityType: "88activity" }).then((val) => {
      const { userList } = val;
      this.setState({
        userList: userList.slice(0, 5),
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
  onchangeInfo(item) {
    const { configUserLevelInfo, userInfo } = this.state;
    const { payBeanCommission } = configUserLevelInfo;
    const { bean } = userInfo;
    const { goodsIdString, ownerIdString, realPrice } = item;
    if (realPrice * payBeanCommission > bean) {
      this.setState({
        changeVisible: true,
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
  render() {
    const {
      configUserLevelInfo,
      visible,
      ruleVisible,
      userInfo,
      userList,
      beanDetailList,
      goodsList,
      specailList,
      playerList,
      cityCode,
      changeVisible,
    } = this.state;
    return (
      <View className="friendScene_box">
        <View
          className="active_Rule"
          onClick={() => this.setRuleVisible(true)}
        ></View>
        <BeanToast
          onClose={() => {
            this.setState({ changeVisible: false });
          }}
          onLink={() => {
            this.setState({ changeVisible: false }, (res) => {
              Router({
                routerName: "friendScene",
                args: { cityCode },
              });
            });
          }}
          onChange={() => {
            this.setState({ changeVisible: false }, (res) => {
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
          show={changeVisible}
        ></BeanToast>
        <Top
          data={userList}
          userInfo={userInfo}
          beanDetailList={beanDetailList}
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
                2、
                活动期间，每位用户可在“带货卡豆膨胀金”模块中进行权益商品分享任务，每分享一份权益商品好友购买，即算作完成一次卡豆膨胀金任务，分享出去的商品好友购买的越多，获得卡豆膨胀金的金额越高；
              </View>
              <View>
                3、当日完成带货卡豆膨胀金任务后，即可领取膨胀卡豆金，领取后卡豆将自动流入“我的—我的钱包”中，用户可点击“我的钱包”查看卡豆到账情况，具体卡豆使用规则及有效期详见卡豆钱包中卡豆规则；
              </View>
              <View>
                4、
                本活动每日不限活动次数，可多次参加，若出现已分享好友购买数量超出任务指标，用户没有主动领取奖励，主动领取相对应奖励后，超出的好友购买次数不计入下一次活动任务指标中；
              </View>
              <View>
                5、
                带获卡豆膨胀金活动中分享的商品仅限活动页面展示的商品计入任务指标统计，其余分享好友购买商品不计入活动任务指标统计。
              </View>
            </ScrollView>
          </Toast>
        )}
        <View className="friendScene_ceil_margin"></View>
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
        <ShareFriend
          close={() => this.setState({ visible: false })}
          visible={visible}
        ></ShareFriend>
      </View>
    );
  }
}
export default Index;
