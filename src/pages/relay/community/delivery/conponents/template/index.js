import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classnames";
export default (props) => {
  return (
    <View className="delivery_template_box">
      <View
        className={classNames(
          "delivery_template_iconBox",
          "delivery_template_style1"
        )}
      ></View>
      <View className="delivery_template_content">
        <View className="delivery_template_userInfo font_hide">
          <Text className="font28 color1">快递昵称</Text>
          <Text className="font24 color2">18679068769</Text>
        </View>
        <View className="delivery_template_address font_noHide">
          浙江省杭州市萧山区宁卫街道萧山区宁卫街道区宁卫街道
        </View>
      </View>
      <View className="delivery_template_edit"></View>
    </View>
  );
};
