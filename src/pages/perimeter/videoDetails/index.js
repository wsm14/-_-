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
} from "@/common/utils";
import InterVal from "@/components/setTimeCanvas";
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
import "./index.scss";
import classNames from "classnames";
import Toast from "@/components/beanToast";
import Coupon from "@/components/freeCoupon";

@inject("store")
@observer
class Index extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      userMomentsInfo: {},
      countStatus: true,
      time: null,
      interval: null,
      momentBarrageList: [],
      beanflag: false,
      couponFlag: false,
      beanLimitStatus: "1",
      player: true,
      configUserLevelInfo: {},
    };
    this.interReload = null;
    this.interSwper = null;
  }

  stopVideoPlayerControl() {
    const { current, interval, player } = this.state;
    if (player) {
      if (interval) {
        this.stopInterval(interval);
      }
      this.setState({
        player: false,
      });
      Taro.createVideoContext(`details1`).stop();
    } else {
      if (interval) {
        this.stopInterval(interval);
      }
      this.setState({
        player: true,
      });
      this.initInterval();
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
    );
  }
  //领取卡豆
  initInterval() {
    const { userMomentsInfo, interval } = this.state;
    const { watchStatus, length } = userMomentsInfo;
    interval && clearInterval(interval);
    if ((this.state.time || this.state.time === 0) && watchStatus === "0") {
      this.setState({
        interval: setIntive(this.state.time, this.getBean.bind(this)),
      });
    } else {
      if (watchStatus === "0" && length) {
        this.setState(
          {
            time: length,
          },
          (res) => {
            this.setState({
              interval: setIntive(this.state.time, this.getBean.bind(this)),
            });
          }
        );
      }
    }
  }
  //初始化详情数据

  stopInterval(interval) {
    console.log("清理成功");
    clearInterval(interval);
    this.setState({
      interval: null,
    });
  }
  videoPlayerControl() {
    const { current } = this.state;
    const list = [current - 1, current, current + 1];
    for (const item of list) {
      if (item >= 0) {
        Taro.createVideoContext(`video${item}`).stop();
      }
    }
    Taro.createVideoContext(`video${current}`).play();
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
              userMomentsList: this.state.userMomentsList.map((item) => {
                if (item.userIdString === userIdString) {
                  return {
                    ...item,
                    merchantFollowStatus: "1",
                  };
                }
                return item;
              }),
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
            userMomentsList: this.state.userMomentsList.map((item) => {
              if (item.userMomentIdString === userMomentIdString) {
                return {
                  ...userMomentsInfo,
                  merchantCollectionStatus: "0",
                  collectionAmount:
                    parseInt(userMomentsInfo.collectionAmount) - 1,
                };
              }
              return item;
            }),
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
            userMomentsList: this.state.userMomentsList.map((item) => {
              if (item.userMomentIdString === userMomentIdString) {
                return {
                  ...userMomentsInfo,
                  merchantCollectionStatus: "1",
                  collectionAmount:
                    parseInt(userMomentsInfo.collectionAmount) + 1,
                };
              }
              return item;
            }),
          });
        }
      );
    }
  }
  componentDidHide() {
    const { interval } = this.state;
    if (interval) {
      this.stopInterval(interval);
    }
  }
  componentDidShow() {
    const { time } = this.state;
    this.fetchUserShareCommission();
    if (time === 0 || time) {
      this.initInterval();
    }
  }

  getUserMomentDetailById(momentId) {
    getUserMomentDetailById(
      {
        momentId,
      },
      (res) => {
        const { userMomentsInfo } = res;
        this.setState(
          {
            userMomentsInfo,
          },
          (res) => {
            this.initInterval();
          }
        );
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
      userMomentsInfo: { length = "" },
      time,
      configUserLevelInfo,
      beanflag,
      couponFlag,
      beanLimitStatus,
      player,
    } = this.state;

    return (
      <View className={classNames("home_box home_black")}>
        <View className="home_video_box">
          <>
            <InterVal
              interval={time}
              length={length}
              data={userMomentsInfo}
              beanLimitStatus={beanLimitStatus}
            ></InterVal>
            <VideoView
              data={userMomentsInfo}
              follow={this.followStatus.bind(this)}
              collection={this.collection.bind(this)}
              stop={this.stopVideoPlayerControl.bind(this)}
              userInfo={configUserLevelInfo}
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
      </View>
    );
  }
}

export default Index;
