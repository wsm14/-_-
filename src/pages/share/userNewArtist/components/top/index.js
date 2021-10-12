import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { toast } from "@/common/utils";
import Router from "@/common/router";
export default (props) => {
  const { newUserBean = "1", newUserFlag, saveBean } = props;
  if (newUserFlag === "1") {
    return (
      <View className="userNewArtist_topCard">
        <View className="userNewArtist_font2 public_center">
          <View className="userNewArtist_bean_icon"></View>
          <View className="userNewArtist_num_icon"></View>
          <View className="userNewArtist_num">{newUserBean}</View>
        </View>
        <View className="userOwn_bean">
          <Text className="color6">使用</Text>
          <Text className="color14">100卡豆</Text>
          <Text className="color6">消费可抵扣</Text>
          <Text className="color14">1元</Text>
        </View>
        <View
          className="userOwn_btn public_center"
          onClick={() => {
            saveBean();
          }}
        >
          立即领取
        </View>
      </View>
    );
  } else {
    return (
      <View className="userNewArtist_infoCard">
        <View className="userNewArtist_font2 public_center">
          <View className="userNewArtist_bean_icon"></View>
          <View className="userNewArtist_num_icon"></View>
          <View className="userNewArtist_num">{newUserBean}</View>
        </View>
        <View className="userOwn_bean">
          <Text className="color6">使用</Text>
          <Text className="color14">100卡豆</Text>
          <Text className="color6">消费可抵扣</Text>
          <Text className="color14">1元</Text>
        </View>
        <View className="userOwn_toast"></View>
        <View className="userown_btnBox public_auto">
          <View
            className="userown_btn public_center"
            onClick={() =>
              Router({
                routerName: "home",
                type: "switchTab",
              })
            }
          >
            去捡豆
          </View>
          <View
            className="userown_btn public_center"
            onClick={() =>
              Router({
                routerName: "speciaMaterial",
                args: {
                  type: "today",
                },
              })
            }
          >
            去消费
          </View>
        </View>
      </View>
    );
  }
};