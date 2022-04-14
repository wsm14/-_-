import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import { fetchMarketingCash } from "@/server/user";
import Toast from "@/components/toast";
import router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userBean: {},
      visible: false,
      configUserLevelInfo: {},
    };
  }
  componentDidShow() {
    this.fetchMarketingCash();
  }
  fetchMarketingCash() {
    fetchMarketingCash({}, (res) => {
      console.log(res);
      const { userBean } = res;
      this.setState({
        userBean,
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
      userBean: { togetherCash = 0, totalCash = 0, incomeCash = 0 },
      visible,
    } = this.state;
    return (
      <View className="money_wallet">
        <View className="money_noUserLever">
          <View className="money_userDetails">
            <View className="money_userDetails_title font28 color1">
              账户余额(元)
            </View>
            <View className="money_userDetails_bean color1 bold">
              {totalCash}
            </View>
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
              <View className="money_details_money">{incomeCash}</View>
              <View
                className="money_details_btn public_center"
                onClick={() => {
                  router({ routerName: "download" });
                }}
              >
                提现
              </View>
            </View>
            <View className="money_details_box">
              <View className="money_details_title">拼团返佣</View>
              <View className="money_details_money">{togetherCash}</View>
              <View
                className="money_details_btn public_center"
                onClick={() => {
                  router({ routerName: "download" });
                }}
              >
                提现
              </View>
            </View>
          </View>
        </View>

        <View className="money_bottom_font color2 font24">
          哒卡乐支付安全保障中
        </View>
        {visible && (
          <Toast
            title={" 钱包说明"}
            close={() => this.setState({ visible: false })}
          >
            <View className="money_desc_text">
              <View className="color1 bold">1.哒人收益</View>
              <View className="color2">
                解锁哒人之后在平台进行商品分享所赚取的收益为哒人收益；
              </View>
              <View style={{ marginTop: "12px" }} className="color1">
                2.拼团返佣
              </View>
              <View className="color2 bold">
                通过开团且开团成功之后获得的参与红包、开团返佣的收益为拼团返佣。
              </View>
            </View>
          </Toast>
        )}
      </View>
    );
  }
}

export default Index;
