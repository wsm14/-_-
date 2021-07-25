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
import { fetchUserShareCommission } from "@/server/index";
import { fetchInActivityChildUser } from "@/server/share";
import Top from "./components/top";
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
      configUserLevelInfo: {},
      visible: false,
    };
  }
  componentDidMount() {
    this.fetchUserShare();
  }
  componentDidShow() {
    this.fetchInActivityChildUser();
  }
  fetchInActivityChildUser() {
    fetchInActivityChildUser({ activityType: "88activity" }).then((val) => {
      console.log(res);
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
    const { configUserLevelInfo, visible } = this.state;
    console.log(configUserLevelInfo);
    return (
      <View className="friendScene_box">
        <Top
          onShare={() => this.setState({ visible: true })}
          configUserLevelInfo={configUserLevelInfo}
        ></Top>
        <View className="friendScene_ceil_margin"></View>
        <Center></Center>
        <FriendScice></FriendScice>
        <PayScice></PayScice>
        <ShareFriend
          close={() => this.setState({ visible: false })}
          visible={visible}
        ></ShareFriend>
      </View>
    );
  }
}
export default Index;
