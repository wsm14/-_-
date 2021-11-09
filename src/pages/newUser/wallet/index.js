import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { toast, backgroundObj } from "@/common/utils";
import { getUserBeanInfo } from "@/server/user";
import { navigateTo } from "../../../common/utils";
import { fetchUserShareCommission } from "@/server/index";
import Toast from "@/components/dakale_toast";

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userInfo: {},
      visible: false,
      configUserLevelInfo: {},
    };
  }

  componentDidShow() {
    this.getUserInfo();
    this.fetchUserShareCommission();
  }

  getUserInfo() {
    getUserBeanInfo({}, (res) => {
      const { userInfo } = res;
      this.setState({
        userInfo,
      });
    });
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  tishiDom() {
    return (
      <View className="point_box">
        <View className="point_title">奖励卡豆</View>
        <View className="point_center">
          通过平台内的看分享、到店打卡、家人家店贡献，参加卡豆乐园项目以及平台补贴的卡豆为奖励卡豆，奖励卡豆不可提现。
        </View>
        <View className="point_title">收益卡豆</View>
        <View className="point_center">
          升级为哒人，通过带货获得的卡豆为收益卡豆，收益卡豆可提现。
        </View>
      </View>
    );
  }

  errorToast(e) {}
  render() {
    const {
      userInfo: { bean },
      visible,
      configUserLevelInfo: { level },
    } = this.state;
    return (
      <View className="page_wallet">
        <View className="page_noUserLever">
          <View className="page_userDetails">
            <View className="page_userDetails_icon"></View>
            <View className="page_userDetails_title font28 color1">
              卡豆余额
            </View>
            <View className="page_userDetails_bean color1 bold">{bean}</View>
          </View>
          <View
            className="page_link_go public_center"
            onClick={() => navigateTo("/pages/newUser/rewardDetails/index")}
          >
            <View className="font24 color4"> 查看明细</View>
            <View className="page_link_icon"></View>
          </View>
        </View>
        <View className="page_bottom_font color2 font24">
          哒卡乐支付安全保障中
        </View>
        {visible && (
          <Toast
            title={"卡豆规则"}
            Components={this.tishiDom.bind(this)}
            close={() => this.setState({ visible: false })}
          ></Toast>
        )}
      </View>
    );
  }
}

export default Index;
