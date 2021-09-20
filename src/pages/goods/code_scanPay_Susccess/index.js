import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import { getOrderResult } from "@/server/goods";
import {
  backgroundObj,
  goBack,
  toast,
  navigateTo,
  redirectTo,
  switchTab,
} from "@/common/utils";
import Router from "@/common/router";
import RecommendSpecal from "@/components/specalActive";
import { fetchUserShareCommission } from "@/server/index";
import Recommend from "@/components/specalActive";
import Coupon from "./components/coupon";
import Toast from "@/components/paySuccess";
import { getConfigNewcomerOrders } from "@/server/goods";
import { inject, observer } from "mobx-react";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      orderSn: getCurrentInstance().router.params.orderSn,
      orderResult: {},
      conpouVisible: false,
      couponList: [],
      configUserLevelInfo: {},
      visible: false,
      configNewcomerOrdersInfo: {},
    };
  }

  componentWillMount() {
    if (!getCurrentInstance().router.params.orderSn) {
      goBack(() => toast("参数缺失"));
    }
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  fetchConfigNewcomerOrders() {
    getConfigNewcomerOrders({}, (res) => {
      const { configNewcomerOrdersInfo = {} } = res;
      const { taskStatus = "2" } = configNewcomerOrdersInfo;
      this.setState(
        {
          configNewcomerOrdersInfo: { ...configNewcomerOrdersInfo, taskStatus },
        },
        (res) => {
          const { beanLimitStatus } = this.props.store.homeStore;
          if (
            taskStatus === "0" ||
            taskStatus === "1" ||
            beanLimitStatus === "1"
          ) {
            this.setState({ visible: true });
          }
        }
      );
    });
  }
  getOrderResult() {
    const { orderSn } = this.state;
    getOrderResult(
      {
        orderSn,
      },
      (res) => {
        const { orderResult } = res;
        this.setState({
          orderResult,
        });
      }
    );
  }

  componentDidShow() {
    this.getOrderResult();
    this.fetchUserShareCommission();
  }
  componentDidMount() {
    this.fetchConfigNewcomerOrders();
  }

  errorToast(e) {}

  render() {
    const formatTime = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      return (
        month +
        "月" +
        day +
        "日  " +
        [hour, minute, second].map(formatNumber).join(":")
      );
    };
    const formatNumber = (n) => {
      n = n.toString();
      return n[1] ? n : "0" + n;
    };
    const {
      orderResult: {
        payFee,
        payTitle,
        totalFee,
        beanFee,
        deductFeeObject = [],
        orderType,
        orderDesc,
      },
      orderResult,
      orderSn,
      conpouVisible,
      couponList,
      configUserLevelInfo,
      visible,
      configNewcomerOrdersInfo,
    } = this.state;
    const { beanLimitStatus } = this.props.store.homeStore;
    const { beanLimit } = this.props.store.commonStore;
    if (Object.keys(orderResult).length > 0) {
      return (
        <View className="code_scanPay_box">
          <View className="code_scanPay_top">
            <View className="code_scanPay_bg"></View>
            <View className="code_scanPay_payStatus font36">
              {formatTime(new Date())}
            </View>
            <View className="code_scanPay_payNum">
              <Text className="code_scanPay_icon  font36 bold color1">¥ </Text>
              <Text className="code_scanPay_font bold  color1">
                {" " + totalFee}
              </Text>
            </View>
            {orderType === "virtualProduct" && typeof orderDesc === "string" && (
              <View className="code_scanPay_decBox  code_scanPay_decMargin public_auto font24">
                <View className="color2">商品</View>
                <View className="color1">
                  {totalFee}元手机话费-
                  {JSON.parse(orderDesc).virtualProductAccount}
                </View>
              </View>
            )}
            <View className="code_scanPay_decBox  code_scanPay_decMargin1 public_auto font24">
              <View className="color2">实付金额</View>
              <View className="color1">{"¥  " + payFee}</View>
            </View>
            {beanFee ? (
              <View className="code_scanPay_decBox  code_scanPay_decMargin1 public_auto  font24">
                <View className="color2">卡豆优惠抵扣</View>
                <View className="color3">
                  - {beanFee + `(¥ ${(Number(beanFee) / 100).toFixed(2)})`}
                </View>
              </View>
            ) : null}

            {deductFeeObject.length > 0 ? (
              <View className="code_scanPay_decBox  code_scanPay_decMargin1 public_auto  font24">
                <View className="color2">优惠券</View>
                <View className="color3">- {deductFeeObject[0].reduceFee}</View>
              </View>
            ) : null}
            <View className="code_scanPay_liner"></View>

            <View className="code_scanPay_btnBox">
              <View
                className="code_scanPay_btn btn_style1"
                onClick={() =>
                  redirectTo(
                    `/pages/goods/getShopGoods/index?orderSn=${orderSn}`
                  )
                }
              >
                {" "}
                查看订单
              </View>
              <View
                className="code_scanPay_btn btn_style2"
                onClick={() =>
                  Router({
                    routerName: "nearVideo",
                    args: {
                      type: "goods",
                    },
                  })
                }
              >
                天天捡卡豆
                <View className="btn_logo"></View>
              </View>
            </View>
            {beanFee ? (
              <View className="bean_order color1">
                <View className="bean_order_logo"></View>
                <View className="bean_order_bean">
                  本单卡豆帮您节省
                  <Text className="color3">
                    ¥{(Number(beanFee) / 100).toFixed(2)}元
                  </Text>
                </View>
                <View
                  className="bean_order_link color3"
                  onClick={() =>
                    Router({
                      routerName: "nearVideo",
                      args: {
                        type: "goods",
                      },
                    })
                  }
                >
                  继续捡豆
                </View>
              </View>
            ) : null}
            <Coupon data={orderResult}></Coupon>
          </View>
          <Recommend current={true} userInfo={configUserLevelInfo}></Recommend>
          <Toast
            data={configNewcomerOrdersInfo}
            show={visible}
            beanLimit={beanLimit}
            beanLimitStatus={beanLimitStatus}
            visible={() => {
              this.setState({
                visible: false,
              });
            }}
          ></Toast>
        </View>
      );
    } else {
      return null;
    }
  }
}

export default Index;
