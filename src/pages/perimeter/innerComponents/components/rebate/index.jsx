import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { filterStrList, backgroundObj, toast } from "@/utils/utils";
import Barrage from "./components/Barrage";
import SpecalActive from "./components/specalList";
import SelfActive from "./components/gameList";
import CommerActive from "./components/commerList";
import "./index.scss";
export default ({ data, configUserLevelInfo, identification }) => {
  const { contentInfo } = data;
  const { specialGoods, topImg, selfTourGoods, commerceGoods } = contentInfo;
  return (
    <View className="rebate_interval_box">
      <View className="rebate_interval_bg" style={backgroundObj(topImg)}>
        <View className="rebate_barrage">
          <View className="rebate_barrage_style"></View>
          <Barrage></Barrage>
        </View>
      </View>
      <SpecalActive
        list={specialGoods}
        configUserLevelInfo={configUserLevelInfo}
        identification={identification}
      ></SpecalActive>
      <SelfActive
        list={selfTourGoods}
        configUserLevelInfo={configUserLevelInfo}
        identification={identification}
      ></SelfActive>
      <CommerActive
        list={commerceGoods}
        configUserLevelInfo={configUserLevelInfo}
        identification={identification}
      ></CommerActive>
      <View className="dakale_logo">
        <View className="dakale_logo_image"></View>
      </View>
    </View>
  );
};
