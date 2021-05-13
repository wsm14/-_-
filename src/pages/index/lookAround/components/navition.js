import React from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { navigateTo } from "@/common/utils";
import { login, authGeography, scanCode, mapTx } from "@/common/authority";
import "./../index.scss";
export default (props) => {
  const { city } = props;

  return (
    <View className="lookAround_navition_box">
      <View
        className="lookAround_navition_left"
        onClick={(e) => {
          e.stopPropagation();
          navigateTo("/pages/perimeter/city/index");
        }}
      >
        <View className="lookAround_nation_cityIcon"></View>
        <View className="lookAround_nation_city font_hide">{city}</View>
        <View className="lookAround_nation_citySelect"></View>
      </View>
      <View
        className="lookAround_navition_center"
        onClick={() => navigateTo("/pages/perimeter/search_shop/index")}
      >
        搜你想搜
      </View>
      <View className="lookAround_navition_right">
        <View
          className="lookAround_navition_lookCard"
          onClick={() => navigateTo("/pages/share/download/index")}
        ></View>
        <View
          className="lookAround_navition_scanCode"
          onClick={() => scanCode()}
        ></View>
      </View>
    </View>
  );
};
