/*
店铺详情优惠券公共样式

*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Router from "@/common/router";
import "./index.scss";
export const coupon = (data) => {
  const {
    couponName,
    buyPrice,
    reduceObject = {},
    buyRule = "unlimited",
    dayMaxBuyAmount = 0,
    buyStatus = "0",
    personLimit = 0,
    merchantIdString,
    ownerIdString,
    ownerCouponIdString,
  } = data;
  const { couponPrice = 0, thresholdPrice, remain } = reduceObject;
  let a = 0;
  const templateThreshold = () => {
    if (thresholdPrice) {
      return `满${thresholdPrice}元可用`;
    } else {
      return "无门槛 ";
    }
  };
  const templateSelect = () => {
    if (buyRule === "unlimited") {
      return `不限购`;
    } else {
      if (buyStatus === "1") {
        return `购买数量已达上限`;
      } else if (buyRule === "personLimit") {
        return `每人限购${personLimit}`;
      } else {
        return `每人每天限购${dayMaxBuyAmount}`;
      }
    }
  };
  const templateBtn = () => {
    if (remain == 0) {
      return <View className="coupon_view_btn coupon_btn_style3">已售罄</View>;
    } else if (buyStatus === "1") {
      return <View className="coupon_view_btn coupon_btn_style2">已购</View>;
    } else {
      return <View className="coupon_view_btn coupon_btn_style1">抢购</View>;
    }
  };
  const linkTo = () => {
    if (buyStatus !== "1") {
      Router({
        routerName: "payCouponDetails",
        args: {
          ownerCouponId: ownerCouponIdString,
          ownerId: ownerIdString,
          merchantId: merchantIdString,
        },
      });
    }
  };
  const template = () => {
    if (remain != 0) {
      return (
        <View
          className="coupon_view_box coupon_view_checkColor"
          onClick={linkTo}
        >
          <View className="coupon_view_child">
            <View className="coupon_view_title font_hide color1">
              {couponName}
            </View>
            <View className="coupon_view_content color2">
              {templateThreshold()}｜{templateSelect()}
            </View>
            <View className="coupon_view_bottom">
              <Text className="coupon_view_priceIcon color3">¥ </Text>
              <Text className="coupon_view_price color3">{"" + buyPrice}</Text>
              <Text className="coupon_view_noFont color7"> ¥{couponPrice}</Text>
            </View>
          </View>
          {templateBtn()}
        </View>
      );
    } else {
      return (
        <View className="coupon_view_box coupon_view_nullCheckColor color7">
          <View className="coupon_view_child">
            <View className="coupon_view_title font_hide">{couponName}</View>
            <View className="coupon_view_content">
              {" "}
              {templateThreshold()}｜{templateSelect()}
            </View>
            <View className="coupon_view_bottom">
              <Text className="coupon_view_priceIcon">¥ </Text>
              <Text className="coupon_view_price">{" " + buyPrice} </Text>
              <Text className=""> ¥{couponPrice}</Text>
            </View>
          </View>
          {templateBtn()}
        </View>
      );
    }
  };
  return template();
};

export const couponLovely = (data) => {
  const {
    couponName,
    buyPrice,
    reduceObject = {},
    buyRule = "unlimited",
    dayMaxBuyAmount = 0,
    buyStatus = "0",
    personLimit = 0,
    merchantIdString,
    ownerIdString,
    ownerCouponIdString,
  } = data;
  const { couponPrice = 0, thresholdPrice, remain } = reduceObject;
  let a = 0;
  const templateThreshold = () => {
    if (thresholdPrice) {
      return `满${thresholdPrice}元可用`;
    } else {
      return "无门槛 ";
    }
  };
  const templateSelect = () => {
    if (buyRule === "unlimited") {
      return `不限购`;
    } else {
      if (buyStatus === "1") {
        return `购买数量已达上限`;
      } else if (buyRule === "personLimit") {
        return `每人限购${personLimit}`;
      } else {
        return `每人每天限购${dayMaxBuyAmount}`;
      }
    }
  };
  const templateBtn = () => {
    return <View className="coupon_view_btn coupon_btn_style1">抢购</View>;
  };
  const linkTo = () => {
    if (buyStatus !== "1") {
      Router({
        routerName: "payCouponDetails",
        args: {
          ownerCouponId: ownerCouponIdString,
          ownerId: ownerIdString,
          merchantId: merchantIdString,
        },
      });
    }
  };
  const template = () => {
    return (
      <View className="coupon_view_box coupon_view_lovelybg" onClick={linkTo}>
        <View className="coupon_view_child">
          <View className="coupon_view_title font_hide color1">
            {couponName}
          </View>
          <View className="coupon_view_content color2">
            {templateThreshold()}｜{templateSelect()}
          </View>
          <View className="coupon_view_bottom">
            <Text className="coupon_view_priceIcon color3">¥ </Text>
            <Text className="coupon_view_price color3">{"" + buyPrice}</Text>
            <Text className="coupon_view_noFont color7"> ¥{couponPrice}</Text>
          </View>
        </View>
        {templateBtn()}
      </View>
    );
  };

  return template();
};
