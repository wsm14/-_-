import React from "react";
import { View, Text } from "@tarojs/components";
import router from "@/utils/router";
import Confirm from "../../../AdvertisingVideo/components/Confirm";
import "./index.scss";

/**
 * 卡豆不足提示框
 * telephoneCharges-话费福利券包
 * commerceGoods-电商品
 * beanWelfare-卡豆福利券包
 */
export default ({ data = {}, visible = false, onClose }) => {
  const { giftName = "", userBean = 0, paymentModeObject = {} } = data;
  const { bean = 0, cash } = paymentModeObject; // 卡豆加现金支付

  return (
    <Confirm visible={visible} onClose={onClose}>
      <View className="beanLackModal_content">
        <View className="beanLackModal_showImg"></View>
        <View className="beanLackModal_showTip">
          仅差<Text className="red">{bean - userBean}卡豆</Text>就可把
        </View>
        <View className="beanLackModal_showTip">【{giftName}】</View>
        <View className="beanLackModal_showPrice">{cash}元带回家</View>
        <View className="beanLackModal_footer">
          <View
            className="beanLackModal_btn"
            onClick={(e) => {
              e.stopPropagation();
              router({ routerName: "home", type: "switchTab" });
            }}
          >
            刷视频捡卡豆
          </View>
        </View>
      </View>
    </Confirm>
  );
};
