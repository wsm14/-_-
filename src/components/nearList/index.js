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
    0: <View className="nearList_dakale_bean">观看捡豆{beanAmount}</View>,
    1: <View className="nearList_dakale_noBean">已捡豆{beanAmount}</View>,
  }[watchStatus];
  const activeTemplate = () => {
    const template = {
      special: (
        <View className="nearList_dakale_active">
          享¥{promotionPrice}特价活动
        </View>
      ),
      reduce: (
        <View className="nearList_dakale_coupon">
          {promotionPrice}元抵扣券
        </View>
      ),
    }[promotionType];

    return (
      <>
        {couponTitlesJson.length > 0 &&
          couponTitlesJson.map((item) => {
            return (
              <View className="nearList_dakale_coupon">
                领{item.couponPrice}元抵扣券
              </View>
            );
          })}
        {promotionId && template}
      </>
    );
    // if (type === "0") {
    //   return;
    // }
    // return {
    //   0: <View className="nearList_dakale_coupon"></View>,
    //   1: <View className="nearList_dakale_noCoupon"></View>,
    // };
  };
  return (
    <View onClick={() => linkTo()} className="nearList_box">
      <View
        style={{
          height: Taro.pxTransform(
            computedHeight(frontImageWidth, frontImageHeight, 335)
          ),
          ...backgroundObj(frontImage)
        }}
        className="nearList_image dakale_nullImage"
      >
       
        <View className="nearList_time">{filterTime(length)}</View>
        <View className="nearList_type">
          {GetDistance(getLat(), getLnt(), lat, lnt) + " |  " + categoryName}
        </View>
      </View>
      <View className="nearList_title font_noHide">{title}</View>
      <View className="nearList_active">
        {getBean}
        {activeTemplate()}
      </View>
      <View className="nearList_user_box">
        <View
          style={backgroundObj(userProfile)}
          className="nearList_user dakale_profile"
        ></View>
        <View className="nearList_userName font_hide">{username}</View>
      </View>
    </View>
  );
};
