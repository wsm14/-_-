import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { rssConfigData } from "./components/data";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import ButtonView from "@/components/Button";
import {
  loginStatus,
  mapGo,
  navigateTo,
  reLaunch,
  backgroundObj,
  toast,
} from "@/common/utils";
import { getWechatActivityData } from "@/server/share";
import Waterfall from "@/components/waterfall";
import { fetchUserShareCommission } from "@/server/index";
import "./index.scss";
import Router from "@/common/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cavansObj: {
        data: null,
        start: false,
      },
      visible: false,
    };
  }
  componentWillMount() {}

  getShareInfo() {
    const { profile, username } = Taro.getStorageSync("userInfo") || {};
    getShareInfo(
      {
        shareType: "activity",
        subType: "88activityQianxuan",
      },
      (res) => {
        const { qcodeUrl, frontImage } = res;
        this.setState({
          cavansObj: {
            start: true,
            data: rssConfigData({
              background: frontImage,
              qcodeUrl,
            }),
          },
        });
      }
    );
  }
  setClipboard(val) {
    Taro.setClipboardData({
      data: val,
      success: function (res) {
        toast("复制成功");
      },
      fail: function (res) {
        toast("复制失败");
      },
    });
  }
  onShareAppMessage(res) {
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;

    if (res.from === "button") {
      return {
        title: "达人招募令",
        path: `/pages/share/invitation/index?shareUserId=${userIdString}&shareUserType=user`,
      };
    }
  }

  render() {
    const { cavansObj, visible } = this.state;

    return (
      <View className="hotActive_box">
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("点击保存")}
          onClose={() =>
            this.setState({ cavansObj: { start: false, data: null } })
          }
        ></TaroShareDrawer>
        <View className="kolActive_box">
          <View className="kolActive_img1">
            <Image
              className="kolActive_imgStyle"
              src="https://web-new.dakale.net/public/image/8.8kolActive/8.8kolActive_1.png"
            ></Image>
          </View>
          <View className="kolActive_img2">
            <Image
              className="kolActive_imgStyle"
              src="https://web-new.dakale.net/public/image/8.8kolActive/8.8kolActive_2.png"
            ></Image>
          </View>
          <View className="kolActive_img3">
            <View
              className="kolActive_imgCoby"
              onClick={() => {
                this.setClipboard("Li13842079207");
              }}
            ></View>
            <Image
              className="kolActive_imgStyle"
              src="https://web-new.dakale.net/public/image/8.8kolActive/8.8kolActive_3.png"
            ></Image>
          </View>
          <View className="kolActive_img4" onClick={() => this.getShareInfo()}>
            <Image
              className="kolActive_imgStyle"
              src="https://web-new.dakale.net/public/image/8.8kolActive/8.8kolActive_4.png"
            ></Image>
          </View>

          {visible && (
            <View
              catchMove
              className="kolActive_rule_box"
              onClick={() => {
                this.setState({ visible: false });
              }}
            >
              <View
                className="kolActive_rule_info"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <View className="kolActive_rule_infoTitle">
                  活动细则
                  <View
                    className="kolActive_rule_close"
                    onClick={() => {
                      this.setState({ visible: false });
                    }}
                  >
                    确定
                  </View>
                </View>
                <View className="kolActive_rule_liner"></View>
                <ScrollView scrollY className="kolActive_rule_details">
                  <View className="kolActive_rule_bold">
                    <View>
                      {" "}
                      1、本活动平台所有哒人均可参加，【未解锁】哒人等级的用户可在哒卡乐APP或微信小程序【我的】中解锁哒人。{" "}
                    </View>
                    <View>
                      {" "}
                      2、活动期间（07.23-08.07）哒人分享订单金额核算规则：{" "}
                    </View>
                  </View>
                  <View>
                    （1）哒人的分享订单金额以有效核销的订单金额为准。{" "}
                  </View>
                  <View>
                    （2）消费者在消费过程中和商家产生争执需退款等情况，不计入有效奖励数据。{" "}
                  </View>
                  <View className="kolActive_rule_bold">3、活动奖励</View>

                  <View>（1）同一自然人，仅能领取一次招募令活动奖励。</View>
                  <View>
                    {" "}
                    （2）此活动周期为15天，活动奖励以最高等级发放，活动奖励不叠加。（例：一位哒人的最终订单金额在300-500元，则此哒人的活动奖励为价值88元的卡豆红包。）{" "}
                  </View>
                  <View className="kolActive_rule_bold">
                    <View>
                      {" "}
                      4、奖励发放时间：活动结束后七天内由平台统一审核发放奖励（平台审核需1-2天）{" "}
                    </View>
                    <View>
                      {" "}
                      5、如果存在作弊刷单、扰乱平台秩序等行为，平台有权不予发放/收回奖励。{" "}
                    </View>
                    <View> 6、邀约好友得现金规则： </View>
                  </View>
                  <View>（1）邀请1位好友成为哒卡乐平台哒人。 </View>
                  <View>（2）被邀请人分享/自购订单金额达到300元。 </View>
                  <View>（3）被邀请人分享核销商品数量≥3单。 </View>
                  <View>（4）每邀请1位好友成为哒人且完成 </View>
                  <View> 7、您有任何疑问，可添加官方客服微信。 </View>
                  <View>
                    {" "}
                    8、本活动最终解释权归杭州哒卡乐智能科技有限公司所有。{" "}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          <View
            className="kolActive_rule"
            onClick={() => {
              this.setState({
                visible: true,
              });
            }}
          ></View>
        </View>
      </View>
    );
  }
}

export default Index;
