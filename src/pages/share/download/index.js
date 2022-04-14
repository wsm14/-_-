import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
import { toast } from "@/utils/utils";
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
    };
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
    const { current } = this.state;
    return (
      <View className="download_box">
        <Swiper
          circular
          autoplay
          className="download_content_imageBox"
          onChange={(e) => {
            this.setState({
              current: e.detail.current,
            });
          }}
        >
          <SwiperItem style={{ width: "100%", height: "100%" }}>
            <View className="download_content_imageBg1"></View>
          </SwiperItem>
          <SwiperItem style={{ width: "100%", height: "100%" }}>
            <View className="download_content_imageBg2"></View>
          </SwiperItem>
        </Swiper>
        <View className="download_show_near">
          <View
            className={classNames(
              current === 0 ? "download_near_linerTrue" : "download_near_false"
            )}
          ></View>
          <View
            className={classNames(
              current === 1 ? "download_near_linerTrue" : "download_near_false"
            )}
          ></View>
        </View>

        <View
          className="download_content_imageUrl public_center"
          onClick={() =>
            this.setClipboard(
              "https://web-new.dakale.net/product/page/registerDownload/download.html"
            )
          }
        ></View>
        <View
          className="download_content_imageCopy public_center"
          onClick={() => this.setClipboard("哒卡乐")}
        ></View>
      </View>
    );
  }
}
export default Index;
