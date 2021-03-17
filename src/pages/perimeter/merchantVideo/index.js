import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import VideoView from "./components/videoView";
import {
  computedClient,
  toast,
  setIntive,
  saveFollow,
  goBack,
} from "@/common/utils";
import { Button, Image, ScrollView, View } from "@tarojs/components";
import InterVal from "@/components/setTimeCanvas";
import {
  getUserMomentList,
  saveWatchBean,
  saveMerchantCollection,
  closeMerchantCollection,
} from "@/server/index";
import { getMomentBarrage, listParentCategory } from "@/server/common";
import "./index.scss";
import Barrage from "./components/barrage";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import evens from "@/common/evens";
import { listOtherMomentByType } from "@/server/user";
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
        userId: getCurrentInstance().router.params.userId || "1",
        page: 1,
        limit: "10",
      },
      countStatus: true,
      time: null,
      interval: null,
      momentBarrageList: [],
      toast: false,
    };
  }

  onChange(e) {
    const { countStatus, httpData, userMomentsList, interval } = this.state;
    const { current } = e.detail;
    console.log(current, userMomentsList);
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
        current: 0,
        userMomentsList: [],
        VideoList: [],
        circular: false,
        countStatus: true,
        time: null,
      },
      (res) => {
        this.getVideoList(() => {
          if (this.state.userMomentsList.length > 0 && val !== "near") {
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

  getVideoList(fn) {
    const { httpData, current } = this.state;
    listOtherMomentByType(httpData, (res) => {
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
    if (time === 0 || time) {
      this.initInterval();
    }
  }
  componentDidMount() {
    this.initInterval();
  }
  componentWillMount() {
    const { selectObj, list, index } = this.props.store.homeStore;
    console.log(index);
    if (list.length === 0) {
      toast("参数异常");
    } else {
      this.setState({
        userMomentsList: list,
        current: index,
        userMomentsInfo: list[index],
        httpData: {
          ...this.state.httpData,
        },
      });
      this.getMomentBarrage();
    }
  }
  componentWillUnmount() {
    const { homeStore } = this.props.store.homeStore;
    homeStore.clearNavitor();
    evens.$emit("updateMerchantList", this.state.userMomentsList);
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
      httpData: { browseType },
      toast,
    } = this.state;

    const templateView = () => {
      if (userMomentsList.length > 0) {
        return (
          <>
            <InterVal
              interval={time}
              length={length}
              data={userMomentsInfo}
            ></InterVal>
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
          <View
            className="backStyle go_back_icon"
            style={{ top: Taro.pxTransform(computedClient().top) }}
            onClick={() => goBack()}
          ></View>
        </View>
        <View className="home_video_box">{templateView()}</View>
        {toast && (
          <Toast
            data={userMomentsInfo}
            visible={() => {
              if (couponList.length > 0) {
                this.setState({
                  toast: false,
                  conpouVisible: true,
                });
              } else {
                this.setState({
                  toast: false,
                });
              }
            }}
          ></Toast>
        )}
      </View>
    );
  }
}

export default Index;
