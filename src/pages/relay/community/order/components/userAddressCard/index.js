import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  return (
    <View className="order_userAddressCard_box">
      <View className="order_userAddressCard_paddingBox">
        <View className="order_userAddressCard_title">
          <Text className="color1">团长还希望你完成以下信息</Text>
          <Text className="color3">（必填）</Text>
        </View>
        <View className="order_userAddressCard_userBox">
          <View className="order_userAddressCard_user">
            <Text className="color1 font28 bold">用户昵</Text>
            <Text className="color2 font24">18679068769</Text>
          </View>
          <View className="order_userAddressCard_address font_noHide">
            浙江省杭州市萧山区宁卫街道萧山区宁卫街道区宁卫街道
          </View>
          <View className="order_userAddressCard_link"></View>
        </View>
      </View>
    </View>
  );
};
