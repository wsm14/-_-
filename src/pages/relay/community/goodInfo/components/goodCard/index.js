import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { data = {} } = props;
  const {
    title,
    logisticsType,
    communityStatus,
    endTime,
    createTime,
    viewCount,
    buyCount = "0",
  } = data;
  const templateType = {
    self: "自提",
    send: "送货上门",
    noLogistics: "无需物流",
  }[logisticsType];
  return (
    <View className="community_goodCard_box">
      <View className="community_goodCard_title font_hide">
        <View className="community_goodCard_titlesInfo">{title}</View>
        <View className="community_goodCard_tags">{templateType}</View>
      </View>
      <View className="community_goodCard_data">
        {createTime} 发布 ｜{" "}
        {communityStatus !== "end" ? (
          <Text className="color3">{endTime}结束</Text>
        ) : (
          "已结束"
        )}
      </View>
      <View className="community_goodCard_count">
        {viewCount && viewCount + "人查看"}{" "}
        {buyCount !== "0" && `｜ ${buyCount}次跟团`}
      </View>
      <View className="community_goodCard_coby public_center">复制该团</View>
    </View>
  );
};
