import React, { useEffect, useState } from "react";
import { View, Text, Image, RichText } from "@tarojs/components";
import { backgroundObj, filterStrList } from "@/utils/utils";
import Taro from "@tarojs/taro";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  const { togetherEarnGoodsObject = {} } = data;
  const { richText } = togetherEarnGoodsObject;
  if (richText) {
    return (
      <View className="collageTime_shopDesc_box">
        <View className="collageTime_shopDesc_title">
          <View className="collageTime_desc_linerLeft"></View>
          <View className="collageTime_desc_titleDont">商品详情</View>
          <View className="collageTime_desc_linerRight"></View>
        </View>
        <View className="collageTime_desc_bg">
          <RichText nodes={richText}></RichText>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
