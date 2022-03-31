import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  computedBeanPrice,
} from "@/utils/utils";
import Taro from "@tarojs/taro";
import days from "dayjs";
import "./index.scss";
export default ({ status }) => {
  const template = () => {
    return (
      <View className="clooageTime_template_box">
        <View className="clooageTime_shop_profile"></View>
        <View className="clooageTime_shop_content font_hide">
          <View className="clooageTime_shop_username font_hide">
            电商商品名称电商商品名称电商商品名称电商商品名称商…
          </View>
          <View className="clooageTime_shop_count public_auto">
            <View className="clooageTime_shop_liner">
              <View
                style={{ width: "10%" }}
                className="clooageTime_shop_linerColor"
              ></View>
            </View>
            <View className="clooageTime_shop_inCount">
              6<Text className="color2">/10</Text>
            </View>
          </View>
          <View className="clooageTime_shop_price">
            <View className="font20 color1">拼团价:</View>
            <View className="price_margin4 font40">¥100</View>
            <View className="clooageTime_shop_throuer">原价:</View>
            <View className="font20 text_through clooageTime_margin">
              123213
            </View>
          </View>
        </View>
      </View>
    );
  };
  const templateContent = {
    0: (
      <View className="collageDetail_templateContent_box">
        <View className="collageDetail_templateContent_liner"></View>
        <View className="collageDetail_templateContent_people">
          -还差
          <Text className="collageDetail_templateContent_peopleCount">3位</Text>
          即可成团-
        </View>
      </View>
    ),
  }[status];
  return <View className="collageTime_shopCard_box"></View>;
};
