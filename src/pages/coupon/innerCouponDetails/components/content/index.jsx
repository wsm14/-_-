/*券的为你推荐*/
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import "./index.scss";
export default ({ data }) => {
  return (
    <View className="innerCouponDetails_content_box">
      <View className="innerCouponDetails_content_title">
        <View className="innerCouponDetails_content_titleLeft">礼包详情</View>
        <View className="innerCouponDetails_content_titleRight">
          购买后可在「我的券包」中查看{">"}
        </View>
        <View className="innerCouponDetails_content_couponBox"></View>
      </View>
    </View>
  );
};
