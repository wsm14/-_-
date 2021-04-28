import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
export const specailGoods = (item) => {
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
      className="lookAround_hot_specal animated  fadeIn"
      onClick={() => linkTo(specialActivityIdString, merchantIdString)}
    >
      <View
        className="lookAround_hot_specalImage"
        style={backgroundObj(goodsImg)}
      ></View>
      <View className="lookAround_hot_bottom font_noHide">{goodsName}</View>
      <View className="lookAround_hot_price">
        <Text className="lookAround_price_text">¥ </Text>
        {realPrice}
        {shareCommission !== 0 && (
          <View className="lookAround_share_text">
            /赚¥
            {((realPrice - merchantPrice) * (shareCommission / 100)).toFixed(2)}
          </View>
        )}
      </View>
      <View className="lookAround_hot_rel"> ¥ {oriPrice}</View>
      <View className="lookAround_bean_border">
        <View
          style={{ border: "1px solid #ef476f" }}
          className="lookAround_bean_box"
        >
          卡豆可抵 ¥{(realPrice * (payBeanCommission / 100)).toFixed(2)}
        </View>
      </View>
    </View>
  );
};
