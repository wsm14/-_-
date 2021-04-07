import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { wxapiPost, goods } from "@/api/api";
import { httpGet, httpPost } from "@/api/newRequest";
import { authWxLogin } from "@/common/authority";
const AdaPay = require("./../../payPrice/adaPay.js");
import "./index.scss";
import InterTime from "@/components/InterTime";
import ButtonView from "@/components/Button";
import { toast, goBack, redirectTo } from "@/common/utils";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      orderSn: getCurrentInstance().router.params.orderSn,
      orderType: getCurrentInstance().router.params.orderType,
      orderResult: {},
    };
  }
  getOrderResult() {
    const {
      payWeex: { getKolOrderPrepayment },
    } = goods;
    const { orderSn, orderType } = this.state;
    httpGet(
      {
        data: { orderSn, orderType },
        url: getKolOrderPrepayment,
      },
      (res) => {
        const { orderResult } = res;
        this.setState({
          orderResult,
        });
      }
    );
  }
  creatOrder(res) {
    let code = res;
    const { wechatPayDelayOrder } = wxapiPost;
    const { orderSn } = this.state;
    httpPost(
      {
        url: wechatPayDelayOrder,
        data: { orderSn: orderSn, payType: "wx_lite", wechatCode: code },
      },
      (result, data) => {
        const { success, resultDesc } = data;
        if (success && data.content.status === "succeeded") {
          let payment = data.content;
          AdaPay.doPay(payment, (payRes) => {
            if (payRes.result_status == "succeeded") {
              redirectTo(`/pages/goods/paySuccess/index?orderSn=${orderSn}`);
            }
          });
        } else {
          toast(resultDesc || data.content.error_msg);
          goBack();
        }
      }
    );
  }
  payByKol() {
    authWxLogin(this.creatOrder.bind(this));
  }
  componentDidShow() {
    this.getOrderResult();
  }
  render() {
    const {
      orderResult: { totalFee, beanFee, payFee, createTime, expiredTime },
    } = this.state;
    return (
      <View className="pay_week">
        <View className="pay_week_price">
          <View className="pay_title">实付款</View>
          <View className="pay_price">
            <Text
              style={{
                display: "inline-block",
                fontSize: Taro.pxTransform(36),
              }}
            >
              ¥
            </Text>
            {payFee}
          </View>
          <View className="pay_time">
            支付剩余时间
            {createTime && (
              <InterTime
                mint={expiredTime}
                times={createTime}
                fn={() => {
                  goBack();
                }}
              ></InterTime>
            )}
            {/**/}
          </View>
        </View>
        <View
          className="pay_week_btn public_center"
          onClick={() => this.payByKol()}
        >
          <ButtonView>
            {" "}
            <View className="pay_week_btnGo">微信支付 ¥{payFee}</View>
          </ButtonView>
        </View>
      </View>
    );
  }
}

export default Index;