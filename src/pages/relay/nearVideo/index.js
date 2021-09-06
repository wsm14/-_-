import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Button, Image, ScrollView, View } from "@tarojs/components";
import VideoView from "./components/videoView";
import {
  computedClient,
  toast,
  saveFollow,
  goBack,
  loginStatus,
} from "@/common/utils";
import {
  getUserMomentList,
  saveWatchBean,
  saveMerchantCollection,
  closeMerchantCollection,
  checkPuzzleBeanLimitStatus,
  updateUserMomentParam,
  fetchUserShareCommission,
} from "@/server/index";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import Toast from "@/components/beanToast";
import Coupon from "@/components/freeCoupon";
import Lead from "@/components/lead";
import "./index.scss";
@inject("store")
@observer
class Index extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      userMomentsList: [],
      VideoList: [],
      circular: false,
      userMomentsInfo: {},
      httpData: {
        browseType: "commend",
        page: 1,
        limit: "10",
      },
      countStatus: true,
      time: null,
      interval: null,
      momentBarrageList: [],
      beanflag: false,
      couponFlag: false,
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

  onChange(e) {
    const { countStatus, httpData, userMomentsList } = this.state;
    let { current } = e.detail;
    this.setState(
      {
        player: true,
        current,
        userMomentsInfo: userMomentsList[current],
        time: null,
        couponFlag: false,
      },
      (res) => {
        this.videoPlayerControl();

        if (current >= this.state.userMomentsList.length - 3 && countStatus) {
          this.setState(
            {
              httpData: {
                ...httpData,
                page: Math.ceil(userMomentsList.length / 10) + 1,
              },
            },
            (res) => {
              this.getVideoList();
            }
          );
        }
      }
    );
  }
  stopVideoPlayerControl() {
    const { current, interval, player } = this.state;
    if (player) {
      this.setState({
        player: false,
      });
      Taro.createVideoContext(`nearVideo${current}`).pause();
    } else {
      this.setState({
        player: true,
      });
      Taro.createVideoContext(`nearVideo${current}`).play();
    }
  }
  onInterSwper(e) {
    if (!this.interSwper) {
      this.interSwper = setTimeout(() => {
        this.onChange(e);
      }, 400);
    } else {
      clearTimeout(this.interSwper);
      this.interSwper = setTimeout(() => {
        this.onChange(e);
      }, 400);
    }
  }
  onTransition(e) {
    const { dy } = e.detail;
    const { httpData, interval, current } = this.state;

    if (current === 0 && dy < -100) {
      if (interval) {
        this.stopInterval(interval);
      }

      if (this.interReload) {
        clearTimeout(this.interReload);
        return (this.interReload = setTimeout(
          () =>
            this.setState(
              {
                httpData: { ...httpData, page: 1 },
                current: 0,
                userMomentsList: [],
                VideoList: [],
                circular: false,
                countStatus: true,
                time: null,
              },
              (res) => {
                this.getVideoList(() => {
                  if (this.state.userMomentsList.length > 0) {
                    this.setState({
                      userMomentsInfo: this.state.userMomentsList[0],
                    });
                  }
                });
              }
            ),
          500
        ));
      }
      return (this.interReload = setTimeout(
        () =>
          this.setState(
            {
              httpData: { ...httpData, page: 1 },
              current: 0,
              userMomentsList: [],
              VideoList: [],
              circular: false,
              countStatus: true,
              time: null,
            },
            (res) => {
              this.getVideoList(() => {
                if (this.state.userMomentsList.length > 0) {
                  this.setState({
                    userMomentsInfo: this.state.userMomentsList[0],
                  });
                }
              });
            }
          ),
        500
      ));
    }
  }

  getVideoList(fn) {
    const { httpData, current } = this.state;
    getUserMomentList(httpData, (res) => {
      let { userMomentsList = [], beanLimitStatus = "1" } = res;
      if (userMomentsList.length === 0) {
        this.setState({
          countStatus: false,
        });
        return;
      }
      this.setState(
        {
          userMomentsList: [...this.state.userMomentsList, ...userMomentsList],
        },
        (res) => {
          fn && fn();
        }
      );
    });
  }

  saveBean() {
    const {
      userMomentsInfo: { userMomentIdString, guideMomentFlag },
      userMomentsInfo,
    } = this.state;
    const { homeStore } = this.props.store;
    checkPuzzleBeanLimitStatus({}, (res) => {
      const { beanLimitStatus } = res;
      if (beanLimitStatus === "1") {
        saveWatchBean(
          {
            momentId: userMomentIdString,
          },
          (res) => {
            this.setState({
              beanflag: true,
              time: null,
              userMomentsInfo: { ...userMomentsInfo, watchStatus: "1" },
              userMomentsList: this.state.userMomentsList.map((item) => {
                if (item.userMomentIdString === userMomentIdString) {
                  return {
                    ...item,
                    watchStatus: "1",
                  };
                }
                return item;
              }),
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
              userMomentsList: this.state.userMomentsList.map((item) => {
                if (item.userMomentIdString === userMomentIdString) {
                  return {
                    ...item,
                    beanFlag: 0,
                  };
                }
                return item;
              }),
            });
          }
        });
      } else {
        homeStore.setBeanLimitStatus(beanLimitStatus);
      }
    });
  }
  //领取卡豆

  videoPlayerControl() {
    const { current } = this.state;
    const list = [current - 1, current, current + 1];
    for (const item of list) {
      if (item >= 0) {
        Taro.createVideoContext(`nearVideo${item}`).stop();
      }
    }
    Taro.createVideoContext(`nearVideo${current}`).play();
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
  componentDidHide() {}
  componentDidShow() {}
  componentDidMount() {
    this.getVideoList(() => {
      const { userMomentsList } = this.state;
      if (userMomentsList.length > 0) {
        this.setState({
          userMomentsInfo: this.state.userMomentsList[0],
        });
      }
    });
  }

  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  render() {
    const {
      userMomentsList,
      current,
      circular,
      userMomentsInfo = {},
      time,
      configUserLevelInfo,
      httpData: { browseType },
      beanflag,
      couponFlag,
      player,
      cavansObj,
    } = this.state;
    const { beanLimitStatus } = this.props.store.homeStore;
    const templateView = () => {
      if (userMomentsList.length > 0) {
        return (
          <>
            <VideoView
              circular={circular}
              data={userMomentsList}
              dataInfo={userMomentsInfo}
              current={current}
              onChange={this.onInterSwper.bind(this)}
              onTransition={this.onTransition.bind(this)}
              follow={this.followStatus.bind(this)}
              collection={this.collection.bind(this)}
              stop={this.stopVideoPlayerControl.bind(this)}
              userInfo={configUserLevelInfo}
              beanLimitStatus={beanLimitStatus}
              saveBean={this.saveBean.bind(this)}
            ></VideoView>
          </>
        );
      } else {
        return (
          <View className="home_order_box public_center">
            <View>
              <View className="home_order_image home_nullStatus_black"></View>
              <View className="home_order_font">
                {browseType === "commend" ? "暂无推荐的内容" : "暂无附近的内容"}
              </View>
            </View>
          </View>
        );
      }
    };
    return (
      <View className={classNames("home_box home_black")}>
        <View className="home_wait">
          <View onClick={() => goBack()} className="backStyle_box">
            <View
              className="backStyle go_back_icon"
              style={{ top: computedClient().top }}
            ></View>
          </View>
        </View>

        <View className="home_video_box">{templateView()}</View>
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
        <Lead beanLimitStatus={beanLimitStatus}></Lead>
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
