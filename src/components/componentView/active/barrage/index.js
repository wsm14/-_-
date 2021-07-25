import React from "react";
import Taro from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";
export default ({ list = [1, 1, 1, 1, 1, 1, 1, 1, 1] }) => {
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
          return (
            <SwiperItem>
              <View className="friendScene_barrage_content">
                <View className="friendScene_barrage_profile"></View>
                <View className="friendScene_barrage_font">
                  恭喜XXX获得了XXX卡豆。
                </View>
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
};
