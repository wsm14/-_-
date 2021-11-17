import React, { useMemo } from "react";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import Template from "./../hotTemplate";
import classNames from "classnames";
import { backgroundObj } from "@/common/utils";
import "./index.scss";
import Router from "@/common/router";
import Taro from "@tarojs/taro";
export default ({ data = [], userInfo = {}, type = "self" }) => {
  const { shareCommission = 0 } = userInfo;
  const memo = useMemo(() => {
    return (
      <View className="lookAround_selfourOnly_box">
        <View
          className="lookAround_selfourOnly_view"
          onClick={() => {
            Router({
              routerName: "preSelfour",
              args: {
                specialFilterType:
                  type === "self" ? "selfTour" : "newProductRecommend",
              },
            });
          }}
        >
          <View className="lookAround_selfourOnly_topBox">
            <View
              className={`lookAround_selfourOnly_title ${
                type === "self"
                  ? "lookAround_selfourOnly_icon1"
                  : "lookAround_selfourOnly_icon2"
              }`}
            ></View>
            <View className="lookAround_selfourOnly_link">更多</View>
          </View>
          <View
            className="lookAround_selfourOnly_father"
            style={{ position: "relative", display: "flex" }}
          >
            {data.map((item, index) => {
              if (index < 3) {
                return (
                  <View
                    style={{
                      marginRight: index !== 2 ? Taro.pxTransform(15) : 0,
                    }}
                    className="lookAround_selfourOnly_swiper1"
                  >
                    <Template
                      show={false}
                      title={type === "self" ? "福利价:" : "尝鲜价:"}
                      type="fl"
                      data={item}
                      gameFlag={true}
                      userInfo={userInfo}
                    ></Template>
                  </View>
                );
              }
              return null;
            })}
          </View>
        </View>
      </View>
    );
  }, [data, userInfo]);
  return memo;
};
