import React, { useMemo } from "react";
import { View, Image } from "@tarojs/components";

import Router from "@/utils/router";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const normalList = [
    {
      coverImg:
        "https://wechat-config.dakale.net/miniprogram/image/icon707.png",
      fn: () => {
        Router({
          routerName: "perimeterShops",
        });
      },
    },
    {
      coverImg:
        "https://wechat-config.dakale.net/miniprogram/image/icon708.png",
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
        "https://wechat-config.dakale.net/miniprogram/image/icon709.png",
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
  ];

  const memo = useMemo(() => {
    return (
      <View className="lookAround_active_box public_auto">
        {normalList.map((item) => {
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
  }, []);
  return memo;
};
