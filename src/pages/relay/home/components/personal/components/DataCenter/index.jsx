import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { fetchPcDataCenter } from "@/server/relay";
import "./index.scss";

export default (props) => {
  const [data, setData] = useState({});

  useEffect(() => {
    handleGetData();
  }, []);

  // 获取统计数据
  const handleGetData = () => {
    fetchPcDataCenter().then((res) => {
      setData(res);
    });
  };

  const dataArr = [
    {
      text: "今日订单金额",
      number: data.settlerPrice || 0,
      icon: <Text className="pud_price_befo">￥</Text>,
    },
    {
      text: "今日订单数",
      number: data.orderCount || 0,
    },
    {
      text: "今日下单人数",
      number: data.payerCount || 0,
    },
  ];

  return (
    <View className="personal_dataCenter">
      <View className="pud_content">
        <View className="pud_content_heard">
          <View className="pud_content_title">数据中心</View>
          <View className="pud_content_time" onClick={handleGetData}>
            {data.refreshDate}更新
          </View>
          {/* <View className="pud_content_extra">查看更多</View> */}
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
