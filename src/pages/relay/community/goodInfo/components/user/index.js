import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { data } = props;
  return (
    <View className="community_card">
      <View className="community_card_user">
        <View className="community_card_userProfile">
          <Image
            className="community_card_image community_card_radius"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/relay/icon_1.png"
            }
          ></Image>
        </View>
        <View className="community_card_userTitle">
          <View className="community_card_username">
            西沙西沙西沙西沙西沙西西…
          </View>
          <View className="community_card_userTime">
            7个月前 | 96人查看｜ 13次跟团{" "}
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
      <View className="community_card_btn"></View>
    </View>
  );
};
