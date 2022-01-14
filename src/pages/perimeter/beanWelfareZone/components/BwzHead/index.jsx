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
export default ({ data }) => {
  const routeParams = useRouter().params;
  const { mode = "telephoneCharges" } = routeParams;

  const showContent = {
    telephoneCharges: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_500.png",
      text: `价值10元话费抵扣券\n使用500卡豆抵扣仅需5元`,
      class: "telephoneCharges",
    },
    commerceGoods: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_2500.png",
      text: `价值50元精选商品\n使用2500卡豆抵扣仅需50元`,
      class: "commerceGoods",
    },
    beanWelfare: {
      bag: "https://wechat-config.dakale.net/miniprogram/image/beanWelfareZone_5000.png",
      text: `价值100元平台通用券包\n使用5000卡豆抵扣仅需50元`,
      class: "beanWelfare",
    },
  }[mode];

  return (
    <View
      className={`beanWelfareZone_head`}
      style={{ backgroundImage: `url(${showContent.bag})` }}
    >
      <View className={`bwz_head_text ${showContent.class}`}>
        {showContent.text}
      </View>
    </View>
  );
};
