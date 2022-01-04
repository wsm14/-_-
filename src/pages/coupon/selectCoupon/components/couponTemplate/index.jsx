import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";
export default ({ data, checkedObj = {}, index, change }) => {
  const {
    unavailableReason,
    couponName,
    activeBeginDate,
    activeEndDate,
    couponValue,
    thresholdPrice = "",
    userCouponId,
  } = data;
  return (
    <View
      className="couponTemplate_box"
      onClick={() => {
        change(data);
      }}
    >
      <View className="couponTemplate_left">
        <View className="couponTemplate_price">{couponValue}</View>
        <View className="couponTemplate_main">
          {thresholdPrice.length > 0 ? `满${thresholdPrice}可用` : "无门槛"}
        </View>
      </View>
      <View className="couponTemplate_content">
        <View className="couponTemplate_name font_hide">{couponName}</View>
        <View className="couponTemplate_date  font_hide">
          有效期： {activeBeginDate}至{activeEndDate}
        </View>
      </View>
      <View
        className={`couponTemplate_right ${
          userCouponId === checkedObj.userCouponId
            ? "couponTemplate_select_icon2"
            : "couponTemplate_select_icon1"
        }`}
      ></View>
      {index === 0 && <View className="couponTemplate_tj"></View>}
    </View>
  );
};
