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
    userMerchantIdString,
  } = item;
  return (
    <View
      className="list_shop_box"
      onClick={() =>
        Router({
          routerName: "merchantDetails",
          args: {
            merchantId: userMerchantIdString,
          },
        })
      }
    >
      <View
        className="list_shop_mapTo"
        onClick={(e) => {
          e.stopPropagation();
          mapGo({
            lat: lat,
            lnt: lnt,
            address,
            merchantName,
          });
        }}
      ></View>
      <View className="list_shop_detailsBox">
        <View className="list_shop_img" style={backgroundObj(coverImg)}></View>
        <View className="list_shop_font">
          <View className="list_shop_merchantName font_hide">
            {merchantName}
          </View>
          <View className="list_shop_bussionTime">
            {businessTime && (
              <View className="bussionTime_tag">
                <Text className="font22 bold color9">营业时间</Text>
                <Text className="bussionTime_liner bussionTime_margin"></Text>
                <Text className="bussionTime_margin font22 bold  color9">
                  {businessTime}
                </Text>
              </View>
            )}
            <View className="list_shop_peoplePay">
              人均￥{perCapitaConsumption}
            </View>
          </View>

          <View className="list_shop_address">
            <View className="list_shop_addressFont font_hide">
              {" "}
              {categoryName + " " + address}
            </View>
            <View className="list_shop_limit">
              {GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
        </View>
      </View>
      <View className="list_shop_liner"></View>
    </View>
  );
};
