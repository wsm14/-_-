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
      <View className="couponTemplate_error_box color7">
        <View className="couponTemplate_error_top color7">
          <View className="couponTemplate_left color7">
            <View className="couponTemplate_price color7">{couponValue}</View>
            <View className="couponTemplate_main color7">
              {thresholdPrice.length > 0 ? `满${thresholdPrice}可用` : "无门槛"}
            </View>
          </View>
          <View className="couponTemplate_content color7">
            <View className="couponTemplate_name font_hide color7">
              {couponName}
            </View>
            <View className="couponTemplate_date  font_hide color7">
              有效期： {activeBeginDate}至{activeEndDate}
            </View>
          </View>
          <View
            className={`couponTemplate_right couponTemplate_select_icon1 color7}`}
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
