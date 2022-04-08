import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { toast } from "@/utils/utils";
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
  }

  setClipboard(val) {
    Taro.setClipboardData({
      data: val,
      success: function (res) {
        toast("复制成功");
      },
      fail: function (res) {
        toast("复制失败");
      },
    });
  }
  render() {
    return (
      <View className="download_box">
        <View className="download_content_imageBg"></View>
        <View
          className="download_content_imageUrl public_center"
          onClick={() => this.setClipboard("哒卡乐")}
        ></View>
        <View
          className="download_content_imageCopy public_center"
          onClick={() =>
            this.setClipboard(
              "https://web-new.dakale.net/product/page/registerDownload/download.html"
            )
          }
        ></View>
      </View>
    );
  }
}
export default Index;
