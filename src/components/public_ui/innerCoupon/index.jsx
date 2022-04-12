import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Drawer from "@/components/Drawer";
import Router from "@/utils/router";
import "./index.scss";
export default ({ type = 1, data }) => {
  const { platformCoupon } = data;
  const {
    activeDate,
    activeDays,
    classType,
    couponDesc,
    couponName,
    couponReceiveStatus,
    couponType,
    couponValue,
    delayDays,
    endDate,
    platformCouponId,
    platformCouponImg,
    remain,
    thresholdPrice,
    total,
    useScenesType,
    useTimeRule,
  } = platformCoupon;
  const renter = () => {
    if (classType === "universal" && useScenesType === "goodsBuy") {
      return "商品通用券";
    } else if (classType === "category" && useScenesType === "goodsBuy") {
      return "行业商品券";
    } else if (classType === "merchant" && useScenesType === "goodsBuy") {
      return "店铺商品券";
    } else if (classType === "goods" && useScenesType === "goodsBuy") {
      return "指定商品券";
    } else if (classType === "universal" && useScenesType === "virtual") {
      return "虚拟通用券";
    } else if (classType === "goods" && useScenesType === "virtual") {
      return "指定虚拟券";
    } else if (classType === "universal" && useScenesType === "commerce") {
      return "电商通用券";
    } else if (classType === "goods" && useScenesType === "commerce") {
      return "指定电商券";
    }
  };
  const template = {
    1: (
      <View className="innerCoupon_box1">
        <View className="innerCoupon_title font_hide">{couponName}</View>
        <View className="innerCoupon_price">
          <View className="innerCoupon_price_fh">¥</View>
          <View className="innerCoupon_price_jg">{couponValue}</View>
        </View>
        <View className="innerCoupon_price_mk">满{thresholdPrice}可用</View>
        <View className="innerCoupon_desc font_hide">{couponDesc}</View>
      </View>
    ),
    2: (
      <View className="innerCoupon_box2">
        <View className="innerCoupon_title font_hide">{couponName}</View>
        <View className="innerCoupon_price">
          <View className="innerCoupon_price_fh">¥</View>
          <View className="innerCoupon_price_jg">{couponValue}</View>
        </View>
        <View className="innerCoupon_price_mk">满{thresholdPrice}可用</View>
        <View className="innerCoupon_desc font_hide">{couponDesc}</View>
      </View>
    ),
    3: (
      <View className="innerCoupon_box3">
        <View className="innerCoupon_title_leftInfo">
          <View className="innerCoupon_title_font font_hide">
            {" "}
            {couponName}
          </View>
          <View className="innerCoupon_title_time">
            {activeDate && endDate
              ? activeDate + "至" + endDate
              : `领取后${delayDays}天生效 | 有效期：${activeDays}天`}
          </View>
        </View>
        <View className="innerCoupon_title_right  font_hide">
          <View className="innerCoupon_title_priceInfo">
            <View className="innerCoupon_price_fh">¥</View>
            <View className="innerCoupon_price_jg">{couponValue}</View>
          </View>
          <View className="innerCoupon_price_mk">满{thresholdPrice}可用</View>
        </View>
        <View className="innerCoupon_increase_odesc font_hide">
          {couponDesc}
        </View>
        {<View className="innerCoupon_tag_icon public_center">{renter()}</View>}
      </View>
    ),
    4: (
      <View className="innerCoupon_box4">
        <View className="innerCoupon_title_leftInfo">
          <View className="innerCoupon_title_font font_hide">
            {" "}
            {couponName}
          </View>
          <View className="innerCoupon_title_time">
            {activeDate && endDate
              ? activeDate + "至" + endDate
              : `领取后${delayDays}天生效 | 有效期：${activeDays}天`}
          </View>
        </View>
        <View className="innerCoupon_title_right  font_hide">
          <View className="innerCoupon_title_priceInfo">
            <View className="innerCoupon_price_fh">¥</View>
            <View className="innerCoupon_price_jg">{couponValue}</View>
          </View>
          <View className="innerCoupon_price_mk">满{thresholdPrice}可用</View>
        </View>
        <View className="innerCoupon_increase_odesc font_hide">
          {couponDesc}
        </View>
        {<View className="innerCoupon_tag_icon public_center">{renter()}</View>}
      </View>
    ),
  }[type];
  return template;
};
