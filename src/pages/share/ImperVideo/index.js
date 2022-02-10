import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Ad } from "@tarojs/components";
import { toast } from "@/utils/utils";
import { fakeImperMomentReward } from "@/server/share";
import Bean from "./components/beanToast";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      visible: false,
      giveBeanNum: 0,
    };
    this.rewardedVideoAd = null;
  }
  componentDidMount() {
    this.createrRewardedVideoAd();
  }
  saveImper() {
    fakeImperMomentReward({}).then((val) => {
      const { giveBeanNum = 0 } = val;
      this.setState(
        {
          giveBeanNum,
        },
        (res) => {
          this.setState({
            visible: true,
          });
        }
      );
    });
  }
  createrRewardedVideoAd() {
    if (Taro.createRewardedVideoAd) {
      this.rewardedVideoAd = Taro.createRewardedVideoAd({
        adUnitId: "adunit-553335e2a0b581b2",
      });
      // Taro.showLoading({
      //   title: "页面初始化",
      // });
      this.rewardedVideoAd.onLoad(() => {
        // Taro.hideLoading();
      });
      this.rewardedVideoAd.onError((err) => {
        // Taro.hideLoading();
        toast("暂无更多视频，请稍后再试");
      });
      this.rewardedVideoAd.onClose((err) => {
        // Taro.hideLoading();
        console.log(err);
        const { isEnded } = err;
        if (isEnded) {
          this.saveImper();
        } else {
          toast("看完整视频可领取卡豆奖励");
        }
      });
    }
  }
  render() {
    const { visible, giveBeanNum } = this.state;
    return (
      <View className="ImperVideo_box">
        <View
          className="ImperVideo_btn_box"
          onClick={() => {
            this.rewardedVideoAd.show();
          }}
        ></View>
        <Bean
          show={visible}
          bean={giveBeanNum}
          visible={() => {
            this.setState({
              visible: false,
            });
          }}
        ></Bean>
        <View class="adContainer">
          <Ad adIntervals={30} unitId="adunit-3cb2f1a43dd2cf9e"></Ad>
        </View>
      </View>
    );
  }
}
export default Index;
