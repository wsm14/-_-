import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./index.scss";
export default ({ close }) => {
  return (
    <View className="errorToast_img">
      <View className="errorToast_urlLink">今日奖品已领完 明日再来</View>
      <View className="errorToast_goods_img errorToast_goods_imgStyle1"></View>
      <View className="errorToast_liner_font1">另有惊喜福利 享首单立减</View>
      <View className="errorToast_liner_btnBox public_auto">
        <View
          onClick={() => {
            close && close();
          }}
          className="errorToast_btn public_center"
        >
          知道了
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
          className="errorToast_btn public_center"
        >
          抽盲盒
        </View>
      </View>
    </View>
  );
};
