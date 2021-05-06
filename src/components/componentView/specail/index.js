import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
export const specailGoods = (item, val = {}) => {
  const {
    goodsId,
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
    goodsName,
    merchantPrice,
  } = item;
  const { payBeanCommission = 50, shareCommission = 0 } = val;
  return (
    <View className="specail_hot_box">
      <View
        className="specail_hot_specalImage"
        style={backgroundObj(goodsImg)}
      ></View>
      <View className="specail_hot_font font_noHide">{goodsName}</View>
      <View className="specail_hot_limit">
        {GetDistance(getLat(), getLnt(), lat, lnt)}
      </View>
      <View className="specail_hot_price">
        <Text className="specail_price_text">¥ </Text>
        {realPrice}
        {shareCommission !== 0 && (
          <View className="specail_share_text">
            /赚¥
            {((realPrice - merchantPrice) * (shareCommission / 100)).toFixed(2)}
          </View>
        )}
      </View>
      <View className="specail_hot_rel"> ¥ {oriPrice}</View>
      <View className="specail_bean_border">
        <View
          style={{ border: "1px solid #ef476f" }}
          className="specail_bean_box"
        >
          卡豆可抵 ¥{(realPrice * (payBeanCommission / 100)).toFixed(2)}
        </View>
      </View>
    </View>
  );
};
