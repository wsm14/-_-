import React from "react";
import router from "@/utils/router";
import { View, Text, Button } from "@tarojs/components";
import "./index.scss";

/**
 * mode
 * telephoneCharges-话费福利券包
 * commerceGoods-电商品
 * beanWelfare-卡豆福利券包
 */
export default ({ data }) => {
  const {
    giftName = "", // 礼包名
    giftValue = 0, // 价值
    buyPrice = 0, // 购买价格
    buyFlag, // 0-免费，1-有价
    platformGiftId, // 平台礼包id
    paymentModeObject = {}, // 卡豆加现金支付
    platformGiftPackRelateList: goodsList = [], // 券列表
  } = data;

  const { bean = 0, cash = 0, type } = paymentModeObject; // 卡豆加现金支付

  // 前往购买商品
  const hanleGoBuyGoods = () => {
    router({
      routerName: "favourableOrder",
      args: {
        mode: "beanWelfare",
        platformGiftId,
      },
    });
  };

  return (
    <View>
      <View
        className="bwzgc_beanWelfare_Swiper"
        style={goodsList.length > 3 ? {} : { justifyContent: "center" }}
      >
        {goodsList.map((item) => {
          // 关联类型 platformCoupon-平台券 rightGoods-权益商品 rightCoupon-权益券
          const { relateType } = item;
          let gdata = item[relateType];
          const showName = gdata?.couponName || gdata?.goodsName || "";
          let showPrice,
            thresholdPrice = "";
          // 平台券
          if (relateType === "platformCoupon") {
            showPrice = gdata?.couponValue || 0; // 价值
            thresholdPrice = gdata?.thresholdPrice || 0; // 门槛
          }
          // 权益商品
          if (relateType === "rightGoods") {
            showPrice = gdata?.realPrice || 0;
          }
          // 权益券
          if (relateType === "rightCoupon") {
            showPrice = gdata?.couponPrice || 0;
            thresholdPrice = gdata?.thresholdPrice || 0;
          }
          return (
            <View className="bwzgc_beanWelfare_cell">
              <View className="bwzgc_beanWelfare_type">{showName}</View>
              <View className="bwzgc_beanWelfare_price">
                <Text>{showPrice}</Text>
              </View>
              <View
                className="bwzgc_beanWelfare_rule"
                style={{
                  visibility: thresholdPrice ? "initial" : "hidden",
                }}
              >
                满{thresholdPrice}可用
              </View>
              <View className="bwzgc_beanWelfare_num">数量：1张</View>
            </View>
          );
        })}
      </View>
      <View className="bwzgc_beanWelfare_name">{giftName}</View>
      <View className="bwzgc_beanWelfare_groupPrice">原价：¥{giftValue}</View>
      <View className="bwzgc_beanWelfare_buyPrice">
        ¥{type === "self" ? `${cash}+${bean}` : buyPrice}
      </View>
      <Button className="bwzgc_beanWelfareZone_btn" onClick={hanleGoBuyGoods}>
        {buyFlag === "1"
          ? type === "self"
            ? `${bean}卡豆抵扣购买`
            : `直接购买`
          : "直接购买"}
      </Button>
    </View>
  );
};
