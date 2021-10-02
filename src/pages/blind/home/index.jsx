import React, { useEffect } from "react";
import { View } from "@tarojs/components";
import PersonnelSwiper from "./components/PersonnelSwiper";
import BlindContent from "./components/BlindContent";
import BindGetNumber from "./components/BindGetNumber";
import Footer from "./components/Footer";
import "./index.scss";
/**
 * 盲盒首页
 */
export default () => {
  useEffect(() => {}, []);

  return (
    <View className="blind_home">
      {/* 头部 */}
      <View className="blind_home_head">
        <View className="blind_home_share"></View>
        <View className="blind_home_rule"></View>
      </View>
      {/* 获奖信息滚动横幅 */}
      <PersonnelSwiper></PersonnelSwiper>
      {/* 盲盒区域 */}
      <BlindContent></BlindContent>
      {/* 获取盲盒机会 */}
      <BindGetNumber></BindGetNumber>
      {/* 底部logo */}
      <Footer></Footer>
    </View>
  );
};
