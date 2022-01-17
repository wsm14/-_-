import React, { useState, useEffect } from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import { fetchSpecialBarrage } from "@/server/common";
import "./index.scss";

export default ({}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getBeanBarrage();
  }, []);

  const getBeanBarrage = () => {
    fetchSpecialBarrage({ size: 50 }, (res) => {
      const { phoneBillBarrageList = [] } = res;
      setList(phoneBillBarrageList);
    });
  };

  return (
    <View className="friendScene_barrage_box">
      <View className="friendScene_barrage_touchClose"></View>
      <Swiper
        circular
        vertical
        autoplay
        className="friendScene_barrage_autoPlay"
      >
        {list.map((item) => {
          const { barrageDesc, userProfile, username } = item;
          return (
            <SwiperItem>
              <View className="friendScene_barrage_content">
                <View
                  className="friendScene_barrage_profile"
                  style={{
                    backgroundImage: `url(${userProfile})`,
                  }}
                ></View>
                <View className="friendScene_barrage_font">
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
