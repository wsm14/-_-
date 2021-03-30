import React from "react";
import { Text, View } from "@tarojs/components";
import Router from "@/common/router";
import {
  toast,
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
} from "@/common/utils";
import "./index.scss";
export const template = (item, configUserLevelInfo) => {
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const {
    goodsId,
    goodsName,
    goodsImg,
    oriPrice,
    realPrice,
    lnt,
    lat,
    status,
    goodsType,
    merchantAddress,
    merchantName,
    merchantLogo,
    merchantIdString,
    specialActivityIdString,
    merchantPrice,
  } = item;
  return (
    <View
      className="specialOffer_shop animated fadeIn"
      onClick={() =>
        Router({
          routerName: "favourableDetails",
          args: {
            specialActivityId: specialActivityIdString,
            merchantId: merchantIdString,
          },
        })
      }
    >
      <View
        style={backgroundObj(goodsImg)}
        className="specialOffer_shopImg"
      ></View>
      <View className="specialOffer_desc">
        <View className="specialOffer_title  font_noHide">{goodsName}</View>
        <View className="specialOffer_userDetails">
          <View
            className="specialOffer_userprofile"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="specialOffer_username font_hide">
            {" "}
            {merchantName}
          </View>
          <View className="specialOffer_limit">
            {" "}
            ｜ {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="specialOffer_date_price">
          {" "}
          <Text className="specialOffer_price_text">¥</Text>
          {realPrice}
          {shareCommission !== 0 && (
            <View className="specialOffer_share_text">
              /赚¥
              {((realPrice - merchantPrice) * (shareCommission / 100)).toFixed(
                2
              )}
            </View>
          )}
        </View>
        <View className="specialOffer_date_rel">¥{oriPrice}</View>
        <View className="specialOffer_bean_border">
          <View className="specialOffer_bean_box">
            卡豆可抵¥{(realPrice * (payBeanCommission / 100)).toFixed(2)}
          </View>
        </View>
      </View>
      <View className="specialOffer_bottom_btn">抢购</View>
    </View>
  );
};
