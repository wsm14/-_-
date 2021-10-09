import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import { toast, loginStatus } from "@/common/utils";
import { fetchUserShareCommission } from "@/server/index";
import "./index.scss";
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidShow() {}
  render() {
    const {} = this.state;
    const templateView = {
      0: <View></View>,
    }[0];
    return (
      <View className="shareBox_box">
        <View className="shareBox_bg">
          <View className="shareBox_content">
            <View className="shareBox_content_box">
              <View className="shareBox_bg_blind"></View>
              <View className="shareBox_profile"></View>
              <View className="shareBox_fontInfo font_hide">
                来自 用户昵称 的邀请函
              </View>
              <View className="shareBox_fontMargin1 shareBox_font">
                我正在哒卡乐抽盲盒，仅差1次机会
              </View>
              <View className="shareBox_font">就可以最高抽中iPhone13啦，</View>
              <View className="shareBox_font">
                快来帮我助力，同时你也获得抽盲盒机会哦！
              </View>
              <View className="shareBox_desc">TA已获得1次免费拆盲盒机会</View>
              <View className="shareBox_liner"></View>
              <View className="shareBox_btn_box public_auto">
                <View className="shareBox_btn public_center">为TA助力</View>
                <View className="shareBox_btn public_center">我也要拆盲盒</View>
              </View>
              <View className="shareBox_share_profileBox">
                <View className="shareBox_share_profile shareBox_share_proStyle2"></View>
                <View className="shareBox_share_profile shareBox_share_proStyle2"></View>
                <View className="shareBox_share_profile shareBox_share_proStyle2"></View>
                <View className="shareBox_share_profile shareBox_share_proStyle2"></View>
                <View className="shareBox_share_profile shareBox_share_proStyle2"></View>
                <View className="shareBox_share_profile shareBox_share_proStyle2"></View>
              </View>
            </View>
          </View>
          <View className="shareBox_bg_left"></View>
          <View className="shareBox_toast_title">温馨提示</View>
          <View className="shareBox_toast_font">
            1. 每个好友每天仅可助力一次哦
          </View>
          <View className="shareBox_toast_font">
            2. 每三个人助力成功，好友即可获得一次免费盲盒机会
          </View>
          <View className="shareBox_toast_font">3. 待补充</View>
        </View>
      </View>
    );
  }
}
export default Index;
