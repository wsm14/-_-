import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Banner from "@/components/banner";
import {
  backgroundObj,
  getLat,
  getLnt,
  GetDistance,
  computedBeanPrice,
} from "@/utils/utils";
import "./index.scss";
export default ({ data, onChange, payBeanCommission, reload }) => {
  const { contentInfo } = data;
  const { mixedList, topImg } = contentInfo;
  console.log(mixedList);
  const style = {
    width: Taro.pxTransform(750),
    height: Taro.pxTransform(480),
    position: "relative",
    zIndex: "10",
  };
  const template = (item) => {
    const {
      specialGoodsId,
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      total,
      remain,
      status,
      relateType,
      ownerId,
      merchantName,
      merchantLogo,
      lnt,
      lat,
      progress,
      showSelledGoods,
      activityGoodType,
      paymentModeObject = {},
    } = item;
    const { type = "defaultMode", cash, bean } = paymentModeObject;
    const render = () => {
      if (type === "defaultMode") {
        return (
          <>
            <View className="exchangeTemplate_price font_hide">
              <View className="exchangeTemplate_rel font_hide">
                <Text className="font_24">¥</Text>
                {realPrice}
              </View>
              <View className="exchangeTemplate_old price_margin4">
                ¥ {oriPrice}
              </View>
            </View>
            <View className="exchangeTemplate_bean">
              <View className="exchangeTemplate_bean_info public_center">
                <Text className="font24">¥</Text>
                {computedBeanPrice(realPrice, 100 - payBeanCommission)}
              </View>
            </View>
          </>
        );
      } else {
        return (
          <>
            <View className="exchangeTemplate_self_price">
              {" "}
              {cash} {bean ? `+${bean}卡豆` : ""}
            </View>
            <View className="exchangeTemplate_self">¥{oriPrice}</View>
          </>
        );
      }
    };
    return (
      <View
        className="exchangeTemplate_template"
        onClick={() => onChange(item)}
      >
        <View
          style={backgroundObj(goodsImg)}
          className="exchangeTemplate_profile"
        >
          <View
            className={
              activityGoodType !== "commerceGoods"
                ? "exchangeTemplate_profile_tag1"
                : "exchangeTemplate_profile_tag2"
            }
          ></View>
        </View>
        <View className="exchangeTemplate_content">
          <View className="exchangeTemplate_name font_noHide">{goodsName}</View>
          <View className="exchangeTemplate_userInfo font_hide">
            <View
              className="exchangeTemplate_userProfile merchant_dakale_logo"
              style={backgroundObj(merchantLogo)}
            ></View>
            <View className="exchangeTemplate_userName font_hide">
              {merchantName}
            </View>
            <View className="exchangeTemplate_limit">
              ｜{GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>

          {render()}
        </View>
        <View className="exchangeTemplate_btn public_center">抢购</View>
      </View>
    );
  };
  return (
    <View className="exchangeTemplate_page_box">
      <Banner
        imgName="coverImg"
        data={[
          {
            coverImg: topImg,
          },
        ]}
        boxStyle={style}
      ></Banner>
      <View className="exchangeTemplate_box">
        {mixedList.map((item) => {
          return template(item);
        })}{" "}
      </View>
      <View className="dakale_logo">
        <View className="dakale_logo_image"></View>
      </View>
    </View>
  );
};
