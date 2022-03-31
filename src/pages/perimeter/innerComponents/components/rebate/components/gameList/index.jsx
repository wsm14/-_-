import React, { useState, useEffect } from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import Waterfall from "@/components/waterfall";
import { template, templateGame } from "@/components/public_ui/newGoodsObj";
import Taro from "@tarojs/taro";

export default ({ list = [], configUserLevelInfo = {}, identification }) => {
  if (list.length === 0) {
    return null;
  } else {
    return (
      <View className="rebate_shop_content">
        <View className="rebate_game"></View>
        <Waterfall
          list={list}
          createDom={(item) =>
            templateGame(item, configUserLevelInfo, identification)
          }
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
      </View>
    );
  }
};
