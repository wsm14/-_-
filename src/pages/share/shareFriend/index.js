import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import { getShareInfo } from "@/server/common";
import { backgroundObj } from "@/common/utils";
import { rssConfigData } from "./components/data";
import Router from "@/common/router";
import classNames from "classnames";
import TaroShareDrawer from "./components/TaroShareDrawer";
import "./index.scss";
class Record extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        shareType: "mainPage",
      },
      userInfo: {},
      current: 0,
      cavansObj: {
        data: null,
        start: false,
        type: null,
      },
      qcodeUrl: "",
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
  setCurrent(e) {
    console.log(e);
    const { current } = e.detail;
    console.log(e);
    this.setState({
      current,
    });
  }
  fetchShareInfo() {
    const { httpData } = this.state;
    getShareInfo(httpData, (res) => {
      const { qcodeUrl } = res;
      this.setState({
        qcodeUrl,
      });
    });
  }
  getShareInfo(type) {
    const {
      current,
      qcodeUrl,
      userInfo: { username },
      selectList,
    } = this.state;
    this.setState({
      cavansObj: {
        start: true,
        type: type,
        data: rssConfigData({
          wxCode: qcodeUrl,
          username,
          backgroundColor: selectList[current].color,
          background: selectList[current].url,
        }),
      },
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
    const {
      selectList,
      qcodeUrl,
      userInfo: { username },
      current,
      cavansObj,
    } = this.state;

    return (
      <View className="share_box">
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("点击保存")}
          onClose={() =>
            this.setState({
              cavansObj: { start: false, data: null, type: null },
            })
          }
        ></TaroShareDrawer>
        <Swiper
          previousMargin={Taro.pxTransform(94)}
          circular
          current={current}
          nextMargin={Taro.pxTransform(94)}
          onChange={this.setCurrent.bind(this)}
          className="share_swiper_box"
        >
          {selectList.map((item, index) => {
            return (
              <SwiperItem className="share_swiperItem_box">
                <View
                  className={classNames(
                    "share_swiperItem",
                    current === index && "scale_select"
                  )}
                  style={{
                    background: item.color,
                  }}
                >
                  <View
                    className="share_bg_style"
                    style={{
                      ...backgroundObj(item.url),
                      borderRadius: 20,
                    }}
                  >
                    <View className="share_swiperItem_code">
                      <Image
                        lazyLoad
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 4,
                        }}
                        src={qcodeUrl}
                      ></Image>
                    </View>
                    <View className="share_user">
                      <View className="font24 share_user_margin">
                        {username}
                      </View>
                      <View className="font20">邀请你加入哒卡乐</View>
                    </View>
                  </View>
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
        <View className="share_slider_box public_center">
          {selectList.map((item, index) => {
            return (
              <View
                className={classNames(
                  index !== current
                    ? "share_slider_noSelect"
                    : "share_slider_select"
                )}
              ></View>
            );
          })}
        </View>
        <View className="share_wx">
          <View
            className="share_friend"
            onClick={() => this.getShareInfo("friend")}
          ></View>
          <View
            onClick={() => this.getShareInfo("image")}
            className="share_image"
          ></View>
        </View>
      </View>
    );
  }
}
export default Record;
