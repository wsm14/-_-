import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { Text, View } from "@tarojs/components";
import { backgroundObj } from "@/common/utils";
import "./../index.scss";
export default ({ list = [], callback,couponIdInit  =  null }) => {
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
            className="coupon_list_coverImage dakale_nullImage"
            style={couponImg ? backgroundObj(couponImg) : {}}
          ></View>
          <View className="coupon_list_couponFont">
            <View className="coupon_list_couponFont1">{couponName}</View>
            <View className="coupon_list_couponFont2">
              有效期：{activeBeginDate}～{activeEndDate}
            </View>
          </View>
        </View>
        <View className="coupon_list_liner"></View>
        <View className="coupon_list_bottom">
          使用规则：仅限到店扫码消费{thresholdPrice&& `，满${thresholdPrice}元可用`}
        </View>
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
