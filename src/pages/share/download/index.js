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
        <View className="download_content_Image">
          <View className="download_content_height"></View>
          <View
            className="download_content_imageUrl"
            onClick={() => this.setClipboard("哒卡乐")}
          ></View>
          <View
            className="download_content_imageCopy"
            onClick={() =>
              this.setClipboard(
                "https://web-new.dakale.net/product/page/registerDownload/registration.html"
              )
            }
          ></View>
        </View>
      </View>
    );
  }
}
export default Index;
