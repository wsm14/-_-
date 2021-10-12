import React, { PureComponent } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { View } from "@tarojs/components";
import { getCouponList } from "@/server/coupon";
import Tabs from "@/components/tabs";
import CouponStatus from "./components/couponStatus";
import NullStatus from "./components/nullStatus";
import "./index.scss";
const shine = (index) => {
  switch (index) {
    case 0:
      return "0";
    case 1:
      return "3";
    case 2:
      return "2";
    case 3:
      return "1";
    default:
      return index;
  }
};
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      nearUseList: [],
      otherUseList: [],
      setting: {
        tabList: ["可使用", "即将过期", "已使用", "已过期"],
        current: 0,
      },
    };
  }

  getCouponList() {
    const {
      setting: { current },
    } = this.state;
    getCouponList(
      {
        couponStatus: String(shine(current)),
      },
      (res) => {
        const { nearUseList = [], otherUseList = [] } = res;
        Taro.stopPullDownRefresh();
        this.setState({
          nearUseList: [...nearUseList],
          otherUseList: [...otherUseList],
        });
      }
    ).catch((e) => {
      Taro.stopPullDownRefresh();
    });
  }

  setIndex(index) {
    const {
      setting: { current },
    } = this.state;
    if (index != current) {
      this.setState(
        {
          setting: {
            ...this.state.setting,
            current: index,
          },
          nearUseList: [],
          otherUseList: [],
        },
        (res) => {
          this.getCouponList();
        }
      );
    }
    return;
  }
  onPullDownRefresh() {
    this.setState(
      {
        nearUseList: [],
        otherUseList: [],
      },
      (res) => {
        this.getCouponList();
      }
    );
  }
  componentDidShow() {
    this.getCouponList();
  }

  render() {
    const tabStyle = {
      height: Taro.pxTransform(96),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#FFFFFF",
      padding: `0 ${Taro.pxTransform(71)}`,
      position: "fixed",
      left: 0,
      right: 0,
      zIndex: 100,
    };
    const {
      nearUseList,
      otherUseList,
      setting,
      setting: { current },
    } = this.state;
    const status = {
      0: (
        <>
          {nearUseList.length > 0 && (
            <>
              <CouponStatus data={nearUseList} visible={false}></CouponStatus>
            </>
          )}
          {otherUseList.length > 0 && (
            <>
              <CouponStatus data={otherUseList}></CouponStatus>
            </>
          )}
        </>
      ),
      1: (
        <>
          {(otherUseList.length > 0 || nearUseList.length > 0) && (
            <CouponStatus
              data={[...nearUseList, ...otherUseList]}
            ></CouponStatus>
          )}
        </>
      ),
      2: (
        <>
          {(otherUseList.length > 0 || nearUseList.length > 0) && (
            <CouponStatus
              data={[...nearUseList, ...otherUseList]}
            ></CouponStatus>
          )}
        </>
      ),
      3: (
        <>
          {(otherUseList.length > 0 || nearUseList.length > 0) && (
            <CouponStatus
              data={[...nearUseList, ...otherUseList]}
            ></CouponStatus>
          )}
        </>
      ),
    }[current];
    return (
      <View className="wraparound_box">
        <Tabs
          fn={this.setIndex.bind(this)}
          style={tabStyle}
          lineStyle={{
            background: "#07C0C2",
            width: Taro.pxTransform(40),
            height: Taro.pxTransform(4),
            borderRadius: Taro.pxTransform(2),
          }}
          fontStyle={{ color: "#07C0C2", fontSize: Taro.pxTransform(32) }}
          sizeStyle={{ fontSize: Taro.pxTransform(32), color: "#999999" }}
          {...setting}
        ></Tabs>
        <View className="wraparound_content_box">
          {status}
          {!nearUseList.length && !otherUseList.length && (
            <NullStatus></NullStatus>
          )}
        </View>
      </View>
    );
  }
}

export default Index;
