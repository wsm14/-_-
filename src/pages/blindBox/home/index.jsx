import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import PersonnelSwiper from "./components/PersonnelSwiper";
import BlindContent from "./components/BlindContent";
import BindGetNumber from "./components/BindGetNumber";
import GoodsContent from "./components/GoodsContent";
import Footer from "./components/Footer";
import {
  fetchBlindBoxConfig,
  fetchBlindBoxBarrage,
  fetchBlindBoxRewardJackpot,
} from "@/server/blindBox";
import "./index.scss";
/**
 * 盲盒首页
 */
export default () => {
  const [data, setData] = useState({});
  const [barrage, setBarrage] = useState([]);
  const [jpList, setJpList] = useState([]);
  useEffect(() => {}, []);

  useDidShow(() => {
    dataInit();
    getbarrage();
    getRewardJackpot();
  });
  const getRewardJackpot = () => {
    fetchBlindBoxRewardJackpot().then((val) => {
      const { blindBoxProductObjectList = [] } = val;
      setJpList(blindBoxProductObjectList);
    });
  };
  const dataInit = () => {
    fetchBlindBoxConfig().then((val = {}) => {
      setData(val);
    });
  };
  const getbarrage = () => {
    fetchBlindBoxBarrage({ size: 50 }).then((val) => {
      const { blindBoxBarrageList = [] } = val;
      setBarrage(blindBoxBarrageList);
    });
  };

  return (
    <View className="blind_home">
      {/* 头部 */}
      <View className="blind_home_head">
        <View className="blind_home_share"></View>
        <View className="blind_home_rule"></View>
      </View>
      {/* 获奖信息滚动横幅 */}
      <PersonnelSwiper list={barrage}></PersonnelSwiper>
      {/* 盲盒区域 */}
      <BlindContent
        list={jpList}
        data={data}
        updateInfo={setData}
      ></BlindContent>
      {/* 获取盲盒机会 */}
      <BindGetNumber data={data}></BindGetNumber>
      {/* 购物区域 */}
      <GoodsContent data={data}></GoodsContent>
      {/* 底部logo */}
      <Footer></Footer>
    </View>
  );
};
