import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import classNames from "classnames";
import { View } from "@tarojs/components";
import { getCouponList, fetchListUserPlatformCoupon } from "@/server/coupon";
import Tabs from "@/components/tabs";
import CouponStatus from "./components/couponStatus";
import SelectTab from "./components/couponSelect";
import Empty from "@/components/Empty";
import TemplateInfo from "./components/couponFree";
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
      tabStatus: getCurrentInstance().router.params.tabStatus || "merchant",
      setting: {
        tabList: ["可使用", "即将过期", "已使用", "已过期"],
        current: 0,
      },
      userPlatformCouponList: [],
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
  getListUser() {
    const {
      setting: { current },
    } = this.state;
    fetchListUserPlatformCoupon({ couponStatus: String(shine(current)) }).then(
      (val) => {
        const { userPlatformCouponList = [] } = val;
        this.setState({
          userPlatformCouponList,
        });
      }
    );
  }
  onChangeSelect(val) {
    if (val === "merchant") {
      this.setState(
        {
          tabStatus: "merchant",
        },
        (res) => {
          this.getCouponList();
        }
      );
    } else {
      this.setState(
        {
          tabStatus: "platform",
        },
        (res) => {
          this.getListUser();
        }
      );
    }
  }
  setIndex(index) {
    const {
      setting: { current },
      tabStatus,
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
          userPlatformCouponList: [],
        },
        (res) => {
          if (tabStatus === "merchant") {
            this.getCouponList();
          } else {
            this.getListUser();
          }
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
    const { tabStatus } = this.state;
    if (tabStatus === "merchant") {
      this.getCouponList();
    } else {
      this.getListUser();
    }
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
      top: Taro.pxTransform(88),
      left: 0,
      right: 0,
      zIndex: 100,
    };
    const {
      nearUseList,
      otherUseList,
      setting,
      setting: { current },
      tabStatus,
      userPlatformCouponList,
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
    const renderTemplate = () => {
      return (
        <>
          {userPlatformCouponList.map((item) => {
            return <TemplateInfo status={current} data={item}></TemplateInfo>;
          })}
        </>
      );
    };
    return (
      <View className="wraparound_box">
        <SelectTab
          onChange={this.onChangeSelect.bind(this)}
          list={[
            {
              label: "商品券",
              value: "merchant",
            },
            {
              label: "优惠券",
              value: "platform",
            },
          ]}
          val={tabStatus}
        ></SelectTab>
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
          {tabStatus === "merchant" ? status : renderTemplate()}
          {!nearUseList.length && !otherUseList.length && (
            <Empty
              show={
                tabStatus === "merchant"
                  ? [...nearUseList, ...otherUseList].length === 0
                  : userPlatformCouponList.length === 0
              }
              toast={"没有当前状态的卡券哦~"}
              type={"coupon"}
            ></Empty>
          )}
        </View>
      </View>
    );
  }
}

export default Index;
