import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { toast } from "@/utils/utils";
import { inject, observer } from "mobx-react";
import { fetchPrepaymentResult, handlePayWechat } from "@/server/goods";
import GoodsPay from "./components/template/goodPay";
import ScanPay from "./components/template/scanPay";
import Router from "@/utils/router";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: { ...getCurrentInstance().router.params },
      orderResult: {},
    };
  }
  fetchOrder() {
    const { httpData } = this.state;
    fetchPrepaymentResult(httpData).then((val) => {
      const { orderResult } = val;
      this.setState({
        orderResult,
      });
    });
  }
  fakePayInfo() {
    const { httpData } = this.state;
    const { orderSn, orderType } = httpData;
    handlePayWechat({ orderSn, orderType }, (res) => {
      const { result_status } = res;
      if (result_status == "succeeded") {
        Router({
          routerName: "paySuccess",
          args: {
            orderSn,
          },
        });
      } else {
        toast("支付失败");
      }
    });
  }
  componentDidMount() {
    this.fetchOrder();
  }
  render() {
    const { orderResult } = this.state;
    const { frontViewType } = orderResult;

    const template = {
      verificationPay: (
        <GoodsPay
          onChange={this.fakePayInfo.bind(this)}
          data={orderResult}
        ></GoodsPay>
      ),
      scanPay : (
        <ScanPay
          onChange={this.fakePayInfo.bind(this)}
          data={orderResult}
        ></ScanPay>
      ),
    }[frontViewType];
    return <View className="payWeex_box">{template}</View>;
  }
}

export default Index;
