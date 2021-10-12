import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { toast, loginStatus, backgroundObj, fakeStorage } from "@/common/utils";
import { fetchListBlindBoxReward } from "@/server/blindBox";
import classNames from "classnames";
import Router from "@/common/router";
import "./index.scss";

class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {
      blindBoxRewardList: [],
      httpData: {
        page: 1,
        limit: 10,
      },
    };
  }
  componentDidMount() {
    this.getList();
  }
  getList() {
    const { httpData } = this.state;
    fetchListBlindBoxReward(httpData).then((val) => {
      const { blindBoxRewardList } = val;
      this.setState({
        blindBoxRewardList: [
          ...this.state.blindBoxRewardList,
          ...blindBoxRewardList,
        ],
      });
    });
  }
  onReachBottom() {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: {
          ...httpData,
          page: httpData.page + 1,
        },
      },
      (res) => {
        this.getList();
      }
    );
  } //上拉加载
  render() {
    const { blindBoxRewardList } = this.state;
    const template = (item = {}) => {
      const { contentParam, blindBoxRewardId } = item;
      const data = JSON.parse(contentParam);
      const { showName, prize, deliveryTime, logisticsStatus, prizeImg } = data;
      const filterObj = {
        0: "待完善收货信息",
        1: "待发货",
        2: "已发货",
      }[logisticsStatus];
      return (
        <View
          onClick={() => {
            Router({
              routerName: "blindPrizeDetail",
              args: { blindBoxRewardId },
            });
          }}
          className="prize_template"
        >
          <View className="prize_template_img">
            <Image
              src={prizeImg}
              mode="aspectFill"
              className="prize_template_image"
            ></Image>
          </View>
          <View className="prize_template_content">
            <View className="prize_template_name">{showName}</View>
            <View className="prize_template_count">数量：{prize}</View>
            <View className="prize_template_time">{deliveryTime}</View>
          </View>
          <View
            className={classNames(
              "prize_template_right",
              logisticsStatus === "0" ? "color3" : "color2"
            )}
          >
            {filterObj}
          </View>
          <View
            className="prize_template_btn public_center"
            onClick={() =>
              Router({
                routerName: "blindPrizeDetail",
                args: { blindBoxRewardId },
              })
            }
          >
            查看详情
          </View>
        </View>
      );
    };
    return (
      <View className="prize_box">
        {blindBoxRewardList.map((item) => {
          return template(item);
        })}
      </View>
    );
  }
}
export default Index;
