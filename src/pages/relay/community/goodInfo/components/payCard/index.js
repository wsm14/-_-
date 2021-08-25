import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { submit, communityOrganizationGoodsList, count } = props;

  return (
    <View className="community_payCard_box" onClick={() => submit()}>
      <View className="community_payCard_goods">
        <View className="community_payCard_goodsIcon"></View>
        <View className="community_payCard_goodsText">订单</View>
      </View>
      <View className="community_payCard_btn public_center">
        跟团购买 ￥
        {(communityOrganizationGoodsList[0].price * count).toFixed(2)}
      </View>
    </View>
  );
};
