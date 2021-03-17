import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import "./index.scss";
export default (props) => {
  const { data, visible } = props;

  return (
    <View
      className="kol_bean public_center"
      onClick={(e) => {
        e.stopPropagation();
        visible();
      }}
    >
      <View
        className="kol_bean_box happyBean"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <View className="kol_details_padding">
          <View className="color1 bold font32">恭喜您获得</View>
          <View className="font40 bold color3 bean_padding">
            {data.beanAmount}卡豆
          </View>
          <View className="getBean_btn font32 color6" onClick={() => visible()}>
            立即领取
          </View>
        </View>
      </View>
    </View>
  );
};
