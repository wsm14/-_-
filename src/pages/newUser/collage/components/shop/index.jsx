import React, { useEffect, useState, useRef } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import { fakeStartGroup } from "@/server/user";
import { toast, backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
export default ({ type = 0, data }) => {
  const {
    togetherGroupConfigId,
    joinUserNum,
    status,
    startGroupNum,
    togetherEarnGoodsObject = {},
    togetherGroupRuleObject = {},
    groupId,
    togetherRebateParamObject = {},
    rewardType,
  } = data;
  const {
    goodsIdString,
    ownerIdString,
    goodsType,
    goodsName,
    goodsImg,
    oriPrice,
    togetherPrice,
    costPrice,
    goodsDesc,
    goodsDescImg,
  } = togetherEarnGoodsObject;
  const { notWinFee, teamLeaderFee } = togetherRebateParamObject;
  const template = () => {
    return (
      <View className="collage_shop_content font_hide">
        <View
          style={backgroundObj(goodsImg)}
          className="collage_shop_profile"
        ></View>
        <View className="collage_shop_right">
          <View className="collage_shop_title font_hide">{goodsName}</View>
          <View className="collage_shop_price">
            <Text className="color1 font20">拼团价:</Text>
            <Text className="color3 font28">¥{togetherPrice}</Text>
            <Text className="color2 font20"> 原价:</Text>
            <Text className="color2 font24 text_through">¥{oriPrice}</Text>
          </View>
          <View className="collage_shop_tagsBox">
            <View className="collage_shop_tag collage_shop_tagStyle1 public_center">
              开团返佣{teamLeaderFee}元
            </View>
            <View className="collage_shop_tag collage_shop_tagStyle2 public_center">
              参与红包{notWinFee}元
            </View>
          </View>
        </View>
      </View>
    );
  };
  const bottom = {
    0: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox public_auto">
          <View className="collage_bottom_left">
            10人成团 | {startGroupNum}人开团中
          </View>
          <View
            className="collage_bottom_open"
            onClick={() => {
              fakeStartGroup({
                togetherGroupConfigId,
              });
              Router({
                routerName: "download",
              });
            }}
          >
            开团
          </View>
        </View>
      </View>
    ),
    1: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_stepBox">
          <View className="collage_shop_step">
            <View className="collage_shop_stepContent"></View>
          </View>
          <View className="collage_shop_stepFont">
            <Text className="color1">{joinUserNum}</Text>/10
          </View>
        </View>
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox public_auto">
          <View className="collage_bottom_left">
            等待成团 | 5小时24分32秒后结束
          </View>
          <View className="collage_bottom_right">邀请好友</View>
        </View>
      </View>
    ),
    2: (
      <View className="collage_shop_bottom">
        <View className="collage_shop_stepBox">
          <View className="collage_shop_step">
            <View className="collage_shop_stepContent"></View>
          </View>
          <View className="collage_shop_stepFont">
            <Text className="color1">6</Text>/10
          </View>
        </View>
        <View className="collage_shop_liner"></View>
        <View className="collage_shop_btnBox">
          <View className="collage_bottom_left">
            等待成团 | 5小时24分32秒后结束
          </View>
        </View>
      </View>
    ),
  }[type];
  return (
    <View className="collage_shop_box">
      {template()}
      {bottom}
    </View>
  );
};
