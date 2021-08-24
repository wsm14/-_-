import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  return (
    <View className="order_selectAddressCard_box">
      <View className="order_selectAddressCard_paddingBox">
        <View className="order_selectAddressCard_select">
          <View className="order_selectAddressCard_left"></View>
          <View className="order_selectAddressCard_center font_Hide">
            <Text>已选自提点：</Text>
            <Text className="bold">国泰科技大厦</Text>
          </View>
          <View className="order_selectAddressCard_right"></View>
        </View>
        <View className="order_selectAddressCard_address font_noHide">
          浙江省杭州市萧山区宁卫街道萧山区宁卫街道萧山区宁卫街道萧山区宁卫街道78号
        </View>
        <View className="order_selectAddressCard_telephone">
          联系人：刘 187****6767
        </View>
      </View>
    </View>
  );
};
