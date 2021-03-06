import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import VideoView from "./components/videoView";
import { computedClient, toast, goBack, loginStatus } from "@/utils/utils";
import { View } from "@tarojs/components";
import {
  fakeInsertUserCollectionMoment,
  fakeDeleteUserCollection,
  fakeUserFollow,
  listOtherMomentByType,
  listMomentByUserId,
} from "@/server/index";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import evens from "@/common/evens";
import { getListUserMomentBySearch } from "@/server/perimeter";
import { fetchShareInfo, fetchUserShareCommission } from "@/server/common";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import Comment from "@/components/public_ui/comment";
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
      commentShow: false,
    };
  }

  onChange(e) {
    const { countStatus, httpData, userMomentsList, interval, type } =
      this.state;
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
      userMomentsInfo: { followStatus, relateId, relateType },
    } = this.state;
    if (followStatus === "1") {
      return;
    } else {
      fakeUserFollow(
        {
          followType: relateType,
          followUserId: relateId,
        },
        () =>
          that.setState(
            {
              userMomentsInfo: {
                ...userMomentsInfo,
                followStatus: "1",
              },
              userMomentsList: this.state.userMomentsList.map((item) => {
                if (item.relateId === relateId) {
                  return {
                    ...item,
                    followStatus: "1",
                  };
                }
                return item;
              }),
            },
            (res) => {
              toast("????????????");
            }
          )
      );
    }
  }
  collection() {
    let that = this;
    const {
      userMomentsInfo: { momentId, collectionStatus, ownerId, ownerType },
      userMomentsInfo,
    } = this.state;
    if (collectionStatus === "1") {
      fakeDeleteUserCollection(
        {
          collectionType: "moment",
          collectionId: momentId,
          ownerId,
          ownerType,
        },
        () => {
          that.setState({
            userMomentsInfo: {
              ...userMomentsInfo,
              collectionStatus: "0",
              collectionAmount: parseInt(userMomentsInfo.collectionAmount) - 1,
            },
            userMomentsList: this.state.userMomentsList.map((item) => {
              if (item.momentId === momentId) {
                return {
                  ...userMomentsInfo,
                  collectionStatus: "0",
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
      fakeInsertUserCollectionMoment(
        {
          collectionType: "moment",
          collectionId: momentId,
          ownerId,
          ownerType,
        },
        () => {
          that.setState({
            userMomentsInfo: {
              ...userMomentsInfo,
              collectionStatus: "1",
              collectionAmount: parseInt(userMomentsInfo.collectionAmount) + 1,
            },
            userMomentsList: this.state.userMomentsList.map((item) => {
              if (item.momentId === momentId) {
                return {
                  ...userMomentsInfo,
                  collectionStatus: "1",
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
  shareImageInfo() {
    const {
      userMomentsInfo: {
        momentId,
        message,
        ownerName,
        frontImage,
        momentType,
        addressContentObject = {},
        ownerId,
        guideMomentFlag,
      },
      userMomentsInfo,
      player,
    } = this.state;
    const { address = "" } = addressContentObject;
    fetchShareInfo(
      {
        shareType: "newVideo",
        shareId: momentId,
        subType: guideMomentFlag === "1" ? "guide" : momentType,
        shardingKey: ownerId,
      },
      (res) => {
        const {
          goodsImg,
          goodsName,
          hasCoupon = "0",
          oriPrice,
          realPrice,
          qcodeUrl,
          image,
          hasGoods = "0",
          buyPrice = 0,
          saveMoney = 0,
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
              merchantName: ownerName,
              cityName: address,
              address: address,
              username: userInfo.username,
              userProfile: userInfo.profile,
              wxCode: qcodeUrl,
              goodsImg,
              goodsName,
              oriPrice,
              realPrice,
              buyPrice,
              hasCoupon,
              saveMoney,
            }),
          },
          userMomentsInfo: {
            ...userMomentsInfo,
            weChatImg: res.frontImage,
            weChatTitle: res.title,
          },
        });
      }
    );
  }
  onShareAppMessage(res) {
    const {
      userMomentsInfo: {
        frontImage,
        title,
        momentId,
        weChatImg = "",
        weChatTitle = "",
        ownerId,
      },
    } = this.state;
    let userInfo = loginStatus() || {};
    if (loginStatus()) {
      const { userIdString } = userInfo;
      if (res.from === "button") {
        return {
          title: weChatTitle || title,
          imageUrl: weChatImg || frontImage,
          path: `/pages/perimeter/videoDetails/index?shareUserId=${userIdString}&shareUserType=user&momentId=${momentId}&ownerId=${ownerId}`,
          complete: function () {
            // ???????????????????????????????????????????????????????????????
            console.log("---????????????---");
          },
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?shareUserId=${userIdString}&shareUserType=user&momentId=${momentId}&ownerId=${ownerId}`,
          complete: function () {
            // ???????????????????????????????????????????????????????????????
            console.log("---????????????---");
          },
        };
      }
    } else {
      if (res.from === "button") {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?momentId=${momentId}&ownerId=${ownerId}`,
          complete: function () {
            // ???????????????????????????????????????????????????????????????
            console.log("---????????????---");
          },
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?momentId=${momentId}&ownerId=${ownerId}`,
          complete: function () {
            // ???????????????????????????????????????????????????????????????
            console.log("---????????????---");
          },
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

  componentWillMount() {
    const { selectObj, list, index } = this.props.store.homeStore;
    if (list.length === 0) {
      toast("????????????");
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
      commentShow,
      userMomentsInfo,
    } = this.state;

    const templateView = () => {
      if (userMomentsList.length > 0) {
        return (
          <>
            <VideoView
              circular={circular}
              data={userMomentsList}
              dataInfo={userMomentsInfo}
              current={current}
              onChange={this.onChange.bind(this)}
              follow={this.followStatus.bind(this)}
              collection={this.collection.bind(this)}
              stop={this.stopVideoPlayerControl.bind(this)}
              changeComment={() => this.setState({ commentShow: true })}
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
        <Comment
          data={userMomentsInfo}
          current={current}
          close={() => {
            this.setState({
              commentShow: false,
            });
          }}
          show={commentShow}
        ></Comment>
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("????????????")}
          onClose={() =>
            this.setState({ cavansObj: { start: false, data: null } })
          }
        ></TaroShareDrawer>
      </View>
    );
  }
}

export default Index;
