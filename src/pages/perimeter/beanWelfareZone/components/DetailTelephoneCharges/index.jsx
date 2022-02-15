import React from "react";
import { View, Text, Button } from "@tarojs/components";
import Tarking from "@/components/tracking";
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
      <View className="bwzgc_telephoneCharges_name">
        <View className="bwzgc_telephoneCharges_oriName font_hide">
          {giftName}
        </View>
        <View className="bwzgc_telephoneCharges_oriPrice">
          原价：¥{giftValue}
        </View>
      </View>
      <View
        className={`bwzgc_telephoneCharges_price ${type === "self" && "bean"}`}
      >
        <Text className="bwzgc_telephoneCharges_buyPrice">
          ¥{type === "self" ? `${cash}+${bean}` : buyPrice}
        </Text>
      </View>
      <Tarking name={"beanWelfareZone"} args={data}>
        <Button
          className="bwzgc_beanWelfareZone_btn"
          onClick={handleGoBuyGoods}
        >
          {type === "self" ? `${bean}卡豆抵扣购买` : `仅需${buyPrice}元`}
        </Button>
      </Tarking>
    </View>
  );
};
