import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Swiper,
  SwiperItem,
} from "@tarojs/components";
import Template from "./../hotTemplate";
import Router from "@/common/router";
export default ({ data = [], list = [], userInfo = {}, linkTo }) => {
  const memo = useMemo(() => {
    return (
      <View className="lookAround_specalPlate_box public_auto">
        <View
          onClick={() =>
            Router({
              routerName: "specialOffer",
            })
          }
          className="lookAround_specalPlate_time"
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
        <View
          className="lookAround_specalPlate_hot"
          style={{ border: "1px solid #e5e5e5;" }}
          onClick={() =>
            Router({
              routerName: "speciaMaterial",
              args: {
                type: "today",
              },
            })
          }
        >
          <View className="lookAround_specalPlate_view">
            <View className="lookAround_specalPlate_topBox">
              <View className="lookAround_specalPlate_title  lookAround_specalPlate_titleIcon2"></View>
              <View className="lookAround_specalPlate_link"></View>
            </View>
            <View style={{ position: "relative" }}>
              <Swiper
                circular
                autoplay
                className="lookAround_specalPlate_swiper"
              >
                {list.map((item) => {
                  return (
                    <SwiperItem>
                      <Template
                        userInfo={userInfo}
                        data={item}
                        title={"福利价:"}
                      ></Template>
                    </SwiperItem>
                  );
                })}
              </Swiper>
              <View className="lookAround_absolute"></View>
            </View>
          </View>
        </View>
      </View>
    );
  }, [data, list, userInfo]);
  return memo;
};
