import React, { useState } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
export default ({ list }) => {
  const [visible, setVisible] = useState(false);
  const template = (data) => {
    const {
      unavailableReason,
      couponName,
      activeBeginDate,
      activeEndDate,
      couponValue,
      thresholdPrice = "",
    } = data;
    return (
      <View className="couponTemplate_error_box">
        <View className="couponTemplate_error_top">
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
            className={`couponTemplate_right couponTemplate_select_icon1}`}
          ></View>
        </View>
        <View className="couponTemplate_error_question">
          <View className="color3">不可用原因：</View>
          <View className="color2">{unavailableReason}</View>
        </View>
      </View>
    );
  };
  if (list.length > 0) {
    if (visible) {
      return (
        <>
          {list.map((item) => {
            return template(item);
          })}
        </>
      );
    } else
      return (
        <View
          className="couponTemplate_error_select"
          onClick={() => {
            setVisible(true);
          }}
        >
          {list.length}张不可用的券
        </View>
      );
  } else {
    return null;
  }
};
