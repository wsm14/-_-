import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { count, data, onChange } = props;
  return (
    <View className="community_buyCard_box">
      <View className="community_buyCard_shopInfo">
        <View className="community_buyCard_profile"></View>
        <View className="community_buyCard_content">
          <View className="community_buyCard_name font_noHide">
            露天美早樱桃（5斤装）
          </View>
          <View className="community_buyCard_price">
            <Text className="color3 font20">¥</Text>
            <Text className="color3 font32">98</Text> 
            <Text className="color2 font20 text_through">  ¥288</Text>
          </View>
          <View className="community_buyCard_count">限购5件</View>
        </View>
      </View>
      <View className="community_buyCard_order">已团986</View>
      <View className="community_buyCard_collection">
        <View
          className="community_buyCard_icon community_buyCard_remove"
          onClick={() => onChange("remove")}
        ></View>
        <View className="community_buyCard_text">{count}</View>
        <View
          className="community_buyCard_icon community_buyCard_add"
          onClick={() => onChange("add")}
        ></View>
      </View>
    </View>
  );
};
