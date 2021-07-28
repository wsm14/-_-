import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import Barrage from "@/components/componentView/active/barrage";
import { getRestapiAddress, fetchBeanBarrage } from "@/server/common";
import "./index.scss";
import { backgroundObj } from "@/common/utils";
export default ({}) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    getBeanBarrage();
  }, []);
  const getBeanBarrage = () => {
    fetchBeanBarrage({ size: 50 }, (res) => {
      const { markBarrageList = [] } = res;
      setList(markBarrageList);
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
          const { barrageDesc, userProfile } = item;
          return (
            <SwiperItem>
              <View className="friendScene_barrage_content">
                <View
                  className="friendScene_barrage_profile"
                  style={backgroundObj(userProfile)}
                ></View>
                <View className="friendScene_barrage_font">{barrageDesc}</View>
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
};
