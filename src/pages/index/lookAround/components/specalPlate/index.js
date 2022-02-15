import React, { useMemo } from "react";
import Taro from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import Template from "./../hotTemplate";
import classNames from "classnames";
import Router from "@/utils/router";
import Tarking from "@/components/tracking";
export default ({ data = [], list = [], userInfo = {}, linkTo }) => {
  const { shareCommission = 0 } = userInfo;
  const memo = useMemo(() => {
    return (
      <React.Fragment>
        <View className="lookAround_specalPlate_box public_auto">
          <Tarking name={"limitedTimeAndExplosive_time"}>
            <View
              onClick={() =>
                Router({
                  routerName: "specialOffer",
                })
              }
              className={classNames(
                "lookAround_specalPlate_time lookAround_new_height"
              )}
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
                    return (
                      <Template
                        type={"ms"}
                        userInfo={userInfo}
                        data={item}
                      ></Template>
                    );
                  }
                })}
              </View>
            </View>
          </Tarking>
          <Tarking name={"limitedTimeAndExplosive_hot"}>
            <View
              className={classNames(
                "lookAround_specalPlate_hot lookAround_tall_info lookAround_new_height"
              )}
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
          </Tarking>
        </View>
      </React.Fragment>
    );
  }, [data, list, userInfo]);
  return memo;
};
