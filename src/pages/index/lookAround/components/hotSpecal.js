import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj, computedPrice, computedBeanPrice } from "@/common/utils";
import Router from "@/common/router";
import "./../index.scss";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
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
          className="lookAround_hot_specal animated  fadeIn"
          onClick={() => linkTo(specialActivityIdString, merchantIdString)}
        >
          <View
            className="lookAround_hot_specalImage"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="lookAround_hot_bottom font_hide">{goodsName}</View>
          <View className="lookAround_hot_user">
            <View
              className="lookAround_hot_userProfile"
            ></View>
            <View className="lookAround_hot_merchantName font20 font_hide">
              {merchantName}
            </View>
            <View className="lookAround_hot_limit font20">
              {"| " + GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
          <View className="lookAround_hot_price color1 font_hide">
            <View className='font18'>原价:</View>
            <View className='lookAround_hot_priceMax font_hide font20 price_margin4 bold text_through'>{oriPrice}</View>
            <View className='font18 price_margin8'>优惠价: </View>
            <View className='font20 price_margin4 bold'>{realPrice}</View>
          </View>
          <View className='lookAround_bean_price'>
            卡豆抵扣后最低到手价
          </View>
          <View className='lookAround_bean_show'>
            <View className='color3 font36 bold lookAround_bean_showText'>
              <View className='color3 font20 bold'>¥</View>
              {computedBeanPrice(realPrice, payBeanCommission)}
            </View>
            {shareCommission > 0 && (
              <View
                style={{ border: "1px solid #ef476f" }}
                className="lookAround_bean_getMoney font_hide"
              >
                赚
                <Text className='bold'>¥{computedPrice(realPrice - merchantPrice, shareCommission)}</Text>
              </View>

            )}
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
  }, [data, payBeanCommission, shareCommission]);
  return memo;
};
