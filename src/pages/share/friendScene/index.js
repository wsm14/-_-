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
        path: `/pages/index/home/index?shareUserId=${userIdString}&shareUserType=user`,
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
              Taro.pageScrollTo({
                scrollTop: 0,
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
                活动期间，用户可进入88狂欢一专区，进行邀请好友注册，获得奖励卡豆活动。用户将个人邀请码或本活动页面转发给好友，好友通过邀请码或分享的活动页面注册成功后，即算作邀请成功。邀请好友注册人数越多，获得的奖励卡豆越多，每日最高可获得3000奖励卡豆；
              </View>
              <View>3、 88狂欢一活动每日0点自动刷新每日任务；</View>
              <View>
                4、
                当日完成邀请好友注册活动达到指标后，活动奖励将于次日0点自动发放至“我的一我的钱包”中，具体卡豆使用规则及有效期详见卡豆钱包中卡豆规则；
              </View>
              <View>
                5、
                用户参与活动所获卡豆为平台的奖励卡豆，奖励卡豆可作为用户购买具体订单时的消费抵扣，抵扣比例根据用户平台等级高低决定，普通用户可抵扣50%，一星哒人可抵扣60%，等级越高，卡豆可抵扣比例越高，奖励卡豆无法提现；
              </View>
              <View>
                6、
                同一哒卡乐账户、微信账户、身份证、手机号、手机设备，符合以上任一条件，均视为同一用户，同一用户每日仅限参与一次邀请好友注册得奖励卡豆活动。
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
