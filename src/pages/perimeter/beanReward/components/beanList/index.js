import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import "./../../index.scss";
export default ({ data = [] }) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(data);
  }, [data]);
  const template = (data = {}) => {
    const {} = data;
    return (
      <View className="beanReward_detail">
        <View className="beanReward_detail_top">
          <View className="beanReward_top_left">千岛湖渔家</View>
          <View className="beanReward_top_right">+10</View>
        </View>
        <View className="beanReward_centerBox">吃饭聚餐哪家好，我家最好。</View>
        <View className="beanReward_bottomBox">2020.01.11 11:08</View>
      </View>
    );
  };
  return (
    <View className="beanReward_detailBox">
      {list.length === 0 ? (
        <View className="beanReward_null_status public_null_image"></View>
      ) : (
        list.map((item) => {
          return template(item);
        })
      )}
    </View>
  );
};
