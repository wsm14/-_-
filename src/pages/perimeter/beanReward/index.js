import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import BodyView from "./components/beanList";
import Toast from "@/components/toast";
import {
  getUserWatchMomentEarn,
  getListWatchMomentBeanDetail,
} from "@/server/index";
import { toast } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
class businessSell extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      visible: false,
      watchMomentTodayEarn: 0,
      watchMomentAccumulateEarn: 0,
      beanDetailList: [],
      countStatus: true,
      httpData: {
        page: 1,
        limit: 10,
      },
    };
  }

  componentDidShow() {
    if (this.state.beanDetailList.length === 0) {
      this.getListWatchMomentBeanDetail();
    }
    this.getUserWatch();
  }
  getUserWatch() {
    getUserWatchMomentEarn({}, (res) => {
      const { watchMomentTodayEarn, watchMomentAccumulateEarn } = res;
      this.setState({
        watchMomentTodayEarn,
        watchMomentAccumulateEarn,
      });
    });
  }
  getListWatchMomentBeanDetail() {
    getListWatchMomentBeanDetail(this.state.httpData, (res) => {
      const { beanDetailList = [] } = res;
      if (beanDetailList.length > 0) {
        this.setState({
          beanDetailList: [...this.state.beanDetailList, ...beanDetailList],
        });
      } else {
        this.setState({
          countStatus: false,
        });
      }
    });
  }
  onReachBottom() {
    const { countStatus, httpData } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: { ...httpData, page: httpData.page + 1 },
        },
        (res) => {
          this.getListWatchMomentBeanDetail();
        }
      );
    } else {
      toast("暂无更多");
    }
  }

  render() {
    const {
      visible,
      watchMomentTodayEarn,
      watchMomentAccumulateEarn,
      beanDetailList,
    } = this.state;
    return (
      <View className="beanReward_box">
        <View
          style={{ background: "#f2f2f2", paddingTop: Taro.pxTransform(32) }}
        >
          <View className="beanReward_card">
            <View className="beanReward_cardBox">
              <View className="beanReward_titleBox">
                <View
                  className="beanReward_title_left"
                  onClick={() => this.setState({ visible: true })}
                >
                  今日领取看分享奖励
                </View>
                <View
                  className="beanReward_title_right"
                  onClick={() =>
                    Router({
                      routerName: "wallet",
                    })
                  }
                >
                  卡豆账户
                </View>
              </View>
              <View className="beanReward_num">{watchMomentTodayEarn}</View>
              <View className="beanReward_beanBox">
                <View className="beanReward_bean_left">累计领取卡豆奖励</View>
                <View className="beanReward_bean_right">
                  {watchMomentAccumulateEarn}
                </View>
              </View>
            </View>
            <View className="beanReward_body">
              <View className="beanReward_body_title">奖励明细</View>
              <View className="beanReward_body_toast">
                因数据刷新影响，卡豆到账可能会延迟
              </View>
            </View>
          </View>
        </View>
        <BodyView data={beanDetailList}></BodyView>
        {visible && (
          <Toast
            close={() => this.setState({ visible: false })}
            width={600}
            title={"奖励说明"}
          >
            <View className="beanReward_toast">
              1、观看完整的视频/图文才可获得卡豆奖励，同一个分享每天可领取一次卡豆励。
            </View>
            <View className="beanReward_toast">
              2、获得的卡豆奖励可在【我的-卡豆账户】中查看。
            </View>
            <View className="beanReward_toast">
              3、卡豆奖励不可提现，但是可以进行消费抵扣，如到店扫码消费抵扣、线上购买商家特惠活动商品抵扣等。
            </View>
            <View className="beanReward_toast">
              4、每人每天最多可领取卡豆奖励上限值为500卡豆。
            </View>
            <View className="beanReward_toast">
              5、卡豆奖励最终解释权归哒卡乐所有。
            </View>
          </Toast>
        )}
      </View>
    );
  }
}

export default businessSell;
