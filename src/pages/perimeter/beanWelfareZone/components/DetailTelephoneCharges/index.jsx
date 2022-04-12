import React from "react";
import { View, Text, Button } from "@tarojs/components";
import Top from "./../../../../coupon/innerCouponDetails/components/top";
import Content from "./../../../../coupon/innerCouponDetails/components/content";
import InnerDesc from "./../../../..//coupon/innerCouponDetails/components/hyDesc";
import Submit from "./../../../..//coupon/innerCouponDetails/components/submit";
import "./index.scss";

/**
 * mode
 * telephoneCharges-话费福利券包
 */
export default ({ data = {}, handleGoBuyGoods }) => {
  const {
    giftName = "", // 礼包名
    giftValue = 0, // 价值
    buyPrice = 0, // 购买价格
    paymentModeObject = {}, // 卡豆加现金支付
  } = data;

  const { bean = 0, cash = 0, type } = paymentModeObject; // 卡豆加现金支付

  return (
    <View className="bwzGoodContent_content telephoneCharges">
      <Top data={data}></Top>
      <Content data={data}></Content>
      <InnerDesc data={data}></InnerDesc>
      <Submit data={data}></Submit>
    </View>
  );
};
