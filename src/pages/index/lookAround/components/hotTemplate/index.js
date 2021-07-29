import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import {
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  computedPrice,
  computedBeanPrice,
} from "@/common/utils";
import Router from "@/common/router";
export default ({ data = {}, userInfo = {}, title = "秒杀价" }) => {
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  // const linkTo = (activityId, merchantId) => {
  //   Router({
  //     routerName: "favourableDetails",
  //     args: {
  //       specialActivityId: activityId,
  //       merchantId: merchantId,
  //     },
  //   });
  // };
  const template = () => {
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
    } = data;
    return (
      <View
        className="lookAround_template_specal animated  fadeIn"
        // onClick={() => linkTo(specialActivityIdString, merchantIdString)}
      >
        <View
          className="lookAround_template_img"
          style={backgroundObj(goodsImg)}
        >
          <View className="lookAround_template_limit">
            {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="lookAround_template_name font_hide">{goodsName}</View>
        <View className="lookAround_template_oldPrice color1 font_hide">
          <View className="font18">原价:</View>
          <View className="lookAround_template_priceMax font_hide font20 price_margin4 bold text_through">
            ¥{oriPrice}
          </View>
        </View>

        <View className="lookAround_template_price color1 font_hide">
          <View className="font18">{title} </View>
          <View className="lookAround_template_priceMax font_hide font20 price_margin4 bold">
            ¥{realPrice}
          </View>
        </View>

        <View className="lookAround_new_bean ">
          <View className="bean_getInfo lookAround_new_img"></View>
          <View className="lookAround_new_pay font_hide">
            ¥{computedPrice(realPrice, payBeanCommission)}
          </View>
        </View>

        {shareCommission > 0 && (
          <View className="lookAround_bean_show font_hide  font18 color3">
            赚
            <Text className="bold">
              ¥{computedPrice(realPrice - merchantPrice, shareCommission)}
            </Text>
          </View>
        )}
      </View>
    );
  };
  return template();
};
