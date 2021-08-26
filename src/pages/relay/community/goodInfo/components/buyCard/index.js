import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { backgroundObj } from "@/common/utils";
export default (props) => {
  const { count, data, onChange } = props;
  const { communityOrganizationGoodsList = [] } = data;
  const shopCollect = (item) => {
    const {
      buyRule = "unlimited",
      limitContent,
      goodsName,
      goodsImg,
      price,
      buyCount,
    } = item;
    return (
      <View className="community_buyCard_box">
        <View className="community_buyCard_shopInfo">
          <View
            className="community_buyCard_profile"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="community_buyCard_content">
            <View className="community_buyCard_name font_noHide">
              {goodsName}
            </View>
            <View className="community_buyCard_price">
              <Text className="color3 font20">¥</Text>
              <Text className="color3 font32">{price}</Text>
            </View>
            {buyRule === "personLimit" && (
              <View className="community_buyCard_count">
                限购{limitContent}件
              </View>
            )}
          </View>
        </View>
        <View className="community_buyCard_order">已团{buyCount}</View>
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

  return (
    <View>
      {communityOrganizationGoodsList.map((item) => {
        return shopCollect(item);
      })}
    </View>
  );
};
