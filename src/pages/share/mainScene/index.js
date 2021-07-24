import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import {
  getAuthStatus,
  scanCard,
  authUpdateGeography,
} from "@/common/authority";
import { inject, observer } from "mobx-react";
import { getRestapiAddress } from "@/server/common";
import { resiApiKey, toast, getLat, getLnt, loginStatus } from "@/common/utils";
import Top from "./components/mainSceneTop";
import Center from "@/components/componentView/active/importScice";
import FriendScice from "@/components/componentView/active/friendScice";
import PayScice from "@/components/componentView/active/payScice";
import ShareFriend from "@/components/componentView/active/shareView";
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
    };
  }
  componentDidMount() {}
  componentDidShow() {}

  setCityName(lat, lnt) {
    getRestapiAddress(
      {
        key: resiApiKey,
        location: `${lat},${lnt}`,
      },
      (res) => {
        const { info, regeocode = {} } = res;
        if (info === "OK") {
          const { addressComponent = {} } = regeocode;
          const { city, adcode = "" } = addressComponent;
          this.setState({
            city: city.slice(0, 2),
            cityCode: adcode.slice(0, 4),
          });
        } else {
          toast("经纬度解析错误");
        }
      }
    );
  }
  setTabLocation() {
    const { cityCode } = this.state;
    if (cityCode === "3301") {
      this.setState({
        city: "湘西",
        cityCode: "4331",
      });
    } else {
      this.setState({
        city: "杭州",
        cityCode: "3301",
      });
    }
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
    const { city } = this.state;
    const { locationStore } = this.props.store;
    const { cityName, flag, locationStatus, cityCode } = locationStore;
    const { activeInfoStore = {} } = this.props.store;
    const { activityStatus, needCountDown, dayCount } = activeInfoStore;
    if (needCountDown !== "1") {
      return (
        <View className="mainScene_box">
          <Top
            store={locationStore}
            locationStatus={locationStatus}
            city={city}
            cityCode={cityCode}
            setTab={this.setTabLocation.bind(this)}
            setLocation={this.setCityName.bind(this)}
          ></Top>
          <Center></Center>
          <FriendScice></FriendScice>
          <PayScice></PayScice>
        </View>
      );
    } else {
      return (
        <View className="mainScene_box">
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
            <View className="mainScene_box_card">
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
            </View>
          </View>
          <View className="mainScene_logo_box">
            <View className="mainScene_card_logo"></View>
          </View>
        </View>
      );
    }
  }
}
export default Index;
