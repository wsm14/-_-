import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import "./../../index.scss";
export default ({ data = [] }) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(data);
  }, [data]);
  const template = (item = {}) => {
    const { detailTitle, beanAmount, beanTime, detailContent ,description} = item;
    return (
      <View className="beanReward_detail">
        <View className="beanReward_detail_top">
          <View className="beanReward_top_left font_hide">{detailContent}</View>
          <View className="beanReward_top_right">+{beanAmount}</View>
        </View>
        <View className="beanReward_centerBox">{description}</View>
        <View className="beanReward_bottomBox">{beanTime}</View>
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
