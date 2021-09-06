import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { format } from "@/common/utils";
export default (props) => {
  const { data = {} } = props;
  const {
    title,
    logisticsType,
    communityStatus,
    endTime,
    createTime,
    buyCount = "0",
    viewCount,
    beginTime,
  } = data;
  const templateType = {
    self: "自提",
    send: "送货上门",
    noLogistics: "无需物流",
  }[logisticsType];
  return (
    <View className="community_goodCard_box">
      <View className="community_goodCard_titlesInfo">
        {title}
        <View className="community_goodCard_tags">{templateType}</View>
      </View>

      <View className="community_goodCard_data">
        {createTime} 发布 ｜
        {!format(beginTime) ? (
          `活动${beginTime}开始`
        ) : communityStatus !== "end" ? (
          <Text className="color3">{endTime}结束</Text>
        ) : (
          "已结束"
        )}
      </View>
      <View className="community_goodCard_count">
        {viewCount} 人查看
        {buyCount !== "0" ? `｜ ${buyCount}次跟团` : null}
      </View>
      {/* <View className="community_goodCard_coby public_center">复制该团</View> */}
    </View>
  );
};
