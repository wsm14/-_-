import React, { Component, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { computedBeanPrice, computedPrice } from "@/common/utils";
import classNames from "classnames";
import Router from "@/common/router";
import "./index.scss";
export default (props) => {
  const { data, configUserLevelInfo, visible, status, close } = props;
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const { realPrice, userBean = 0, buyPrice } = data;
  if (visible) {
    return (
      <View
        className="wares_box"
        onClick={() => {
          close();
        }}
        catchMove
      >
        <View
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="wares_up_to"
        >
          <View className="wares_up_close" onClick={() => close()}></View>
          <View className="wares_up_title">卡豆抵扣明细</View>
          <View className="wares_up_mx">
            <View className="wares_up_mxBox wares_up_mxBoxStyle1">
              <View className="wares_up_price">
                ¥{computedBeanPrice(realPrice || buyPrice, payBeanCommission)}
              </View>
              <View className="wares_up_toast">到手价</View>
            </View>
            <View className="bold font24"> = </View>
            <View className="wares_up_mxBox wares_up_mxBoxStyle2">
              <View className="wares_up_price">¥{realPrice || buyPrice}</View>
              <View className="wares_up_toast">当前优惠价</View>
            </View>
            <View className="bold font24"> - </View>
            <View className="wares_up_mxBox wares_up_mxBoxStyle2">
              <View className="wares_up_getPrice">
                ¥{computedPrice(realPrice || buyPrice, payBeanCommission)}
              </View>
              <View className="wares_up_scale">
                卡豆抵扣<Text className="color3">{payBeanCommission}%</Text>
              </View>
              <View className="wares_up_bean">
                (
                {parseInt(
                  computedPrice(realPrice || buyPrice, payBeanCommission) * 100
                )}
                卡豆)
              </View>
            </View>
          </View>
          <View className="wares_up_yue">卡豆余额</View>
          <View className="wares_up_card">
            <Text className="color1">当前钱包剩余 </Text>
            <Text className="color3">{userBean}卡豆</Text>
            <Text className="color1">，消费可抵扣 </Text>
            <Text className="color3">{(userBean / 100).toFixed(2)}元</Text>
          </View>
          {computedPrice(realPrice || buyPrice, payBeanCommission) * 100 <
            userBean || status !== "1" ? null : (
            <View
              onClick={() => {
                close(() =>
                  Router({
                    routerName: "nearVideo",
                    args: {
                      type: "goods",
                    },
                  })
                );
              }}
              className="wares_up_btn  public_center"
            >
              卡豆不足？立即领豆
            </View>
          )}
        </View>
      </View>
    );
  } else {
    return null;
  }
};
