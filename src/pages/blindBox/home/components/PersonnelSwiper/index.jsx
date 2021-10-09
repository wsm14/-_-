import React from "react";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";

/**
 * 获奖信息滚动横幅
 */
export default () => {
  return (
    <Swiper autoplay vertical circular className="PersonnelSwiper">
      <SwiperItem>
        <View className="personnelSwiper_cell">
          <Image
            src={
              "https://wechat-config.dakale.net/miniprogram/blind/home/home_head.png"
            }
            className="ps_sw_head"
          ></Image>
          <View className="ps_sw_info">恭喜 用****户 刚刚抽中100卡豆</View>
        </View>
      </SwiperItem>
    </Swiper>
  );
};
