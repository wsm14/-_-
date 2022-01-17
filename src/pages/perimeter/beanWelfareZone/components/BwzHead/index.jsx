import React from "react";
import { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * mode
 * telephoneCharges-话费福利券包
 * commerceGoods-电商品
 * beanWelfare-卡豆福利券包
 */
export default ({ data = {} }) => {
  const routeParams = useRouter().params;
  const { mode = "telephoneCharges" } = routeParams;

  const {
    giftName = "", // 礼包名
    giftValue = 0, // 价值
    buyPrice = 0, // 购买价格
    buyFlag, // 0-免费，1-有价
    paymentModeObject = {}, // 卡豆加现金支付
  } = data;

  const { bean = 0, cash = 0, type } = paymentModeObject; // 卡豆加现金支付

  const showContent = {
    telephoneCharges: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_500.png",
      class: "telephoneCharges",
    },
    commerceGoods: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_2500.png",
      class: "commerceGoods",
    },
    beanWelfare: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_5000.png",
      class: "beanWelfare",
    },
  }[mode];

  const textShow = {
    text: `价值${giftValue}元${giftName}`,
    textTip:
      type === "self"
        ? `\n使用${bean}卡豆抵扣仅需${cash}元`
        : `仅需${buyPrice}元`,
  };

  return (
    <View
      className={`beanWelfareZone_head`}
      style={{ backgroundImage: `url(${showContent.bag})` }}
    >
      <View className={`bwz_head_text ${showContent.class}`}>
        {textShow.text}
        {buyFlag === "1" ? textShow.textTip : "免费领取"}
      </View>
    </View>
  );
};
