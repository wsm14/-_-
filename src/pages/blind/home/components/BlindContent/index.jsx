import React, { useState } from "react";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * 盲盒区域
 */
export default () => {
  const [tabKey, setTabKey] = useState("bean"); // tab key

  const bindTab = {
    bean: "卡豆专场",
    active: "邀请专场",
  };

  return (
    <View className="blind_content">
      {/* 可用卡豆 */}
      <View className="blindC_bean">100000</View>
      {/* 切换区域 */}
      <View className="blind_tab">
        {Object.keys(bindTab).map((item) => (
          <View
            className={`blind_tab_cell ${tabKey === item ? "active" : ""}`}
            onClick={() => setTabKey(item)}
          >
            {bindTab[item]}
          </View>
        ))}
      </View>
      {/* 抽奖区域 */}
      <View className="blind_prize"></View>
      {/* 记录按钮 */}
      <View className="blind_jackpot">
        <View className="blind_jacknow"></View>
        <View className="blind_jackown"></View>
      </View>
      {/* 開始按鈕 */}
      <View className="blind_start">50卡豆拆一次</View>
      {/* 邀请好友获得免费机会/查看我的助力进度 */}
      <View className="blind_invint">邀请好友获得免费机会 </View>
    </View>
  );
};
