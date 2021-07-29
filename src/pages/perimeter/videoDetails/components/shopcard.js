import React from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  backgroundObj,
  computedPrice,
  computedBeanPrice,
} from "@/common/utils";
import "./../index.scss";
export default ({
  val,
  callback,
  shareCommission,
  onClose,
  payBeanCommission,
  userProfile,
}) => {
  const {
    promotionName,
    promotionBuyPrice,
    promotionMerchantPrice,
    promotionOriPrice,
    promotionImg,
  } = val;
  const templateBtn = (val) => {
    const { promotionBuyPrice, promotionMerchantPrice } = val;
    if (shareCommission > 0) {
      return (
        <View className="templateCard_btn_box">
          <View className="templateCard_btn_initbuy public_center">
            <View
              className="font_hide"
              style={{ maxWidth: Taro.pxTransform(155) }}
            >
              {" "}
              自购返 ¥
              {computedPrice(
                promotionBuyPrice - promotionMerchantPrice,
                shareCommission
              )}
            </View>
          </View>
          <View className="templateCard_btn_initshare public_center">
            <View
              className="font_hide"
              style={{ maxWidth: Taro.pxTransform(155) }}
            >
              {" "}
              分享赚 ¥
              {computedPrice(
                promotionBuyPrice - promotionMerchantPrice,
                shareCommission
              )}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View className="templateCard_btn_box">
          <View className="templateCard_btn_buy public_center">立即抢购</View>
          <View className="templateCard_btn_share public_center">
            分享给好友
          </View>
        </View>
      );
    }
  };
  return (
    <View
      className="templateCard_box"
      onClick={(e) => {
        e.stopPropagation();
        callback();
      }}
    >
      <View
        className="templateCard_close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      ></View>
      <View className="templateCard_details_box">
        <View
          className="templateCard_image coupon_shop_icon"
          style={backgroundObj(promotionImg || userProfile)}
        ></View>
        <View className="templateCard_goods_box">
          <View className="templateCard_title font_hide">{promotionName}</View>
          <View className="templateCard_price font_hide">
            <Text className="font22 bold color6">优惠价:</Text>
            <Text className="font28 bold color6 templateCard_margin1">
              ¥{promotionBuyPrice}
            </Text>
            <Text className="font20 color6 bold templateCard_margin2 templateCard_opcity">
              原价:
            </Text>
            <Text className="font20 color6 bold templateCard_margin1 templateCard_opcity templateCard_through">
              ¥{promotionOriPrice}
            </Text>
          </View>
          <View className="templateCard_beanPrice font_hide">
            <Text className="font20">卡豆再省:</Text>
            <Text className="font20 bold templateCard_margin1">¥ </Text>
            <Text className="font28 bold templateCard_margin1">
              {computedBeanPrice(promotionBuyPrice, 100 - payBeanCommission)}
            </Text>
          </View>
        </View>
      </View>
      {templateBtn(val)}
    </View>
  );
};
