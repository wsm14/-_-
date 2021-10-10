import React from "react";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";

/**
 * 获奖信息滚动横幅
 */
export default ({ list }) => {
  return (
    <Swiper autoplay vertical circular className="PersonnelSwiper">
      <SwiperItem>
        {list.map((item) => {
          const { barrageDesc, username, userProfile } = item;
          return (
            <View className="personnelSwiper_cell">
              <Image src={userProfile} className="ps_sw_head"></Image>
              <View className="ps_sw_info">
                恭喜 {username} {barrageDesc}
              </View>
            </View>
          );
        })}
      </SwiperItem>
    </Swiper>
  );
};
