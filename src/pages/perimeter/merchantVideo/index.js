import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import VideoView from "./components/videoView";
import {
  computedClient,
  toast,
  setIntive,
  saveFollow,
  goBack,
  loginStatus,
} from "@/common/utils";
import { View } from "@tarojs/components";
import {
  saveMerchantCollection,
  closeMerchantCollection,
  updateUserMomentParam,
  fetchUserShareCommission,
} from "@/server/index";
import { listParentCategory } from "@/server/common";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import evens from "@/common/evens";
import { listOtherMomentByType, listMomentByUserId } from "@/server/user";
import { getListUserMomentBySearch } from "@/server/perimeter";
import { getShareInfo } from "@/server/common";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
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
        userId: getCurrentInstance().router.params.userId || "",
        page: 1,
        limit: "10",
      },
      type: getCurrentInstance().router.params.type,
      countStatus: true,
      player: true,
      configUserLevelInfo: {},
      keyword: getCurrentInstance().router.params.keyword,
      cavansObj: {
        data: null,
        start: false,
      },
    };
  }

  onChange(e) {
    const { countStatus, httpData, userMomentsList, interval, type } = this.state;
    const { current } = e.detail;
    this.setState(
      {
        current,
        userMomentsInfo: userMomentsList[current],
        player: true,
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
  getVideoList(fn) {
    const { httpData, current, type } = this.state;
    if (type && type === "search") {
      this.getSearchList();
    } else if (type) {
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

  getSearchList() {
    const { httpData, keyword } = this.state;
    getListUserMomentBySearch({ ...httpData, keyword }, (res) => {
      let { userMomentsList = [] } = res;
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
  stopVideoPlayerControl() {
    const { current, interval, player } = this.state;
    if (player) {
      this.setState({
        player: false,
      });
      Taro.createVideoContext(`merchantVideo${current}`).pause();
    } else {
      this.setState({
        player: true,
      });
      Taro.createVideoContext(`merchantVideo${current}`).play();
    }
  }
  videoPlayerControl() {
    const { current } = this.state;
    const list = [current - 1, current, current + 1];
    for (const item of list) {
      if (item >= 0) {
        Taro.createVideoContext(`merchantVideo${item}`).stop();
      }
    }
    Taro.createVideoContext(`merchantVideo${current}`).play();
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
      (res) => { }
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
          buyPrice = 0
        } = res;
        if (player) {
          this.stopVideoPlayerControl();
        }
        let userInfo = Taro.getStorageSync("userInfo");
        console.log(userInfo);
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
              buyPrice
            }),
          },
        });
      }
    );
  }
  componentDidHide() { }
  componentDidShow() { }
  componentDidMount() { }
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
      configUserLevelInfo,
      cavansObj,
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
              userInfo={configUserLevelInfo}
              shareInfo={this.shareImageInfo.bind(this)}
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
              style={{ top: computedClient().top }}
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
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("点击保存")}
          onClose={() =>
            this.setState({ cavansObj: { start: false, data: null } })
          }
        ></TaroShareDrawer>
      </View>
    );
  }
}

export default Index;
