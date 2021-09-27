import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import "./index.scss";
import { getUserCoupon } from "@/server/perimeter";
import { coupon } from "@/components/componentView/CouponView";
import { toast } from "@/common/utils";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
        page: 1,
        limit: 10,
      },
      countStatus: true,
      index: 0,
      couponList: [],
    };
  }
  getUserCoupon() {
    const { httpData } = this.state;
    getUserCoupon(httpData, (res) => {
      const { couponList = [] } = res;
      if (couponList.length !== 0) {
        this.setState({
          couponList: [...this.state.couponList, ...couponList],
          index: 1,
        });
      } else {
        this.setState({
          countStatus: false,
        });
      }
    });
  }
  componentDidShow() {
    const { index } = this.state;
    if (index === 0) {
      this.getUserCoupon();
    }
  }
  onReachBottom() {
    const { httpData, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: {
            ...httpData,
            page: httpData.page + 1,
          },
        },
        (res) => {
          this.getUserCoupon();
        }
      );
    } else {
    }
  } //上拉加载
  render() {
    const { couponList } = this.state;
    return (
      <View className="couponList_box">
        {couponList.map((item) => {
          return coupon(item);
        })}
      </View>
    );
  }
}

export default Index;
