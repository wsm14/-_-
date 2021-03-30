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
import { View } from "@tarojs/components";
import {
  saveMerchantCollection,
  closeMerchantCollection,
  updateUserMomentParam,
} from "@/server/index";
import { listParentCategory } from "@/server/common";
import "./index.scss";
import Barrage from "./components/barrage";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import evens from "@/common/evens";
import { listOtherMomentByType, listMomentByUserId } from "@/server/user";
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
      type: getCurrentInstance().router.params.type,
      countStatus: true,
      player: true,
    };
  }

  onChange(e) {
    const { countStatus, httpData, userMomentsList, interval } = this.state;
    const { current } = e.detail;

    this.setState(
      {
        current,
        userMomentsInfo: userMomentsList[current],
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
        } else {
          if (current === this.state.userMomentsList.length - 1) {
            return toast("暂无数据");
          }
        }
      }
    );
  }

  selectList(data = {}) {
    const { httpData, interval } = this.state;
    const { val } = data;

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
              (res) => {}
            );
          }
        });
      }
    );
  }
  getVideoList(fn) {
    const { httpData, current, type } = this.state;
    if (type) {
      listMomentByUserId(httpData, (res) => {
        let { userMomentsList = [] } = res;
        if (userMomentsList.length === 0) {
          this.setState({
            countStatus: false,
          });
          return;
        }
        this.setState(
          {
            userMomentsList: [
              ...this.state.userMomentsList,
              ...userMomentsList,
            ],
          },
          (res) => {
            fn && fn();
          }
        );
      });
    } else {
      listOtherMomentByType(httpData, (res) => {
        let { userMomentsList = [] } = res;
        if (userMomentsList.length === 0) {
          this.setState({
            countStatus: false,
          });
          return;
        }
        this.setState(
          {
            userMomentsList: [
              ...this.state.userMomentsList,
              ...userMomentsList,
            ],
          },
          (res) => {
            fn && fn();
          }
        );
      });
    }
  }
  stopVideoPlayerControl() {
    const { current, interval, player } = this.state;
    if (player) {
      this.setState({
        player: false,
      });
      Taro.createVideoContext(`video${current}`).stop();
    } else {
      this.setState({
        player: true,
      });
      Taro.createVideoContext(`video${current}`).play();
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
  componentDidHide() {}
  componentDidShow() {}
  componentDidMount() {}
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
      httpData: { browseType },
      player,
    } = this.state;

    const templateView = () => {
      if (userMomentsList.length > 0) {
        return (
          <>
            <VideoView
              circular={circular}
              data={userMomentsList}
              current={current}
              onChange={this.onChange.bind(this)}
              follow={this.followStatus.bind(this)}
              collection={this.collection.bind(this)}
              stop={this.stopVideoPlayerControl.bind(this)}
            ></VideoView>
          </>
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
