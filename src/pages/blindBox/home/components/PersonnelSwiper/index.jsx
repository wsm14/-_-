import React from "react";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";

/**
 * 获奖信息滚动横幅
 */
export default ({ list }) => {
  return (
    <Swiper autoplay vertical circular className="PersonnelSwiper">
      {list.map((item) => {
        const { barrageDesc, username, userProfile } = item;

        return (
          <SwiperItem style={{ width: "100%", height: "100%" }}>
            <View className="personnelSwiper_cell">
              <Image src={userProfile} className="ps_sw_head"></Image>
              <View className="ps_sw_info font_hide">
                恭喜 {username} {barrageDesc}
              </View>
            </View>
          </SwiperItem>
        );
      })}
    </Swiper>
  );
};
