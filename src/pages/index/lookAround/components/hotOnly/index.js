import React, { useMemo } from "react";
import { View } from "@tarojs/components";
import Template from "./../hotTemplate";
import classNames from "classnames";
import Router from "@/utils/router";
import Tarking from "@/components/tracking";
import Taro from "@tarojs/taro";
export default ({ data = [], userInfo = {} }) => {
  const { shareCommission = 0 } = userInfo;
  const memo = useMemo(() => {
    return (
      <Tarking name="explosive">
        <View className="lookAround_specalPlate_box lookAround_specalPlate_liner">
          <View
            className={classNames(
              "lookAround_specalPlate_date lookAround_new_height"
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
              <View style={{ position: "relative", display: "flex" }}>
                {data.map((item, index) => {
                  if (index < 3) {
                    return (
                      <View
                        style={{
                          marginRight: index !== 2 ? Taro.pxTransform(15) : 0,
                        }}
                        className="lookAround_specalPlate_swiper1"
                      >
                        <Template
                          userInfo={userInfo}
                          data={item}
                          type={"fl"}
                        ></Template>
                      </View>
                    );
                  }
                  return null;
                })}
                <View className="lookAround_absolute"></View>
              </View>
            </View>
          </View>
        </View>
      </Tarking>
    );
  }, [data, userInfo]);
  return memo;
};
