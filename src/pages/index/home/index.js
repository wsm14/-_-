import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import TopView from "./components/top";
import VideoView from "./components/videoView";
import { computedClient, toast, setIntive, saveFollow } from "@/common/utils";
import { Button, Image, View } from "@tarojs/components";
import InterVal from "@/components/setTimeCanvas";
import {
  getUserMomentList,
  saveWatchBean,
  saveMerchantCollection,
  closeMerchantCollection,
} from "@/server/index";
import { getMomentBarrage } from "@/server/common";
import "./index.scss";
import Barrage from "./components/barrage";
import classNames from "classnames";
class Index extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      swiperPage: 0,
      current: 0,
      userMomentsList: [],
      VideoList: [],
      circular: false,
      userMomentsInfo: {},
      httpData: {
        browseType: "commend",
        promotionType: "",
        distance: "",
        scenesIds: "",
        page: 1,
        limit: "10",
      },
      countStatus: true,
      time: null,
      interval: null,
      momentBarrageList: [],
    };
  }

  onChange(e) {
    const {
      countStatus,
      httpData,
      userMomentsList,
      interval,
      time,
    } = this.state;
    const { current } = e.detail;
    this.setState(
      {
        current,
        userMomentsInfo: userMomentsList[current],
        time: null,
      },
      (res) => {
        interval && this.stopInterval(interval);
        this.getMomentBarrage();
        this.videoPlayerControl();
        this.initInterval();
        if (current >= this.state.userMomentsList.length - 3 && countStatus) {
         
          this.setState(
            {
              httpData: { ...httpData, page: httpData.page + 1 },
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

  getMomentBarrage() {
    getMomentBarrage({ size: 25 }, (res) => {
      const { momentBarrageList = [] } = res;
      this.setState({
        momentBarrageList,
      });
    });
  }

  selectList(data = {}) {
    const { httpData, interval } = this.state;
    const { val } = data;
    if (interval) {
      this.stopInterval(interval);
    }
    this.setState(
      {
        httpData: { ...httpData, page: 1, browseType: val },
        swiperPage: 0,
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

  getVideoList(fn) {
    const { httpData, current } = this.state;
    getUserMomentList(httpData, (res) => {
      let { userMomentsList = [] } = res;
      console.log(current, this.state.userMomentsList.length, 111);
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
      userMomentsInfo: { userMomentIdString, beanLimitStatus },
      userMomentsInfo,
    } = this.state;
    if (beanLimitStatus === "1") {
      saveWatchBean(
        {
          momentId: userMomentIdString,
        },
        (res) => {
          this.setState({
            toast: true,
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
  componentDidMount() {
    this.getVideoList(() => {
      const { userMomentsList } = this.state;
      if (userMomentsList.length > 0) {
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
    this.getMomentBarrage();
  }

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
  componentDidHide() {
    const { interval } = this.state;
    if (interval) {
      this.stopInterval(interval);
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   // const { momentBarrageList } = this.state;
  //   // if (nextState.momentBarrageList.length === momentBarrageList.length) {
  //   //   return false;
  //   // } else {
  //   //   return true;
  //   // }
  // }
  componentDidShow() {
    const { time } = this.state;
    if (time === 0) {
      this.initInterval();
    }
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
  render() {
    const {
      userMomentsList,
      current,
      circular,
      userMomentsInfo,
      userMomentsInfo: { length = "" },
      time,
      momentBarrageList,
    } = this.state;
    const template = () => {
      const {
        httpData: { browseType },
      } = this.state;
      if (browseType !== "near") {
        return (
          <View className="home_box">
            <View style={{ top: computedClient() }} className="home_wait">
              <TopView onChange={this.selectList.bind(this)}></TopView>
            </View>
            {userMomentsList.length > 0 && (
              <InterVal
                interval={time}
                length={length}
                data={userMomentsInfo}
              ></InterVal>
            )}
            <View className="home_video_box">
              <VideoView
                circular={circular}
                data={userMomentsList}
                current={current}
                onChange={this.onChange.bind(this)}
                follow={this.followStatus.bind(this)}
                collection={this.collection.bind(this)}
              >
                <Barrage data={momentBarrageList}></Barrage>
              </VideoView>
            </View>
          </View>
        );
      } else return null;
    };
    return template();
  }
}

export default Index;
