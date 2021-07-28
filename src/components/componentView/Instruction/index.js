/*
店铺详情优惠券公共样式

*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { shopCard } from "@/components/publicShopStyle";
import Router from "@/common/router";
import "./index.scss";
export const Instruction = () => {
  return (
    <View className="shopdetails_shop_player">
      <View className="shopdetails_play_title">使用方法</View>
      <View className="shopdetails_play_img"></View>
    </View>
  );
};
export const merchantSet = (data) => {
  const { merchantCount, specialActivityIdString, ownerType } = data;
  return (
    <View className="shopdetails_shop_merchantShop">
      {shopCard(this, data)}
      {ownerType === "group" &&  (
        <View
          className="shopdetails_group"
          onClick={() =>
            Router({
              routerName: "groupList",
              args: {
                specialActivityId: specialActivityIdString,
              },
            })
          }
        >
          查看全部{merchantCount}家适用商家{" >"}
        </View>
      )}
    </View>
  );
};
