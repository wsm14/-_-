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
    categoryName = "",
    watchStatus = "0",
    length,
    ownerId,
    ownerName,
    ownerImg,
    title,
    frontImage,
    frontImageHeight,
    frontImageWidth,
    tippingBean,
    momentIndex,
    couponTitlesJson = [],
    promotionFlag,
    promotionNum,
    freeCouponFlag,
    beanFlag,
    addressContentObject = {},
    relateImg,
  } = item;
  const { lat, lnt } = addressContentObject;
  const linkTo = () => {
    store.homeStore.setNavitory(list, momentIndex);
    Router({ routerName: "nearVideo" });
  };
  const getBean = {
    0: <View className="nearList_dakale_bean">观看捡{tippingBean}卡豆</View>,
    1: <View className="nearList_dakale_noBean">已捡{tippingBean}卡豆</View>,
  }[watchStatus];
  const activeTemplate = () => {
    if (promotionFlag === "1" || freeCouponFlag === "1") {
      return (
        <View className="nearList_bottom_avtiveBox">
          {freeCouponFlag === "1" && (
            <View className="nearList_dakale_coupon public_center">领券</View>
          )}
          {promotionFlag === "1" && (
            <View className="nearList_dakale_active">
              {promotionNum}款特惠带货中
            </View>
          )}
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
        {beanFlag === "1" && (
          <View className="nearList_getBean">
            <View className="nearList_beanIcon"></View>
            {getBean}
          </View>
        )}

        <View className="nearList_time">{filterTime(length)}</View>
      </View>
      <View className="nearList_new_content font_hide">
        <View className="nearList_new_title font_hide"> {title}</View>

        {activeTemplate()}
      </View>

      <View className="nearList_user_box">
        <View
          style={backgroundObj(relateImg)}
          className="nearList_user merchant_dakale_logo"
        ></View>

        <View className="nearList_merchantName font_hide">{ownerName}</View>
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
    ownerId,
    ownerName,
    ownerImg,
    title,
    frontImage,
    frontImageHeight,
    frontImageWidth,
    tippingBean,
    momentIndex,
    couponTitlesJson = [],
    promotionFlag,
    promotionNum,
    freeCouponFlag,
    keyword,
    relateImg,
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
    if (promotionFlag === "1" || freeCouponFlag === "1") {
      return (
        <View className="nearList_bottom_avtiveBox">
          {freeCouponFlag === "1" && (
            <View className="nearList_dakale_coupon public_center">领券</View>
          )}
          {promotionFlag === "1" && (
            <View className="nearList_dakale_active">
              {promotionNum}款特惠带货中
            </View>
          )}
        </View>
      );
    } else {
      return null;
    }
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
          style={backgroundObj(relateImg)}
          className="nearList_user merchant_dakale_logo"
        ></View>

        <View className="nearList_merchantName font_hide">
          {ownerName + " "}
        </View>
        <View className="nearList_limit font_hide">
          {"| " + GetDistance(getLat(), getLnt(), lat, lnt)}
        </View>
      </View>
    </View>
  );
};
