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
import "./../index.scss";
export default ({ data = [], userInfo = {} }) => {
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const linkTo = (activityId, merchantId) => {
    Router({
      routerName: "favourableDetails",
      args: {
        specialActivityId: activityId,
        merchantId: merchantId,
      },
    });
  };
  const memo = useMemo(() => {
    const template = (item) => {
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
          className="lookAround_template_specal animated  fadeIn"
          onClick={() => linkTo(specialActivityIdString, merchantIdString)}
        >
          <View
            className="lookAround_template_img"
            style={backgroundObj(goodsImg)}
          >
            <View className="lookAround_template_limit">
              {GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
          <View className="lookAround_template_name font_hide">
            {goodsName}
          </View>
          <View className="lookAround_template_price color1 font_hide">
            <View className="font18">原价:</View>
            <View className="lookAround_hot_priceMax font_hide font20 price_margin4 bold text_through">
              ¥{oriPrice}
            </View>
          </View>

          <View className="font18 price_margin8">优惠价: </View>
          <View className="font20 price_margin4 bold">¥{realPrice}</View>
          <View className="lookAround_bean_price">卡豆抵扣后最低到手价</View>
          <View className="lookAround_bean_show">
            <View className="color3 font36 bold lookAround_bean_showText">
              <View className="color3 font20 bold">¥</View>
              {computedBeanPrice(realPrice, payBeanCommission)}
            </View>
            {shareCommission > 0 && (
              <View
                style={{ border: "1px solid #ef476f" }}
                className="lookAround_bean_getMoney font_hide"
              >
                赚
                <Text className="bold">
                  ¥{computedPrice(realPrice - merchantPrice, shareCommission)}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    };
    return template;
  }, [data, payBeanCommission, shareCommission]);
  return memo;
};
