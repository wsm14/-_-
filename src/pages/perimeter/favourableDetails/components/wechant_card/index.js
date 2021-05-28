import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Button, Text, View, Image } from "@tarojs/components";
import "./index.scss";

export default () => {
  return (
    <View className="card_box">
      <View className="card_details">
        <View className="card_logo">
          <Image
            src={
              "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon553.png"
            }
            style={{
              width: "100%",
              height: "100%",
              border: "8px",
            }}
            lazyLoad
          ></Image>
        </View>
        <View className="card_wechant_help">
          <View className="card_details_title color1">哒卡乐微信助手</View>
          <View className="card_details_content">
            专属福利｜精选福利｜活动信息
          </View>
        </View>
      </View>
      <View className="card_btn public_center">
        点我添加
        <Button
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
          }}
          openType={"contact"}
        ></Button>
      </View>
    </View>
  );
};
