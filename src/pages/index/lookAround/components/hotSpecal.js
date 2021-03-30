import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj } from "@/common/utils";
import Router from "@/common/router";
import "./../index.scss";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const memo = useMemo(() => {
    const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
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
          className="lookAround_hot_specal animated  fadeIn"
          onClick={() => linkTo(specialActivityIdString, merchantIdString)}
        >
          <View className="lookAround_hot_specalImage">
            <Image src={goodsImg} className="lookAround_hot_image" />
          </View>
          <View className="lookAround_hot_bottom font_noHide">{goodsName}</View>
          <View className="lookAround_hot_price">
            <Text className="lookAround_price_text">¥</Text>
            {realPrice}
            {shareCommission !== 0 && (
              <View className="lookAround_share_text">
                /赚¥
                {(
                  (realPrice - merchantPrice) *
                  (shareCommission / 100)
                ).toFixed(2)}
              </View>
            )}
          </View>
          <View className="lookAround_hot_rel"> ¥{oriPrice}</View>
          <View className="lookAround_bean_border">
            <View className="lookAround_bean_box">
              卡豆可抵¥{(realPrice * (payBeanCommission / 100)).toFixed(2)}
            </View>
          </View>
        </View>
      );
    };
    return (
      <View className="lookAround_active_box">
        <View
          onClick={() =>
            Router({
              routerName: "specialOffer",
              args: {
                type: "hot",
              },
            })
          }
          className="lookAround_active_title"
        >
          <View className="lookAround_active_left">
            <View className="lookAround_active_hot"></View>
          </View>
          <View className="lookAround_active_right">
            <View className="lookAround_active_hot1">限量抢购，物美价廉</View>
          </View>
        </View>
        <ScrollView scrollX className="lookAround_active_scroll">
          {data.map((item) => {
            return template(item);
          })}
        </ScrollView>
      </View>
    );
  }, [data, userInfo]);
  return memo;
};
