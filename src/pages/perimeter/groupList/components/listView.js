import React, { useState, useMemo } from "react";
import { View, Button, Image, Text } from "@tarojs/components";
import {
  getLat,
  getLnt,
  GetDistance,
  backgroundObj,
  loginStatus,
  mapGo,
} from "@/common/utils";
import Router from "@/common/router";
import "./../index.scss";
export const list = (item, index) => {
  const {
    businessStatus,
    businessTime,
    categoryName,
    coverImg,
    districtName,
    merchantId,
    lat,
    lnt,
    merchantName,
    perCapitaConsumption,
    address = "",
  } = item;
  return (
    <View className="list_box">
      <View className="list_descBox">
        <View
          className="list_image dakale_nullImage"
          style={backgroundObj(coverImg)}
        ></View>
        <View className="list_font_box">
          <View className="list_font_title font_hide">{merchantName}</View>
          <View className="list_font_type  font_hide">
            {GetDistance(getLat(), getLnt(), lat, lnt)}｜{districtName}｜
            {categoryName}｜人均￥{perCapitaConsumption}
          </View>
          <View className="list_font_bottom font_hide">
            {businessStatus === "1" ? (
              <Text className="color1">营业中</Text>
            ) : (
              "暂停营业"
            )}{" "}
            ｜{businessTime}
          </View>
        </View>
      </View>
      <View className="list_bottom">
        <View className="list_bottom">
          <View className="list_bottom_left">
            {loginStatus() ? (
              <Button
                style={{ width: "100%", height: "100%", background: "none" }}
                openType="share"
                data-index={index}
              >
                {" "}
              </Button>
            ) : (
              <View
                style={{ width: "100%", height: "100%", background: "none" }}
                onClick={() => {
                  Router({ routerName: "login" });
                }}
              >
                {" "}
              </View>
            )}
          </View>

          <View
            className="list_bottom_right"
            onClick={() =>
              mapGo({
                lat,
                lnt,
                address,
                name: merchantName,
              })
            }
          >
            <View className="list_bottom_rightIcon"></View>
            <View className="list_bottom_rightFont">导航</View>
          </View>
        </View>
      </View>
    </View>
  );
};
