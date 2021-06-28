import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Button, Image, ScrollView, View } from "@tarojs/components";
import VideoView from "./components/videoView";
import {
  computedClient,
  toast,
  setIntive,
  saveFollow,
  goBack,
  loginStatus,
  filterPath,
} from "@/common/utils";
import {
  saveWatchBean,
  saveMerchantCollection,
  closeMerchantCollection,
  checkPuzzleBeanLimitStatus,
  updateUserMomentParam,
  fetchUserShareCommission,
  getUserMomentDetailById,
} from "@/server/index";
import { inject, observer } from "mobx-react";

import classNames from "classnames";
import Toast from "@/components/beanToast";
import Coupon from "@/components/freeCoupon";
import { getShareInfo } from "@/server/common";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import NewToast from "@/components/noviceGuide";
import "./index.scss";
@inject("store")
@observer
class Index extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      userMomentsInfo: {},
      httpData: {
        ...getCurrentInstance().router.params,
      },
      countStatus: true,
      time: null,
      interval: null,
      momentBarrageList: [],
      beanflag: false,
      couponFlag: false,
      beanLimitStatus: "1",
      player: true,
      configUserLevelInfo: {},
      cavansObj: {
        data: null,
        start: false,
      },
    };
    this.interReload = null;
    this.interSwper = null;
  }

  stopVideoPlayerControl() {
    const { current, player } = this.state;
    if (player) {
      this.setState({
        player: false,
      });
      Taro.createVideoContext(`details1`).pause();
    } else {
      this.setState({
        player: true,
      });
      Taro.createVideoContext(`details1`).play();
    }
  }

  getBean(time) {
    this.setState(
      {
        time: time,
      },
      (res) => {
        if (time == 0) {
          this.saveBean();
        }
      }
    );
  } //设置定时器领取卡豆
  saveBean() {
    const {
      userMomentsInfo: { userMomentIdString },
      userMomentsInfo,
    } = this.state;
    saveWatchBean(
      {
        momentId: userMomentIdString,
      },
      (res) => {
        this.setState({
          beanflag: true,
          time: null,
          userMomentsInfo: { ...userMomentsInfo, watchStatus: "1" },
        });
      }
    ).catch((res) => {
      const { resultCode } = res;
      if (resultCode == "5231") {
        this.setState({
          userMomentsInfo: {
            ...userMomentsInfo,
            beanFlag: 0,
          },
        });
      }
    });
  }
  //领取卡豆

  //初始化详情数据

  videoPlayerControl() {
    const { current } = this.state;
    const list = [current - 1, current, current + 1];
    for (const item of list) {
      if (item >= 0) {
        Taro.createVideoContext(`details1`).stop();
      }
    }
    Taro.createVideoContext(`details1`).play();
  }
  followStatus(e) {
    e.stopPropagation();
    let that = this;
    const {
      userMomentsInfo,
      userMomentsInfo: { merchantFollowStatus, userIdString },
    } = this.state;
    if (merchantFollowStatus === "1") {
      return;
    } else {
      saveFollow(
        {
          followType: "merchant",
          followUserId: userIdString,
        },
        () =>
          that.setState(
            {
              userMomentsInfo: {
                ...userMomentsInfo,
                merchantFollowStatus: "1",
              },
            },
            (res) => {
              toast("关注成功");
            }
          )
      );
    }
  }
  collection() {
    let that = this;
    const {
      userMomentsInfo: { userMomentIdString, merchantCollectionStatus },
      userMomentsInfo,
    } = this.state;
    if (merchantCollectionStatus === "1") {
      closeMerchantCollection(
        {
          collectionId: userMomentIdString,
        },
        () => {
          that.setState({
            userMomentsInfo: {
              ...userMomentsInfo,
              merchantCollectionStatus: "0",
              collectionAmount: parseInt(userMomentsInfo.collectionAmount) - 1,
            },
          });
        }
      );
    } else {
      saveMerchantCollection(
        {
          collectionId: userMomentIdString,
        },
        () => {
          that.setState({
            userMomentsInfo: {
              ...userMomentsInfo,
              merchantCollectionStatus: "1",
              collectionAmount: parseInt(userMomentsInfo.collectionAmount) + 1,
            },
          });
        }
      );
    }
  }
  componentDidHide() {}
  componentDidShow() {
    this.fetchUserShareCommission();
  }

  getUserMomentDetailById(momentId) {
    getUserMomentDetailById(
      {
        momentId,
      },
      (res) => {
        const { userMomentsInfo } = res;
        this.setState({
          userMomentsInfo,
        });
      }
    );
  }

  componentWillMount() {
    const { momentId, scene } = getCurrentInstance().router.params;
    if (scene || momentId) {
      if (scene) {
        getShareParamInfo({ uniqueKey: scene }, (res) => {
          const {
            shareParamInfo: { param },
          } = res;
          if (param && JSON.parse(param)) {
            const { momentId } = JSON.parse(param);
            if (momentId) {
              this.getUserMomentDetailById(momentId);
              this.setState({
                httpData: {
                  ...param,
                },
              });
            }
          }
        });
      } else if (momentId) {
        this.getUserMomentDetailById(momentId);
      } else {
        return;
      }
    } else {
      toast("参数异常");
    }
  }
  componentWillUnmount() {}
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  shareImageInfo() {
    const {
      userMomentsInfo: {
        userMomentIdString,
        message,
        username,
        cityName,
        districtName,
        merchantAddress,
        frontImage,
      },
      player,
    } = this.state;
    getShareInfo(
      {
        shareType: "video",
        shareId: userMomentIdString,
      },
      (res) => {
        const {
          goodsImg,
          goodsName,
          hasGoods,
          oriPrice,
          realPrice,
          qcodeUrl,
          image,
          buyPrice = 0,
        } = res;
        if (player) {
          this.stopVideoPlayerControl();
        }
        let userInfo = Taro.getStorageSync("userInfo");
        this.setState({
          cavansObj: {
            start: true,
            data: rssConfigData({
              hasGoods,
              frontImage: frontImage,
              message,
              merchantName: username,
              cityName: cityName + districtName,
              address: merchantAddress,
              username: userInfo.username,
              userProfile: userInfo.profile,
              wxCode: qcodeUrl,
              goodsImg,
              goodsName,
              oriPrice,
              realPrice,
              buyPrice,
            }),
          },
        });
      }
    );
  }
  onShareAppMessage(res) {
    const {
      userMomentsInfo: { frontImage, title, userMomentIdString },
    } = this.state;
    updateUserMomentParam(
      {
        updateType: "share",
        id: userMomentIdString,
      },
      (res) => {}
    );
    let userInfo = loginStatus() || {};
    if (loginStatus()) {
      const { userIdString } = userInfo;
      if (res.from === "button") {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?shareUserId=${userIdString}&shareUserType=user&momentId=${userMomentIdString}`,
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?shareUserId=${userIdString}&shareUserType=user&momentId=${userMomentIdString}`,
        };
      }
    } else {
      if (res.from === "button") {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?momentId=${userMomentIdString}`,
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?momentId=${userMomentIdString}`,
        };
      }
    }
  }
  render() {
    const {
      userMomentsInfo,
      userMomentsInfo: { length = "", userIdString },
      time,
      configUserLevelInfo,
      beanflag,
      couponFlag,
      beanLimitStatus,
      player,
      cavansObj,
      httpData,
    } = this.state;
    const { login } = this.props.store.authStore;
    return (
      <View className={classNames("home_box home_black")}>
        <View className="home_video_box">
          <>
            <VideoView
              data={userMomentsInfo}
              follow={this.followStatus.bind(this)}
              collection={this.collection.bind(this)}
              stop={this.stopVideoPlayerControl.bind(this)}
              userInfo={configUserLevelInfo}
              shareInfo={this.shareImageInfo.bind(this)}
              beanLimitStatus={beanLimitStatus}
              saveBean={this.saveBean.bind(this)}
            ></VideoView>
          </>
        </View>
        <Toast
          data={userMomentsInfo}
          show={beanflag}
          visible={() => {
            this.setState({
              beanflag: false,
              couponFlag: true,
            });
          }}
        ></Toast>
        <Coupon
          data={userMomentsInfo}
          show={couponFlag}
          beanflag={beanflag}
          visible={() => {
            this.setState({
              couponFlag: false,
            });
          }}
        ></Coupon>
        {!player && (
          <View
            onClick={() => this.stopVideoPlayerControl()}
            className="player_no"
          ></View>
        )}
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("点击保存")}
          onClose={() =>
            this.setState({ cavansObj: { start: false, data: null } })
          }
        ></TaroShareDrawer>
        {filterPath(getCurrentInstance().router.params) &&
          !Taro.getStorageSync("newDeviceFlag") && (
            <NewToast
              type={"merchant"}
              stopVideo={() => {
                Taro.createVideoContext(`details1`).pause();
              }}
              initVideo={() => {
                Taro.createVideoContext(`details1`).play();
              }}
              auth={login}
              data={{ ...httpData, merchantId: userIdString }}
            ></NewToast>
          )}
      </View>
    );
  }
}

export default Index;
