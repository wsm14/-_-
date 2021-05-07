import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import { getShareInfo } from "@/server/common";
import { backgroundObj } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
class Record extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        shareType: "activity",
        subType: "inviteUser",
      },
      userInfo: {},
      selectList: [
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon554.png",
          color: "#EF476F",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon555.png",
          color: "#FCC336",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon556.png",
          color: "#07C0C2",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon557.png",
          color: "#943EA3",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon558.png",
          color: "#0061A8",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/icon559.png",
          color: "#E83D3D",
        },
      ],
    };
  }

  fetchShareInfo() {
    const { httpData } = this.state;
    getShareInfo(httpData, (res) => {
      console.log(res);
    });
  }
  componentDidShow() {
    let userInfo = Taro.getStorageSync("userInfo") || {};
    if (Object.keys(userInfo).length === 0) {
      Router({
        routerName: "login",
      });
    } else {
      this.setState({
        userInfo,
      });
      this.fetchShareInfo();
    }
  }
  render() {
    const { selectList } = this.state;
    return (
      <View className="share_box">
        <Swiper
          previousMargin={Taro.pxTransform(94)}
          circular
          nextMargin={Taro.pxTransform(94)}
          className="share_swiper_box"
        >
          {selectList.map((item) => {
            return (
              <SwiperItem className="share_swiperItem_box">
                <View
                  className="share_swiperItem"
                  style={{
                    background: item.color,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      ...backgroundObj(item.url),
                      borderRadius: 20,
                      position: "relative",
                    }}
                  >
                    <View className="share_swiperItem_code">
                      {/* <Image
                        lazyLoad
                        style={{
                          width: "100%",
                          height: "100%",

                          borderRadius: 20,
                        }}
                        src={}
                      ></Image> */}
                    </View>
                    <View></View>
                  </View>
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
        <View className="share_wx">
          <View className="share_wx_icon"></View>
          <View className="share_wx_font">点击保存分享图片</View>
        </View>
      </View>
    );
  }
}
export default Record;
