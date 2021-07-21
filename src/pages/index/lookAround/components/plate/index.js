import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj } from "@/common/utils";
import Taro from "@tarojs/taro";
import { template } from "@/components/specalTemplate";
import Router from "@/common/router";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const { levelKey = "normal" } = userInfo;
  const normalList = [
    {
      coverImg:
        "https://wechat-config.dakale.net/miniprogram/image/icon658.png",
      fn: () => {
        Router({
          routerName: "publicTypeGoods",
          args: {
            type: "dayPush",
            title: "小豆精选",
            bannerType: "beanSelection",
          },
        });
      },
    },
    {
      coverImg:
        "https://wechat-config.dakale.net/miniprogram/image/icon659.png",
      fn: () => {
        Router({
          routerName: "publicTypeGoods",
          args: {
            type: "todayNew",
            title: "今日上新",
          },
        });
      },
    },
    {
      coverImg:
        "https://wechat-config.dakale.net/miniprogram/image/icon660.png",
      fn: () => {
        Router({
          routerName: "download",
          args: {
            type: "todayNew",
            title: "今日上新",
          },
        });
      },
    },
  ];
  const kolList = [
    {
      coverImg:
        "https://wechat-config.dakale.net/miniprogram/image/icon661.png",
      fn: () => {
        Router({
          routerName: "publicTypeGoods",
          args: {
            type: "dayPush",
            title: "每日必推",
          },
        });
      },
    },
    {
      coverImg:
        "https://wechat-config.dakale.net/miniprogram/image/icon662.png",
      fn: () => {
        Router({
          routerName: "publicTypeGoods",
          args: {
            type: "todayNew",
            title: "今日上新",
          },
        });
      },
    },
    {
      coverImg:
        "https://wechat-config.dakale.net/miniprogram/image/icon663.png",
      fn: () => {
        Router({
          routerName: "gradeGood",
          args: {
            type: "highCommission",
            title: "高佣联盟",
            body: "好货精选",
          },
        });
      },
    },
  ];
  const memo = useMemo(() => {
    return (
      <View className="lookAround_active_box public_auto">
        {levelKey === "normal"
          ? normalList.map((item) => {
              const { fn, coverImg } = item;
              return (
                <View onClick={() => fn()} className="lookAround_active_card">
                  <Image
                    lazyLoad
                    src={coverImg}
                    className="lookAround_active_image"
                  ></Image>
                </View>
              );
            })
          : kolList.map((item) => {
              const { fn, coverImg } = item;
              return (
                <View onClick={() => fn()} className="lookAround_active_card">
                  <Image
                    lazyLoad
                    src={coverImg}
                    className="lookAround_active_image"
                  ></Image>
                </View>
              );
            })}
      </View>
    );
  }, [levelKey]);
  return memo;
};
