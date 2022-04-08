import React, { useEffect, useState, useRef } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import Router from "@/utils/router";
import { toast } from "@/utils/utils";
export default ({ type, startRebate, endRebate }) => {
  const { willRebateFee = 0, accumulativeRebateFee = 0 } = startRebate;
  const { totalWinTimes = 0, totalWinRed = 0 } = endRebate;
  useEffect(() => {}, []);
  const template = {
    0: (
      <>
        <View className="collage_card_left">
          <View className="collage_card_toastInfo">每日08点更新开团商品</View>
        </View>
        <View
          className="collage_card_banner"
          onClick={() =>
            Router({
              routerName: "webView",
              args: {
                link: "https://web-new.dakale.net/product/dakale-web-page/user/page/policy/collageGroup.html",
              },
            })
          }
        ></View>
      </>
    ),
    1: (
      <View
        className="collage_card_contentInfo"
        onClick={() => {
          Router({
            routerName: "moneyWallet",
          });
        }}
      >
        <View className="collageDetail_templateUser_box"></View>
        <View className="collage_card_change">
          <View className="collage_change_title">{willRebateFee}</View>
          <View className="collage_change_label">预计返佣/元</View>
        </View>
        <View className="collage_card_change">
          <View className="collageDetail_templateUser_box"></View>
          <View className="collage_change_title">{accumulativeRebateFee}</View>
          <View className="collage_change_label">累计返佣/元 {">"}</View>
        </View>
        <View className="collage_change_liner"></View>
      </View>
    ),
    2: (
      <View
        className="collage_card_contentInfo"
        onClick={() => {
          Router({
            routerName: "moneyWallet",
          });
        }}
      >
        <View className="collage_card_change">
          <View className="collage_change_title">{totalWinTimes}</View>
          <View className="collage_change_label">拼中次数</View>
        </View>
        <View className="collage_card_change">
          <View className="collage_change_title">{totalWinRed}</View>
          <View className="collage_change_label">拼团红包 {">"}</View>
        </View>
        <View className="collage_change_liner"></View>
      </View>
    ),
  }[type];
  return <View className="collage_card_box">{template}</View>;
};
