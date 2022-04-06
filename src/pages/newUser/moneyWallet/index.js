import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import { getUserBeanInfo } from "@/server/user";
import Toast from "@/components/toast";
import router from "@/utils/router";
import "./index.scss";
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
  }
  getUserInfo() {
    getUserBeanInfo({}, (res) => {
      const { userInfo } = res;
      this.setState({
        userInfo,
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
    } = this.state;
    return (
      <View className="money_wallet">
        <View className="money_noUserLever">
          <View className="money_userDetails">
            <View className="money_userDetails_title font28 color1">
              账户余额(元)
            </View>
            <View className="money_userDetails_bean color1 bold">{bean}</View>
          </View>
          <View
            className="money_link_go public_center"
            onClick={() => router({ routerName: "rewardDetails" })}
          >
            <View className="font24 color4"> 查看明细</View>
            <View className="money_link_icon"></View>
          </View>
          <View className="money_details">
            <View
              className="money_userDetails_icon"
              onClick={() => this.setState({ visible: true })}
            ></View>
            <View className="money_details_box">
              <View className="money_details_title">哒人收益</View>
              <View className="money_details_money">120.00</View>
              <View className="money_details_btn public_center">提现</View>
            </View>
            <View className="money_details_box">
              <View className="money_details_title">拼团返佣</View>
              <View className="money_details_money">120.00</View>
              <View className="money_details_btn public_center">提现</View>
            </View>
          </View>
        </View>

        <View className="money_bottom_font color2 font24">
          哒卡乐支付安全保障中
        </View>
        {visible && (
          <Toast
            title={"卡豆规则"}
            close={() => this.setState({ visible: false })}
          >
            <View className="money_desc_text">
              卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则卡豆规则
            </View>
          </Toast>
        )}
      </View>
    );
  }
}

export default Index;
