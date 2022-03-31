import React, { useState, useEffect } from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import { fetchSecondKillBarrage } from "@/server/common";
import "./index.scss";

export default ({}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getBeanBarrage();
  }, []);

  const getBeanBarrage = () => {
    fetchSecondKillBarrage({ size: 50 }).then((res) => {
      const { limitKillBarrageList = [] } = res;
      setList(limitKillBarrageList);
    });
  };

  return (
    <View className="rebate_barrage_box">
      <View className="rebate_barrage_touchClose"></View>
      <Swiper circular vertical autoplay className="rebate_barrage_autoPlay">
        {list.map((item) => {
          const { barrageDesc, userProfile, username } = item;
          return (
            <SwiperItem>
              <View className="rebate_barrage_content">
                <View
                  className="rebate_barrage_profile "
                  style={{
                    backgroundImage: `url(${userProfile})`,
                  }}
                ></View>
                <View className="rebate_barrage_font font_hide">
                  {username + barrageDesc}
                </View>
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
};
