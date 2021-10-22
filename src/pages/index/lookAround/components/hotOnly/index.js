import React, { useMemo } from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import Template from "./../hotTemplate";
import Router from "@/common/router";
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
        className="lookAround_specalPlate_box public_auto"
      >
        <View className="lookAround_specalPlate_view">
          <View className="lookAround_specalPlate_topBox">
            <View className="lookAround_specalPlate_title  lookAround_specalPlate_titleIcon1"></View>
            <View className="lookAround_specalPlate_link"></View>
          </View>
        </View>
        <View className="lookAround_specalPlate_content">
          {data.map((item, index) => {
            if (index < 2) {
              return <Template userInfo={userInfo} data={item}></Template>;
            }
          })}
        </View>
      </View>
    );
  }, [data, userInfo]);
  return memo;
};
