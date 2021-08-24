import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { data } = props;
  return (
    <View className="community_goodCard_box">
      <View className="community_goodCard_title font_hide">
        <View className="community_goodCard_titlesInfo">优质生鲜搬运工，共享原产地好价格</View>
        <View className="community_goodCard_tags">快递</View>
      </View>
      <View className="community_goodCard_data">450天前 发布 ｜ 已结束</View>
      <View className="community_goodCard_count">304人查看 ｜ 302次跟团</View>
      <View className="community_goodCard_coby public_center">复制该团</View>
    </View>
  );
};
