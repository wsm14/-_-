import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import Router from "@/utils/router";
import "./index.scss";
export default () => {
  const list = [
    {
      icon: "beanEducation_icon_box beanEducation_icon1",
      fn: () => {
        Router({
          routerName: "blindIndex",
        });
      },
    },
    {
      icon: "beanEducation_icon_box beanEducation_icon2",
      fn: () => {
        Router({
          routerName: "beanWelfareZone",
          args: {
            mode: "telephoneCharges",
          },
        });
      },
    },
    {
      icon: "beanEducation_icon_box beanEducation_icon3",
      fn: () => {
        Router({
          routerName: "beanWelfareZone",
          args: {
            mode: "commerceGoods",
          },
        });
      },
    },
    {
      icon: "beanEducation_icon_box beanEducation_icon4",
      fn: () => {
        Router({
          routerName: "beanWelfareZone",
          args: {
            mode: "beanWelfare",
          },
        });
      },
    },
  ];
  return (
    <View className="beanEducation_box">
      {list.map((item) => {
        return <View className={item.icon} onClick={item.fn}></View>;
      })}
    </View>
  );
};
// 头部卡豆显示区域
