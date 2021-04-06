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
} from "@/common/utils";
import InterVal from "@/components/setTimeCanvas";
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
import evens from "@/common/evens";
import Toast from "@/components/beanToast";
import Coupon from "@/components/freeCoupon";
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
      beanLimitStatus: "1",
      player: true,
      configUserLevelInfo: {},
    };
    this.interReload = null;
    this.interSwper = null;
  }

  onChange(e) {
    const { countStatus, httpData, userMomentsList, interval } = this.state;
    const { current } = e.detail;
    this.setState(
      {
        current,
        userMomentsInfo: userMomentsList[current],
        time: null,
        couponFlag: false,
      },
      (res) => {
        interval && this.stopInterval(interval);
        this.videoPlayerControl();
        this.initInterval();
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
        } else {
          if (current === this.state.userMomentsList.length - 1) {
            return toast("暂无数据");
          }
        }
      }
    );
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
      Taro.createVideoContext(`video${current}`).stop();
    } else {
      if (interval) {
        this.stopInterval(interval);
      }
      this.setState({
        player: true,
      });
      this.initInterval();
      Taro.createVideoContext(`video${current}`).play();
    }
  }
  onInterSwper(e) {
    if (!this.interSwper) {
      this.interSwper = setTimeout(() => {
        this.onChange(e);
      }, 200);
    } else {
      clearTimeout(this.interSwper);
      this.interSwper = setTimeout(() => {
        this.onChange(e);
      }, 200);
    }
  }
  screen(data = {}) {
    const { httpData, interval } = this.state;
    const {
      loadDistance = "",
      loadPromotionType = "",
      loadCategoryIds = [],
    } = data;
    if (interval) {
      this.stopInterval(interval);
    }
    this.setState(
      {
        httpData: {
          ...httpData,
          page: 1,
          ...{
            distance: loadDistance,
            scenesIds: loadCategoryIds.join(","),
            promotionType: loadPromotionType,
          },
        },
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
            this.setState(
              {
                userMomentsInfo: this.state.userMomentsList[0],
              },
              (res) => {
                this.initInterval();
              }
            );
          }
        });
      }
    );
  }
  setScreen(data) {
    const { homeStore } = this.props.store;
    homeStore.setSelectObj(data);
    this.screen(data);
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
                    this.setState(
                      {
                        userMomentsInfo: this.state.userMomentsList[0],
                      },
                      (res) => {
                        this.initInterval();
                      }
                    );
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
                  this.setState(
                    {
                      userMomentsInfo: this.state.userMomentsList[0],
                    },
                    (res) => {
                      this.initInterval();
                    }
                  );
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
          beanLimitStatus,
        },
        (res) => {
          fn && fn();
        }
      );
    });
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
      beanLimitStatus,
    } = this.state;
    if (beanLimitStatus === "1") {
      saveWatchBean(
        {
          momentId: userMomentIdString,
        },
        (res) => {
          checkPuzzleBeanLimitStatus({}, (res) => {
            const { beanLimitStatus = "1" } = res;
            this.setState({ beanLimitStatus });
          });
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
      );
    } else {
    }
  }
  //领取卡豆
  initInterval() {
    const { userMomentsInfo } = this.state;
    const { watchStatus, length } = userMomentsInfo;
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
  componentDidMount() {
    this.initInterval();
  }
  componentWillMount() {
    const { selectObj, list, index } = this.props.store.homeStore;
    if (list.length === 0) {
      toast("参数异常");
    } else {
      this.setState({
        userMomentsList: list,
        current: index,
        userMomentsInfo: list[index],
        httpData: {
          ...this.state.httpData,
          ...selectObj,
        },
      });
    }
  }
  componentWillUnmount() {
    const { homeStore } = this.props.store;
    homeStore.clearNavitor();
    evens.$emit("updateMomentsList", this.state.userMomentsList);
    console.log(this.state.userMomentsList);
  }
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
          path: `/pages/index/home/index?shareUserId=${userIdString}&shareUserType=user&momentId=${userMomentIdString}`,
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/index/home/index?shareUserId=${userIdString}&shareUserType=user&momentId=${userMomentIdString}`,
        };
      }
    } else {
      if (res.from === "button") {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/index/home/index?momentId=${userMomentIdString}`,
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/index/home/index?momentId=${userMomentIdString}`,
        };
      }
    }
  }
  render() {
    const {
      userMomentsList,
      current,
      circular,
      userMomentsInfo,
      userMomentsInfo: { length = "" },
      time,
      configUserLevelInfo,
      httpData: { browseType },
      beanflag,
      couponFlag,
      beanLimitStatus,
      player
    } = this.state;
    const templateView = () => {
      if (userMomentsList.length > 0) {
        return (
          <>
            <InterVal
              interval={time}
              length={length}
              data={userMomentsInfo}
              beanLimitStatus={beanLimitStatus}
            ></InterVal>
            <VideoView
              circular={circular}
              data={userMomentsList}
              current={current}
              onChange={this.onInterSwper.bind(this)}
              follow={this.followStatus.bind(this)}
              collection={this.collection.bind(this)}
              onTransition={this.onTransition.bind(this)}
              stop={this.stopVideoPlayerControl.bind(this)}
              userInfo={configUserLevelInfo}
            ></VideoView>
          </>
        );
      } else {
        return (
          <View className="home_order_box public_center">
            <View>
              <View className="home_order_image home_nullStatus_black"></View>
              <View className="home_order_font">
                {browseType === "commend" ? "暂无附近的内容" : "暂无关注的内容"}
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
              style={{ top: Taro.pxTransform(computedClient().top) }}
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
