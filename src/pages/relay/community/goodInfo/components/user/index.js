import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { data } = props;
  const {
    userName,
    userProfile,
    subscribeFlag = "0",
    teamCount = 0,
    consumeCount = 0,
  } = data;
  return (
    <View className="community_card">
      <View className="community_card_user">
        <View className="community_card_userProfile">
          <Image
            className="community_card_image community_card_radius"
            lazyLoad
            mode={"aspectFill"}
            src={userProfile}
          ></Image>
        </View>
        <View className="community_card_userTitle">
          <View className="community_card_username">{userName}</View>
          <View className="community_card_userTime">
            成员{teamCount}
            {teamCount > 100 && "+"}｜跟团人次{consumeCount}
            {consumeCount > 100 && "+"}
          </View>
        </View>
      </View>
      <View className="community_card_collected">
        <View className="community_card_iconBox">
          <View className="community_card_icon1"></View>
          <View className="community_card_font">客服</View>
        </View>
        <View className="community_card_iconBox">
          <View className="community_card_icon2"></View>
          <View className="community_card_font">朋友圈</View>
        </View>
        <View className="community_card_iconBox">
          <View className="community_card_icon3"></View>
          <View className="community_card_font">分享</View>
        </View>
      </View>
      {subscribeFlag === "0" && <View className="community_card_btn"></View>}
    </View>
  );
};
