import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import { fetchShareInfo } from "@/server/common";
import { backgroundObj, filterStrList } from "@/utils/utils";
import { rssConfigData } from "./components/data";
import Router from "@/utils/router";
import classNames from "classnames";
import TaroShareDrawer from "./components/TaroShareDrawer";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        shareType: "mainPage",
        needHyaline: "1",
      },
      userInfo: {},
      //用户信息
      current: 0,
      //选中的索引
      cavansObj: {
        data: null,
        start: false,
        type: null,
      },
      //画图工具配置
      qcodeUrl: "",
      // 二维码照片
      selectList: [
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/shareinfo_1.png",
          color: "#EF476F",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/shareinfo_2.png",
          color: "#FCC336",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/shareinfo_3.png",
          color: "#07C0C2",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/shareinfo_4.png",
          color: "#943EA3",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/shareinfo_5.png",
          color: "#0061A8",
        },
        {
          url: "https://wechat-config.dakale.net/miniprogram/image/shareinfo_6.png",
          color: "#E83D3D",
        },
      ],
      // 背景图片数组
    };
  }
  setCurrent(e) {
    console.log(e);
    const { current } = e.detail;
    this.setState({
      current,
    });
  }
  //设置轮播选中图片
  fetchShareInfo() {
    const { httpData } = this.state;
    fetchShareInfo(httpData, (res) => {
      const { qcodeUrl, backgroundImages } = res;
      if (backgroundImages) {
        this.setState({
          selectList: filterStrList(backgroundImages).map((item) => {
            return { url: item };
          }),
          qcodeUrl,
        });
      } else {
        this.setState({
          qcodeUrl,
        });
      }
    });
  }
  //获取后端配置分享背景图
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
          background: selectList[current].url,
        }),
      },
    });
  }
  //把选中的 生成海报图并保存相册
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
        {/* 画图工具 */}
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
              <SwiperItem className={classNames("share_swiperItem_box")}>
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
                    className={classNames(
                      "share_bg_style",
                      current !== index && "share_swiper_boxScale"
                    )}
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
        {/* 生成滑动轮播图 */}
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
        {/* slider 动画 */}
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
        {/* 操作按钮 */}
      </View>
    );
  }
}
export default Index;
