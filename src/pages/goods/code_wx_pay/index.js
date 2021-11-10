import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import {
  View,
  Button,
  Image,
  Text,
  Swiper,
  SwiperItem,
  Input,
} from "@tarojs/components";
import "./index.scss";
import { getOrderPrepaymentResult, payOrder } from "@/server/goods";
import { navigateTo, goBack, toast, redirectTo } from "@/common/utils";
import PayGo from "@/components/pay_btn";
import { handlePayWechat } from "@/server/user";

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        orderSn: getCurrentInstance().router.params.orderSn,
        payMonth: getCurrentInstance().router.params.payMonth,
        orderType: getCurrentInstance().router.params.orderType,
      },
      merchantId: getCurrentInstance().router.params.merchantId,
      orderResult: {},
    };
  }

  componentWillMount() {
    const {
      httpData: { orderSn, orderType },
    } = this.state;
    if (!orderSn) {
      goBack(() => toast("参数缺失"));
    }
  }

  getOrderPrepaymentResult() {
    const { httpData } = this.state;
    getOrderPrepaymentResult(httpData, (res) => {
      const { orderResult } = res;
      this.setState({
        orderResult: orderResult,
      });
    });
  }

  payOrder() {
    const { httpData } = this.state;
    const { orderSn, merchantId } = httpData;
    handlePayWechat({ ...httpData }, (res) => {
      const { result_status } = res;
      if (result_status == "succeeded") {
        redirectTo(
          `/pages/goods/code_scanPay_Susccess/index?orderSn=${orderSn}&merchantId=${merchantId}`
        );
      } else {
        toast("支付失败");
      }
    });
  }

  componentDidShow() {
    this.getOrderPrepaymentResult();
  }

  render() {
    const {
      orderResult: { payFee, totalFee, beanFee = 0, deductFeeObject = [] },
    } = this.state;
    return (
      <View className="code_wx_box">
        <View className="code_wx_content">
          <View className="code_pay_title">实付款</View>
          <View className="code_pay_money">
            <Text className="font36">¥ </Text>
            {payFee}
          </View>
          <View className="code_pay_liner"></View>
          <View className="code_pay_detailsBox">
            <View className="public_auto font24 payWx_detail_top1">
              <View className="color2">订单金额</View>
              <View className="color1">¥ {totalFee}</View>
            </View>
            <View className="public_auto font24 payWx_detail_top2">
              <View className="color2">卡豆抵扣</View>
              <View className="color1">
                -{beanFee}(¥ {(parseInt(beanFee) / 100).toFixed(2)})
              </View>
            </View>
            {deductFeeObject.length > 0 && (
              <View className="public_auto font24 payWx_detail_top2">
                <View className="color2">优惠券</View>
                <View className="color1">
                  {deductFeeObject[0].reduceFee.split(".").length === 1
                    ? `- ¥${deductFeeObject[0].reduceFee}.00`
                    : `- ¥${deductFeeObject[0].reduceFee}`}
                </View>
              </View>
            )}
          </View>
        </View>
        <PayGo
          content={`微信支付¥${payFee}`}
          click={this.payOrder.bind(this)}
        ></PayGo>
      </View>
    );
  }
}

export default Index;
