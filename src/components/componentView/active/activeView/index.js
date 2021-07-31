import React from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import ButtonView from "@/components/Button";
import classNames from "classnames";
import {
  getLat,
  getLnt,
  GetDistance,
  backgroundObj,
  computedBeanPrice,
  computedPrice,
  format,
} from "@/common/utils";
import "./index.scss";
export const goodsView = (item, userInfo, fn, type = "toast") => {
  const {
    merchantName,
    merchantLogo,
    goodsImg,
    goodsName,
    lat,
    lnt,
    ownerName,
    realPrice,
    oriPrice,
    activityStartTime,
    activityTimeRule,
    remain,
    commission,
  } = item;
  const {
    payBeanCommission = 50,
    shareCommission = 0,
    teamCommission = 0,
  } = userInfo;
  const templateBtn = () => {
    if (!format(activityStartTime) && activityTimeRule === "fixed") {
      return (
        <View className="activeView_btn_box activeView_btn_style1">
          即将开始
        </View>
      );
    } else if (remain === 0) {
      return (
        <View className="activeView_btn_box activeView_btn_style1">已抢光</View>
      );
    } else {
      if (type === "toast") {
        return (
          <View className="activeView_btn_box activeView_btn_style2">
            {shareCommission > 0
              ? `分享赚¥${computedPrice(commission, shareCommission)}`
              : "立即抢购"}
          </View>
        );
      } else {
        return (
          <View className="activeView_btn_box activeView_btn_style2">
            {shareCommission > 0
              ? `分享赚¥${computedPrice(commission, shareCommission)}`
              : "分享"}
          </View>
        );
      }
    }
  };
  return (
    <View
      className="activeView_box"
      onClick={() => {
        fn(item);
      }}
    >
      <View className="activeView_image">
        <Image
          lazyLoad
          mode={"aspectFill"}
          src={goodsImg}
          className="activeView_image_box"
        ></Image>
      </View>
      <View className="activeView_about">
        <View className="activeView_name font_hide">{goodsName}</View>
        <View className="activeView_user">
          <View
            className="activeView_user_userProfile merchant_dakale_logo"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="activeView_user_userHide font_hide">
            <View className="activeView_user_merchantName font_hide">
              {ownerName}
            </View>
            <View className="price_margin8">
              {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
        </View>
        <View className="activeView_oldPrice">
          <View className="font24">原价:</View>
          <View className="font28 text_through price_margin4">¥{oriPrice}</View>
        </View>
        <View className="activeView_relPrice">
          <View className="font24">优惠价:</View>
          <View className="font28 price_margin4">¥{realPrice}</View>
        </View>
        <View className="activeView_card">
          <View class="activeView_card_box">
            <View class="activeView_card_left">卡豆购</View>
            <View class="activeView_card_san"></View>
            <View class="activeView_card_right">
              <Text className="activeView_card_maxRight font_hide">
                ￥{computedPrice(realPrice, payBeanCommission)}+
                {computedBeanPrice(realPrice, payBeanCommission) * 100}卡豆
              </Text>
            </View>
          </View>
        </View>
        {templateBtn()}
      </View>
    </View>
  );
};