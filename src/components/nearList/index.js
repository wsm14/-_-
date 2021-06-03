import React from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import {
  filterTime,
  getLat,
  getLnt,
  backgroundObj,
  GetDistance,
  computedHeight,
} from "@/common/utils";
import Router from "@/common/router";
import classNames from "classnames";
import "./index.scss";
export const nearList = (item = {}, list = [], store) => {
  const {
    lat = "",
    lnt = "",
    categoryName = "",
    watchStatus = "0",
    length,
    userProfile,
    username,
    title,
    frontImage,
    frontImageHeight,
    frontImageWidth,
    beanAmount,
    momentIndex,
    couponTitlesJson = [],
    promotionId,
    promotionPrice,
    promotionType,
  } = item;
  const linkTo = () => {
    store.homeStore.setNavitory(list, momentIndex);
    Router({ routerName: "nearVideo" });
  };
  const getBean = {
    0: <View className="nearList_dakale_bean">观看捡{beanAmount}卡豆</View>,
    1: <View className="nearList_dakale_noBean">已捡{beanAmount}卡豆</View>,
  }[watchStatus];
  const activeTemplate = () => {
    const template = {
      special: (
        <View className="nearList_dakale_active">
          ¥{promotionPrice}特价活动
        </View>
      ),
      reduce: (
        <View className="nearList_dakale_active">{promotionPrice}元抵扣券</View>
      ),
    }[promotionType];
    if (promotionId || couponTitlesJson.length > 0) {
      return (
        <View className="nearList_bottom_avtiveBox">
          {couponTitlesJson.length > 0 &&
            couponTitlesJson.map((item) => {
              return <View className="nearList_dakale_coupon public_center">领券</View>;
            })}
          {promotionId && template}
        </View>
      );
    } else {
      return null;
    }
  };
  return (
    <View onClick={() => linkTo()} className="nearList_box  nearListBg">
      <View
        style={{
          height: Taro.pxTransform(
            computedHeight(frontImageWidth, frontImageHeight, 372)
          ),
          ...backgroundObj(frontImage),
        }}
        className="nearList_image dakale_nullImage"
      >
        <View className="nearList_getBean">
          <View className="nearList_beanIcon"></View>
          {getBean}
        </View>
        <View className="nearList_time">{filterTime(length)}</View>
      </View>
      <View className="nearList_new_content font_hide">
        <View className="nearList_new_title font_hide"> {title}</View>

        {activeTemplate()}
      </View>

      <View className="nearList_user_box">
        <View
          style={backgroundObj(userProfile)}
          className="nearList_user dakale_profile"
        ></View>

        <View className="nearList_merchantName font_hide">{username}</View>
        <View className="nearList_limit  font_hide">
          {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
        </View>
      </View>
    </View>
  );
};
export const searchList = (item = {}, list = [], store) => {
  const {
    lat = "",
    lnt = "",
    categoryName = "",
    watchStatus = "0",
    length,
    userProfile,
    username,
    title,
    frontImage,
    frontImageHeight,
    frontImageWidth,
    beanAmount,
    momentIndex,
    couponTitlesJson = [],
    promotionId,
    promotionPrice,
    promotionType,
    keyword,
    promotionExtraParam = "",
  } = item;
  const linkTo = () => {
    store.homeStore.setNavitory(list, momentIndex);
    Router({
      routerName: "merchantVideo",
      args: {
        type: "search",
        keyword,
      },
    });
  };
  const activeTemplate = () => {
    let obj = {};
    if (promotionExtraParam.length > 0) {
      obj = JSON.parse(promotionExtraParam);
    }
    const { buyPrice = "" } = obj;
    const template = {
      special: (
        <View className="nearList_dakale_active">
          ¥{promotionPrice}特价活动
        </View>
      ),
      reduce: (
        <View className="nearList_dakale_active">
          ¥{buyPrice}代{promotionPrice}元抵扣券
        </View>
      ),
    }[promotionType];

    return (
      <View className="nearList_bottom_avtiveBox">
        {couponTitlesJson.length > 0 &&
          couponTitlesJson.map((item) => {
            return <View className="nearList_dakale_coupon">领券</View>;
          })}
        {promotionId && template}
      </View>
    );
  };
  return (
    <View onClick={() => linkTo()} className="nearList_box">
      <View
        style={{
          height: Taro.pxTransform(
            computedHeight(frontImageWidth, frontImageHeight, 372)
          ),
          ...backgroundObj(frontImage),
        }}
        className="nearList_image dakale_nullImage"
      >
        <View className="nearList_time">{filterTime(length)}</View>
        <View className="nearList_bottom">
          <View className="nearList_bottom_title font_noHide">{title}</View>
          {activeTemplate()}
        </View>
      </View>
      <View className="nearList_user_box">
        <View
          style={backgroundObj(userProfile)}
          className="nearList_user dakale_profile"
        ></View>

        <View className="nearList_merchantName font_hide">
          {username + " "}
        </View>
        <View className="nearList_limit font_hide">
          {"| " + GetDistance(getLat(), getLnt(), lat, lnt)}
        </View>
      </View>
    </View>
  );
};
