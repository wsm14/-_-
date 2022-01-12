import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { filterGoods, objStatus } from "@/utils/utils";
import { inject, observer } from "mobx-react";
import PaySuccess from "./components/template/payTemplate";
import ScanSuccess from "./components/template/scanTemplate";
import { fetchOrderResult } from "@/server/goods";
import { getConfigNewcomerOrders } from "@/server/index";
import { fetchUserShareCommission } from "@/server/common";
import { fetchOrderLinkCoupon } from "@/server/coupon";
import Toast from "./components/uiComponents/paySuccess";
import RecommendCoupon from "@/components/public_ui/couponActive";
import RecommendSpecal from "@/components/public_ui/specalActive";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: { ...getCurrentInstance().router.params },
      orderResult: {},
      visible: false,
      configNewcomerOrdersInfo: {},
      configUserLevelInfo: {},
      userPlatformCouponInfo: {},
    };
  }
  componentDidMount() {
    this.getOrderResult();
    this.fetchUserShareCommission();
    this.fetchConfigNewcomerOrders();
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  fetchOrderLinkCoupon() {
    fetchOrderLinkCoupon().then((res) => {
      const { userPlatformCouponInfo = {} } = res;
      this.setState({
        userPlatformCouponInfo,
        visible: objStatus(userPlatformCouponInfo),
      });
    });
  }
  fetchConfigNewcomerOrders() {
    getConfigNewcomerOrders({}).then((res) => {
      const { configNewcomerOrdersInfo = {} } = res;
      const { taskStatus = "2" } = configNewcomerOrdersInfo;
      this.setState(
        {
          configNewcomerOrdersInfo: { ...configNewcomerOrdersInfo, taskStatus },
        },
        (res) => {
          if (taskStatus === "0" || taskStatus === "1") {
            this.setState({ visible: true });
          } else {
            this.fetchOrderLinkCoupon();
          }
        }
      );
    });
  }
  getOrderResult() {
    const { httpData } = this.state;
    fetchOrderResult(httpData).then((res) => {
      const { orderResult } = res;
      this.setState({
        orderResult: filterGoods(orderResult),
      });
    });
  }
  render() {
    const {
      orderResult,
      visible,
      configUserLevelInfo,
      configNewcomerOrdersInfo,
      userPlatformCouponInfo,
    } = this.state;
    const { orderType, frontViewType } = orderResult;
    const { beanLimit } = this.props.store.commonStore;

    const template = {
      verificationPay: (
        <>
          <PaySuccess
            fn={this.getOrderResult.bind(this)}
            data={orderResult}
            beanLimit={beanLimit}
          ></PaySuccess>
          {orderType === "specialGoods" ? (
            <RecommendSpecal
              current={true}
              userInfo={configUserLevelInfo}
            ></RecommendSpecal>
          ) : (
            <RecommendCoupon
              current={true}
              userInfo={configUserLevelInfo}
            ></RecommendCoupon>
          )}
          <Toast
            data={configNewcomerOrdersInfo}
            show={visible}
            orderResult={orderResult}
            userPlatformCouponInfo={userPlatformCouponInfo}
            visible={() => {
              this.setState({
                visible: false,
              });
            }}
          ></Toast>
        </>
      ),
      scanPay: (
        <>
          <ScanSuccess data={orderResult}></ScanSuccess>
          <RecommendSpecal
            current={true}
            userInfo={configUserLevelInfo}
          ></RecommendSpecal>
          <Toast
            data={configNewcomerOrdersInfo}
            show={visible}
            orderResult={orderResult}
            userPlatformCouponInfo={userPlatformCouponInfo}
            visible={() => {
              this.setState({
                visible: false,
              });
            }}
          ></Toast>
        </>
      ),
    }[frontViewType];
    if (template) {
      return template;
    } else {
      return null;
    }
  }
}

export default Index;
