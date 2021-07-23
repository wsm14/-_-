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
import { resiApiKey, toast, getLat, getLnt } from "@/common/utils";
import Top from "./components/mainSceneTop";
import Center from "@/components/componentView/active/importScice";
import FriendScice from "@/components/componentView/active/friendScice";
import PayScice from "@/components/componentView/active/payScice";
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
  render() {
    const { city } = this.state;
    const { locationStore } = this.props.store;
    const { cityName, flag, locationStatus, cityCode } = locationStore;
    console.log(cityName, flag);
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
  }
}
export default Index;
