import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { Text, View } from "@tarojs/components";
import { backgroundObj } from "@/common/utils";
import "./../index.scss";
export default ({ list = [], callback, couponIdInit = null }) => {
  const [data, setData] = useState([]);
  const [couponId, setCouponId] = useState(couponIdInit);
  useEffect(() => {
    setData(list);
  }, [list]);
  const setCoupon = (item) => {
    const { userCouponIdString, availableFlag } = item;
    if (userCouponIdString === couponId || availableFlag === "0") {
      console.log(userCouponIdString === couponId, availableFlag === "0");
      setCouponId(null);
      callback({});
    } else {
      setCouponId(userCouponIdString);
      callback(item);
    }
  };
  const couponList = (item) => {
    const {
      activeBeginDate,
      activeEndDate,
      availableFlag,
      couponImg,
      couponName,
      couponPrice,
      couponType,
      thresholdPrice,
      userCouponIdString,
      unavailableReason,
    } = item;
    return (
      <View
        className={classNames(
          "coupon_list_box",
          availableFlag === "0" && "coupon_opacity"
        )}
        onClick={() => setCoupon(item)}
      >
        <View className="coupon_list_top">
          <View
            className="coupon_list_coverImage coupon_big_icon"
            style={couponImg ? backgroundObj(couponImg) : {}}
          ></View>
          <View className="coupon_list_couponFont">
            <View className="coupon_list_couponFont1">{couponName}</View>
            <View className="coupon_list_couponFont2">
              面值{couponPrice}元
              {thresholdPrice && `｜满${thresholdPrice}元可用`}
            </View>
            <View className="coupon_list_couponFont3">
              {activeBeginDate}至{activeEndDate}
            </View>
          </View>
        </View>

        {availableFlag === "0" && (
          <>
            <View className="coupon_list_liner"></View>
            <View className="coupon_list_bottom">
              不可用: {unavailableReason}
            </View>
          </>
        )}
        <View
          className={classNames(
            "coupon_list_iconBox",
            couponId === userCouponIdString
              ? "coupon_list_icon2"
              : "coupon_list_icon1"
          )}
        ></View>
      </View>
    );
  };
  return data.map((item) => {
    return couponList(item);
  });
};
