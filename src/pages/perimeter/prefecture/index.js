import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import { toast } from "@/common/utils";
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    return (
      <View className="prefecture_box">
        <View className="prefecture_bg_title">
          <Image
            className="prefecture_image"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/image/icon771.png"
            }
          ></Image>
        </View>
        <View className="prefecture_bg_desc">
          <Image
            className="prefecture_image"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/image/icon772.png"
            }
          ></Image>
        </View>
        <View className="prefecture_content"></View>
        <View className="prefecture_bg_logo">
          <Image
            className="prefecture_image"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/active/8.8/active8_8_21.png"
            }
          ></Image>
        </View>
      </View>
    );
  }
}
export default Index;
