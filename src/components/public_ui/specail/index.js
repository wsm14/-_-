import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import {
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  computedPrice,
} from "@/utils/utils";
import Router from "@/utils/router";
import Taro from "@tarojs/taro";
import "./index.scss";
export const specailGoods = (item, val = {}) => {
  const {
    goodsId,
    goodsImg,
    oriPrice,
    realPrice,
    lnt,
    lat,
    merchantName,
    specialActivityIdString,
    goodsName,
    merchantPrice,
    ownerIdString,
  } = item;
  const { payBeanCommission = 50 } = val;
  return (
    <View className="specail_hot_box">
      <View
        className="specail_hot_specalImage"
        style={backgroundObj(goodsImg)}
        onClick={() =>
          Router({
            routerName: "favourableDetails",
            args: {
              specialActivityId: specialActivityIdString,
              merchantId: ownerIdString,
            },
          })
        }
      ></View>
      <View className="specail_hot_font font_noHide">{goodsName}</View>
      <View className="specails_hot_user">
        <View className="specails_hot_userProfile"></View>
        <View className="specails_hot_merchantName font_hide">
          {merchantName}
        </View>
        <View className="specails_hot_limit">
          {"| " + GetDistance(getLat(), getLnt(), lat, lnt)}
        </View>
      </View>
      <View className="specails_hot_price color2 font_hide">
        <View className="font18">原价:</View>
        <View className="specails_hot_priceMax font_hide font20 price_margin4 bold text_through">
          ¥{oriPrice}
        </View>
      </View>
      <View className="specails_hot_price1 color1 font_hide">
        <View className="font18">优惠价: </View>
        <View className="font24 price_margin4 bold">¥{realPrice}</View>
      </View>
      <View className="specailOther_new_bean ">
        <View className="bean_getInfo specailOther_new_img"></View>
        <View className="specailOther_new_pay font_hide">
          ¥{computedPrice(realPrice, payBeanCommission)}
        </View>
      </View>
    </View>
  );
};
