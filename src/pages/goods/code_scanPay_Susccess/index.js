import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import "./index.scss";
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
import Lovely from "@/components/lovely";
import Coupons from "@/components/coupon";
import Toast from "./components/index";
import { getAvailableCoupon } from "@/server/coupon";
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
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      orderSn: getCurrentInstance().router.params.orderSn,
      orderResult: {},
      conpouVisible: false,
      couponList: [],
      visible: false,
    };
  }

  componentWillMount() {
    if (!getCurrentInstance().router.params.orderSn) {
      goBack(() => toast("参数缺失"));
    }
  }
  getAvailable() {
    getAvailableCoupon(
      {
        identifyId: getCurrentInstance().router.params.merchantId,
        channel: "consume",
        merchantId: getCurrentInstance().router.params.merchantId,
      },
      (res) => {
        const { couponList = [] } = res;
        if (couponList.length > 0) {
          this.setState({
            couponList,
            conpouVisible: true,
          });
        }
      }
    );
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
          visible: true,
        });
      }
    );
  }

  componentDidShow() {
    this.getOrderResult();
    this.getAvailable();
  }

  errorToast(e) {}

  render() {
    const {
      orderResult: {
        payFee,
        payTitle,
        totalFee,
        beanFee,
        deductFeeObject = [],
      },
      orderResult,
      orderSn,
      conpouVisible,
      couponList,
      visible,
    } = this.state;
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
            <View className="code_scanPay_decBox  code_scanPay_decMargin public_auto font24">
              <View className="color2">实付金额</View>
              <View className="color1">{"¥  " + payFee}</View>
            </View>
            {beanFee ? (
              <View className="code_scanPay_decBox  code_scanPay_decMargin1 public_auto  font24">
                <View className="color2">卡豆优惠抵扣</View>
                <View className="color3">
                  {beanFee + `(¥ ${(Number(beanFee) / 100).toFixed(2)})`}
                </View>
              </View>
            ) : null}

            {deductFeeObject.length > 0 ? (
              <View className="code_scanPay_decBox  code_scanPay_decMargin1 public_auto  font24">
                <View className="color2">优惠券</View>
                <View className="color3">{deductFeeObject[0].reduceFee}</View>
              </View>
            ) : null}
            <View className="code_scanPay_liner"></View>

            <View className="code_scanPay_btnBox">
              <View
                className="code_scanPay_btn btn_style1"
                onClick={() => switchTab("/pages/index/home/index")}
              >
                查看订单
              </View>
              <View
                className="code_scanPay_btn btn_style2"
                onClick={() =>
                  redirectTo(
                    `/pages/goods/getShopGoods/index?orderSn=${orderSn}`
                  )
                }
              >
                天天捡卡豆
              </View>
            </View>
          </View>
          <View className="code_scanPay_loveMagin">
            <Lovely title={"当前可买"}></Lovely>
          </View>
          <Toast
            show={visible}
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
