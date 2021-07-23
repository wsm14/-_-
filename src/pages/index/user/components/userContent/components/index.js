import React from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
export default ({ levelDetails }) => {
  const {
    teamUserCount = 0,
    nextLevelInfo,
    monthIncome = 0,
    monthToIncome = 0,
    totalIncome = 0,
  } = levelDetails;
  return (
    <View
      className="user_content_kolBox"
      onClick={(e) => {
        console.log(123);
        e.stopPropagation();
        Router({
          routerName: "download",
        });
      }}
    >
      <View className="user_parentBox">
        <View className="user_ParentTitle">
          <View>你已累计赚取</View>
        </View>
        <View className="user_parent_money">
          {(totalIncome / 100).toFixed(2)}
        </View>
        <View className="user_parent_mx">
          <View className="user_mx_left">
            <View className="user_mx_top">
              {(monthIncome / 100).toFixed(2)}
            </View>
            <View className="user_mx_center">本月累计分佣/元</View>
          </View>
          <View className="user_mx_right">
            <View className="user_mx_top">
              {(monthToIncome / 100).toFixed(2)}
            </View>
            <View className="user_mx_center">本月待分佣/元</View>
          </View>
          <View className="user_max_liner"></View>
        </View>
      </View>
      <View className="user_lever_desc">
        {nextLevelInfo}
        <View className="user_lever_wxRight"></View>
      </View>
      <View className="user_group_people">团队人数：{teamUserCount}</View>
    </View>
  );
};
