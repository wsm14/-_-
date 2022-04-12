/*券的为你推荐*/
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";

import "./index.scss";
export default ({ data }) => {
  const { giftName, buyPrice  } = data;
  return (
    <View className="innerCouponDetails_top">
      <View className="innerCouponDetails_share"></View>
      <View className="innerCouponDetails_banner_height">
        <View className="innerCouponDetails_banner_box">
          <View className="innerCouponDetails_banner_desc">
            <View className="innerCouponDetails_banner_title1 font_hide">
              {giftName}
            </View>
            <View className="innerCouponDetails_banner_title2 font_hide">
              仅需{buyPrice}元
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
