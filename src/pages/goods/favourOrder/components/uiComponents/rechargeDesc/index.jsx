import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

export default () => {
  return (
    <View className="commerOrder_pay_info">
      <View className="commerOrder_pay_title">购买须知</View>
      <View className="commerOrder_pay_desc">
        1.此产品为卡豆特价，充值会员在用户支付完成后预计3小时内到账。具体以充值的平台返回的充值结果为准；
      </View>
      <View className="commerOrder_pay_desc">
        2.支付完成后，用户不能取消订单；
      </View>
      <View className="commerOrder_pay_desc">
        3.账号状态异常的号码（包括但不限于写错、未注册账号）可能无法充值成功；若充值失败，用户支付的款项将原路退回。
      </View>
    </View>
  );
};
