import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import Barrage from "@/components/componentView/active/barrage";
import { getRestapiAddress, fetchSpecialBarrage } from "@/server/common";
import "./index.scss";
import { backgroundObj } from "@/common/utils";
export default ({}) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    getBeanBarrage();
  }, []);
  const getBeanBarrage = () => {
    fetchSpecialBarrage({ size: 50 }, (res) => {
      const { momentBarrageList = [] } = res;
      setList(momentBarrageList);
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
          const { barrageDesc, userProfile, username, barrageTime } = item;
          return (
            <SwiperItem>
              <View className="friendScene_barrage_content">
                <View
                  className="friendScene_barrage_profile"
                  style={backgroundObj(userProfile)}
                ></View>
                <View className="friendScene_barrage_font">
                  {username + barrageTime + barrageDesc}
                </View>
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
};
