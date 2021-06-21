import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import {
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  computedBeanPrice,
  computedPrice,
} from "@/common/utils";
import Router from "@/common/router";
import Taro from '@tarojs/taro';
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
        onClick={() =>
          Router({
            routerName: "favourableDetails",
            args: {
              specialActivityId: specialActivityIdString,
              merchantId: merchantIdString,
            },
          })
        }
      ></View>
      <View className="specail_hot_font font_noHide">{goodsName}</View>
      <View className="specails_hot_user">
        <View
          className="specails_hot_userProfile"
        ></View>
        <View className="specails_hot_merchantName font_hide">
          {merchantName}
        </View>
        <View className="specails_hot_limit">
          {"| " + GetDistance(getLat(), getLnt(), lat, lnt)}
        </View>
      </View>
      <View className="specails_hot_price color1 font_hide">
        <View className='font20'>原价:</View>
        <View className='specails_hot_priceMax font_hide font24 price_margin4 bold text_through'>¥{oriPrice}</View>
      </View>
      <View className="specails_hot_price1 color1 font_hide">
        <View className='font20'>优惠价: </View>
        <View className='font24 price_margin4 bold'>¥{realPrice}</View>
      </View>
      <View className='specails_bean_price'>
        卡豆抵扣后最低到手价
      </View>
      <View className='specails_bean_show'>
        <View className='color3 font36 bold specails_bean_showText'>
          <View className='color3 font20 bold'>¥</View>{' '}
          {computedBeanPrice(realPrice, payBeanCommission)}
        </View>
        {shareCommission > 0 && (
          <View
            style={{ border: "1px solid #ef476f", padding: `0 ${Taro.pxTransform(8)}`, height: Taro.pxTransform(32), lineHeight: Taro.pxTransform(32) }}
            className="specails_bean_getMoney font_hide"
          >
            赚
            <Text className='bold'>¥{computedPrice(realPrice - merchantPrice, shareCommission)}</Text>
          </View>

        )}
      </View>
    </View>
  );
};
