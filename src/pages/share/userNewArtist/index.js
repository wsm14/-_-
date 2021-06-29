import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text, Video, ScrollView } from "@tarojs/components";
import { getGuildMomentDetail } from "@/server/share";
import { saveWatchBean } from "@/server/index";
import { loginStatus, toast } from "@/common/utils";
import {
  getSpecialGoodsDetail,
  getOwnerCouponDetail,
  getMerchantDetail,
  listAllPut,
  getGoodsByMerchantId,
} from "@/server/perimeter";
import Router from "@/common/router";
import classNames from "classnames";
import {
  ShopView,
  CardView,
  newShopView,
  meShopView_box,
} from "./components/view";
import Login from "./components/login";
import GetBean from "./components/getBeanInfo";
import "./index.scss";
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      guildMomentDetail: {},
      player: true,
      scale: 0,
      walk: false,
      time: 0,
      httpData: {
        ...getCurrentInstance().router.params,
      },
      infoData: {},
      specialGoodsList: [],
      goodList: [],
      bottomFlag: true,
      authFlag: false,
      getBeanFlag: false,
    };
  }
  componentWillMount() {}
  componentDidMount() {
    this.fetchMomentDetails();
    this.filterRelated();
    this.fetchMerchantPut();
    this.fetchNearGoods();
  }
  componentDidShow() {}
  fetchGoodsById() {
    const { httpData } = this.state;
    getSpecialGoodsDetail(httpData, (res) => {
      const { specialGoodsInfo } = res;
      this.setState({
        infoData: specialGoodsInfo,
      });
    });
  }
  fetchMomentDetails() {
    getGuildMomentDetail({}).then((val) => {
      const { guildMomentDetail } = val;
      this.setState(
        {
          guildMomentDetail,
        },
        (res) => {
          if (!loginStatus()) {
            this.setState({
              authFlag: true,
            });
          }
        }
      );
    });
  }
  fetchCouponDetail() {
    const { httpData } = this.state;
    getOwnerCouponDetail(httpData, (res) => {
      const { couponDetail } = res;
      const { reduceObject = {}, merchantCouponStatus = "1" } = couponDetail;
      this.setState({
        infoData: {
          ...couponDetail,
          ...reduceObject,
          status: merchantCouponStatus,
        },
      });
    });
  }
  fetchMerchantById() {
    const { httpData } = this.state;
    getMerchantDetail(httpData, (res) => {
      const { userMerchant } = res;
      this.setState({
        infoData: { ...userMerchant },
      });
    });
  }
  fetchMerchantPut() {
    const { merchantId } = this.state.httpData;
    listAllPut(
      {
        merchantId,
        page: 1,
        limit: 5,
      },
      (res) => {
        const { specialGoodsList = [] } = res;
        this.setState({
          specialGoodsList: [...specialGoodsList],
        });
      }
    );
  }
  fetchNearGoods() {
    getGoodsByMerchantId({ page: 1, limit: 5 }, (res) => {
      const { specialGoodsList = [] } = res;

      this.setState({
        goodList: specialGoodsList,
      });
    });
  }
  fakeBean() {
    const { guildMomentDetail } = this.state;
    const { userMomentIdString, watchStatus } = guildMomentDetail;
    saveWatchBean(
      {
        momentId: userMomentIdString,
      },
      (res) => {
        Taro.setStorageSync("newDeviceFlag", "0");
        this.setState({
          getBeanFlag: true,
          guildMomentDetail: {
            ...guildMomentDetail,
            watchStatus: "1",
          },
        });
      }
    ).catch((e) => {
      const { resultCode } = e;
      if (resultCode === "5224" || resultCode === "5031") {
        this.setState({
          guildMomentDetail: {
            ...guildMomentDetail,
            beanFlag: 0,
            watchStatus: "1",
          },
        });
      }
    });
  }
  filterRelated() {
    const {
      httpData: { type = "default" },
    } = this.state;
    switch (type) {
      case "goods":
        this.fetchGoodsById();
        break;
      case "coupon":
        this.fetchCouponDetail();
        break;
      case "merchant":
        this.fetchMerchantById();
        break;
      case "video":
        return;
    }
  }
  filterBeanToastData() {
    const { infoData, specialGoodsList, goodList, type } = this.state;
    const { status } = infoData;
    if (infoData && status === "1" && type !== "merchant") {
      return [{ ...infoData }];
    } else if (specialGoodsList.length > 0) {
      return specialGoodsList;
    } else {
      return goodList;
    }
  }
  onShareAppMessage(res) {}

  render() {
    const {
      guildMomentDetail,
      guildMomentDetail: { videoContent, length, watchStatus, message },
      player,
      scale,
      walk,
      time,
      httpData: { username = "", type },
      infoData: { status = "0" },
      infoData,
      specialGoodsList,
      goodList,
      bottomFlag,
      authFlag,
      getBeanFlag,
    } = this.state;
    const filterObject = (str) => {
      if (str) {
        return JSON.parse(str);
      } else {
        return {};
      }
    };
    return (
      <View
        className={classNames(
          "userNewArtist_box",
          getBeanFlag && "userNewArtist_vh"
        )}
      >
        <View className="userNewArtist_image"></View>
        <View className="userNewArtist_video">
          <View
            onClick={() => {
              Router({
                routerName: "beanReward",
              });
            }}
            className={classNames(
              "video_animate",
              watchStatus === "1" ? "video_animate_bg2" : "video_animate_bg1"
            )}
          >
            <View
              className={classNames(
                watchStatus === "1"
                  ? "video_animate_padding"
                  : "video_animate_time"
              )}
            >
              {watchStatus === "1" ? "已领" : parseInt(length - time)}
            </View>
          </View>
          <Video
            className="userNewArtist_video_style"
            controls={false}
            src={filterObject(videoContent).url}
            enableProgressGesture={false}
            autoplay={true}
            loop={true}
            onWaiting={(e) => {
              this.setState({
                walk: true,
              });
            }}
            id={"newVideoInfo"}
            onTimeUpdate={(e) => {
              const { currentTime, duration } = e.detail;
              if (authFlag) {
                Taro.createVideoContext(`newVideoInfo`).pause();
              }
              this.setState({
                scale: ((currentTime / duration) * 100).toFixed(2),
                time: parseInt(currentTime),
                walk: false,
                player: true,
              });
            }}
            onEnded={() => {
              const { guildMomentDetail } = this.state;
              const { watchStatus, beanFlag } = guildMomentDetail;
              if (watchStatus === "0" && beanFlag === "1") {
                this.fakeBean();
              }
            }}
            objectFit={"cover"}
          ></Video>
          {!player && <View className="userNewArtist_video_stop"></View>}
          {/* <View className="video_liner">
            {walk ? (
              <View className="video_loadding"></View>
            ) : (
              <View
                style={{
                  height: "100%",
                  width: `${scale}%`,
                  background: "rgba(255, 235, 165, 1)",
                }}
              ></View>
            )}

          </View> */}
        </View>
        {message && (
          <View className="userNewArtist_message font_noHide">{message}</View>
        )}

        {status === "1" && Object.keys(infoData).length && (
          <>
            <View className="userNewArtist_user font_hide">
              来自<Text className="bold">{"@" + username}</Text>的诚意推荐
            </View>
            <View className="userNewArtist_infoGoods">
              {ShopView(infoData, "goods")}
            </View>
          </>
        )}
        {type === "merchant" && Object.keys(infoData).length && (
          <View className="userNewArtist_infoGoods">{CardView(infoData)}</View>
        )}
        {specialGoodsList.length > 0 && (
          <View className="shop_info">
            <View className="shop_info_title">本店特惠</View>
            {specialGoodsList.length === 1 ? (
              <View className="userNewArtist_own_view">
                {ShopView(specialGoodsList[0], "goods")}
              </View>
            ) : (
              <ScrollView scrollX className="userNewArtist_scrollView">
                {specialGoodsList.map((item) => {
                  return meShopView_box(item);
                })}
              </ScrollView>
            )}
          </View>
        )}
        <View className="shop_info">
          <View className="shop_info_title">限时秒杀抢购中</View>
          <View className="shop_info_pay">
            {goodList.map((item) => {
              return ShopView(item, "goods");
            })}
          </View>
        </View>
        <View
          className="shop_btn_Info public_center bold"
          onClick={() =>
            Router({
              routerName: "perimeter",
              type: "switchTab",
            })
          }
        >
          更多好物去逛逛
        </View>
        {bottomFlag && (
          <View className="shop_info_fixed">
            <View
              className="shop_info_close"
              onClick={() => this.setState({ bottomFlag: false })}
            ></View>
            <View className="shop_info_font">更多福利请关注哒卡乐公众号</View>
            <View className="shop_info_setBtn">戳一下</View>
          </View>
        )}
        <Login
          stopVideo={() => {
            this.setState({
              player: false,
            });
          }}
          show={authFlag}
          close={() =>
            this.setState(
              {
                authFlag: false,
              },
              (res) => {
                Taro.createVideoContext(`newVideoInfo`).play();
              }
            )
          }
        ></Login>
        <GetBean
          list={this.filterBeanToastData()}
          close={() => this.setState({ getBeanFlag: false })}
          show={getBeanFlag}
          data={guildMomentDetail}
        ></GetBean>
      </View>
    );
  }
}

export default Index;
