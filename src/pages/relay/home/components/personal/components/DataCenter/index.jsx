import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";

export default (props) => {
  const dataArr = [
    {
      text: "今日订单金额",
      number: 500,
      icon: <Text className="pud_price_befo">￥</Text>,
    },
    {
      text: "今日订单数",
      number: 500,
    },
    {
      text: "今日下单人数",
      number: 80000,
    },
  ];

  return (
    <View className="personal_dataCenter">
      <View className="pud_content">
        <View className="pud_content_heard">
          <View className="pud_content_title">数据中心</View>
          <View className="pud_content_time">08/24 10:29更新</View>
          <View className="pud_content_extra">查看更多</View>
        </View>
        <View className="pud_content_data">
          {dataArr.map((i) => (
            <View className="pud_data_cell">
              <View className="pud_data_price">
                {i.icon}
                {i.number}
              </View>
              <View className="pud_data_text">{i.text}</View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
