import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import Top from "./../../../../coupon/innerCouponDetails/components/top";
import Content from "./../../../../coupon/innerCouponDetails/components/content";
import InnerDesc from "./../../../..//coupon/innerCouponDetails/components/innerDesc";
import Submit from "./../../../..//coupon/innerCouponDetails/components/submit";
import "./index.scss";

/**
 * mode
 * beanWelfare-卡豆福利券包
 */
export default ({ data, handleGoBuyGoods }) => {
  const {
    giftName = "", // 礼包名
    giftValue = 0, // 价值
    buyPrice = 0, // 购买价格
    buyFlag, // 0-免费，1-有价
    paymentModeObject = {}, // 卡豆加现金支付
    platformGiftPackRelateList: goodsList = [], // 券列表
  } = data;

  const { bean = 0, cash = 0, type } = paymentModeObject; // 卡豆加现金支付

  return (
    <View className="bwzGoodContent_content beanWelfare">
      <Top data={data}></Top>
      <Content data={data}></Content>
      <InnerDesc data={data}></InnerDesc>
      <Submit data={data}></Submit>
    </View>
  );
};
