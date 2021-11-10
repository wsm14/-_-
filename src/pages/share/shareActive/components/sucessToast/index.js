import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./index.scss";
export default ({ data, close }) => {
  const { prizeType, prizeBean } = data;
  const templateFont = {
    bean: (
      <View>
        <Text className="color3">{prizeBean}卡豆</Text>已自动发放至 【我的钱包】
      </View>
    ),
    KAGoods: "请到【我的】-【我的券包】查看",
    rightGoods: "兑换券码已通过短信发送至该账号绑定手机号上",
  }[prizeType];

  const templateImg = {
    bean: (
      <View className="sucessToast_goods_img sucessToast_goods_imgStyle2"></View>
    ),
    KAGoods: (
      <View className="sucessToast_goods_img sucessToast_goods_imgStyle2"></View>
    ),
    rightGoods: (
      <View className="sucessToast_goods_img sucessToast_goods_imgStyle1"></View>
    ),
  }[prizeType];
  const templateLinerFont = {
    bean: (
      <View className="sucessToast_liner_font1">另有惊喜福利 享首单立减</View>
    ),
    KAGoods: (
      <View className="sucessToast_liner_font">
        {" "}
        免费获得抽盲盒机会 动动手指0元领取IPhone13
      </View>
    ),
    rightGoods: (
      <View className="sucessToast_liner_font">
        免费获得抽盲盒机会 动动手指0元领取IPhone13
      </View>
    ),
  }[prizeType];
  const templateBtn = {
    bean: (
      <View className="sucessToast_liner_btnBox public_auto">
        <View
          className="sucessToast_btn public_center"
          onClick={() => {
            close &&
              close(() => {
                Router({
                  routerName: "wallet",
                });
              });
          }}
        >
          去查看
        </View>
        <View
          className="sucessToast_btn public_center"
          onClick={() => {
            close &&
              close(() => {
                Router({
                  routerName: "blindIndex",
                });
              });
          }}
        >
          立即领取
        </View>
      </View>
    ),
    KAGoods: (
      <View className="sucessToast_liner_btnBox public_auto">
        <View
          className="sucessToast_btn public_center"
          onClick={() => {
            close &&
              close(() => {
                Router({
                  routerName: "wraparound",
                });
              });
          }}
        >
          查看券包
        </View>
        <View
          onClick={() => {
            close &&
              close(() => {
                Router({
                  routerName: "blindIndex",
                });
              });
          }}
          className="sucessToast_btn public_center"
        >
          抽盲盒
        </View>
      </View>
    ),
    rightGoods: (
      <View className="sucessToast_liner_btnBox public_auto">
        <View
          onClick={() => {
            close &&
              close(() => {
                Router({
                  routerName: "wraparound",
                });
              });
          }}
          className="sucessToast_btn public_center"
        >
          查看券包
        </View>
        <View
          onClick={() => {
            close &&
              close(() => {
                Router({
                  routerName: "blindIndex",
                });
              });
          }}
          className="sucessToast_btn public_center"
        >
          抽盲盒
        </View>
      </View>
    ),
  }[prizeType];
  return (
    <View className="sucessToast_img">
      <View className="sucessToast_urlLink">{templateFont}</View>
      {templateImg}
      {templateLinerFont}
      {templateBtn}
    </View>
  );
};
