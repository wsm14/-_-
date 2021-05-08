import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import "./index.scss";
import { toast } from "@/common/utils";
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
  }
  setClipboard() {
    Taro.setClipboardData({
      data:
        "https://web-new.dakale.net/product/page/registerDownload/registration.html",
      success: function (res) {
        toast("复制成功请打开浏览器粘贴下载客户端");
      },
      fail: function (res) {
        toast("复制失败");
      },
    });
  }
  render() {
    return (
      <View className="download_box">
        <View className="download_content_box">
          <View className="download_content_Image"></View>
          <View className="download_content_title1 font28 color1">
            更多周边吃喝玩乐尽在「哒卡乐」
          </View>
          <View className="download_content_title2 public_center">
            <View className="download_content_icon"></View>
            <View
              className="download_content_iconRight font32 bold"
              onClick={() => this.setClipboard()}
            >
              下载「哒卡乐」客户端
            </View>
          </View>
          <View className="download_content_title3 color2 font24">
            点击按钮即可复制下载链接
          </View>
        </View>
      </View>
    );
  }
}
export default Index;

