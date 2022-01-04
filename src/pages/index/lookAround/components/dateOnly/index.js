import React, { useMemo } from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import Template from "./../hotTemplate";
import Router from "@/utils/router";
import Taro from "@tarojs/taro";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const { shareCommission = 0 } = userInfo;
  const memo = useMemo(() => {
    return (
      <View
        onClick={() =>
          Router({
            routerName: "specialOffer",
          })
        }
        className="lookAround_specalPlate_box lookAround_specalPlate_hotOnly"
      >
        <View className="lookAround_specalPlate_view public_auto">
          <View className="lookAround_specalPlate_topBox">
            <View className="lookAround_specalPlate_title  lookAround_specalPlate_titleIcon1"></View>
            <View className="lookAround_specalPlate_link"></View>
          </View>
        </View>
        <View className="lookAround_only_content">
          {data.map((item, index) => {
            if (index < 3) {
              return (
                <View
                  style={{
                    marginRight: index !== 2 ? Taro.pxTransform(15) : 0,
                  }}
                  className="lookAround_specalPlate_swiper1 lookAround_template_specal2"
                >
                  <Template
                    title={"秒杀价:"}
                    userInfo={userInfo}
                    data={item}
                  ></Template>
                </View>
              );
            }
          })}
        </View>
      </View>
    );
  }, [data, userInfo]);
  return memo;
};
