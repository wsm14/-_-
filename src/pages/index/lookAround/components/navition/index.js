import React from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { scanCode } from "@/common/authority";
import "./index.scss";
import Router from "@/utils/router";
//逛逛顶部导航栏
export default (props) => {
  const { city } = props;
  return (
    <View className="lookAround_navition_box">
      <View
        className="lookAround_navition_left"
        onClick={(e) => {
          e.stopPropagation();
          Router({
            routerName: "city",
          });
        }}
      >
        <View className="lookAround_nation_cityIcon"></View>
        <View className="lookAround_nation_city font_hide">{city}</View>
        <View className="lookAround_nation_citySelect"></View>
      </View>
      <View
        className="lookAround_navition_center"
        onClick={() =>
          Router({
            routerName: "search_shop",
          })
        }
      >
        搜索附近吃喝玩乐～
      </View>
      <View className="lookAround_navition_right">
        <View
          className="lookAround_navition_scanCode"
          onClick={() => scanCode()}
        ></View>
      </View>
    </View>
  );
};
