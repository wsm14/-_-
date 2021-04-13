import React, { useEffect, useState, useMemo } from "react";
import { View, Swiper, SwiperItem, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import "./../index.scss";
export default ({ data = [] }) => {
  const [count, setCount] = useState(1);
  const expensive = useMemo(() => {
    return (
      <View className="home_barrage">
        <Swiper
          vertical
          autoplay
          onChange={(e) => {
            const {
              detail: { current },
            } = e;
            setCount(current + 1);
          }}
          displayMultipleItems={2}
          // nextMargin={Taro.pxTransform("52px")}
          style={{ width: "100%", height: "100%" }}
        >
          {data.map((item, index) => {
            const { barrageDesc, userProfile, username } = item;
            return (
              <SwiperItem className="home_barrage_item">
                <View
                  className={classNames(
                    "home_barrage_box",
                    count === index && "home_barrage_count"
                  )}
                >
                  <View className="home_barrage_useProfile">
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                      lazyLoad
                      src={userProfile}
                    />
                  </View>
                  <View className="home_barrage_font font_hide">
                    {username + barrageDesc}
                  </View>
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
        <View className="home-barrage_layer"></View>
      </View>
    );
  }, [data,count]);
  return (expensive)
};
