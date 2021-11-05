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
import { handlePayWechat } from "@/server/user";
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

  creatOrder() {
    const { orderSn, orderType } = this.state;
    handlePayWechat({ orderSn, orderType }, (res) => {
      const { result_status } = res;
      if (result_status == "succeeded") {
        redirectTo(`/pages/goods/paySuccess/index?orderSn=${orderSn}`);
      } else {
        toast("支付失败");
      }
    });
  }

  componentDidShow() {
    this.getOrderResult();
  }
  render() {
    const {
      orderResult: {
        totalFee,
        beanFee,
        payFee,
        createTime,
        expiredTime,
        merchantName,
      },
    } = this.state;
    return (
      <View className="pay_week">
        <View className="pay_week_price">
          <View className="pay_title">
            支付剩余时间
            {createTime && (
              <InterTime
                mint={expiredTime}
                times={createTime}
                fn={() => {
                  console.log(123);
                  goBack();
                }}
              ></InterTime>
            )}
          </View>
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
          <View className="pay_time font_hide">{merchantName}</View>
        </View>
        <View
          className="pay_week_btn public_center"
          onClick={() => this.creatOrder()}
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
