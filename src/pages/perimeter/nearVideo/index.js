import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Button, Image, ScrollView, View } from "@tarojs/components";
import VideoView from "./components/videoView";
import { computedClient, toast, goBack, loginStatus } from "@/utils/utils";
import {
  getUserMomentList,
  saveWatchBean,
  fakeInsertUserCollectionMoment,
  fakeDeleteUserCollection,
  checkPuzzleBeanLimitStatus,
  fakeUserFollow,
} from "@/server/index";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import evens from "@/common/evens";
import Toast from "@/components/public_ui/beanToast";
import Coupon from "@/components/public_ui/freeCoupon";
import Lead from "@/components/public_ui/lead";
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
        browseType: "pickUpMerge",
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
      commentShow: false,
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
        couponFlag: false,
      },
      (res) => {
        this.videoPlayerControl();
        if (current === this.state.userMomentsList.length - 3 && countStatus) {
          this.setState(
            {
              httpData: {
                ...httpData,
                page: httpData.page + 1,
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
      userMomentsInfo: { momentId, guideMomentFlag, ownerId },
      userMomentsInfo,
    } = this.state;
    const { homeStore } = this.props.store;
    checkPuzzleBeanLimitStatus({}, (res) => {
      const { beanLimitStatus = "1" } = res;
      if (beanLimitStatus === "1") {
        saveWatchBean(
          {
            momentId: momentId,
            ownerId,
          },
          (res) => {
            const {
              specialGoodsList = [{}],
              otherBeanAmount = "",
              otherRealPrice = "",
            } = res;
            if (guideMomentFlag === "1") {
              Taro.setStorageSync("newDeviceFlag", "0");
            }
            this.setState(
              {
                time: null,
                userMomentsInfo: {
                  ...userMomentsInfo,
                  watchStatus: "1",
                  ...specialGoodsList[0],
                  otherBeanAmount,
                  otherRealPrice,
                },
                userMomentsList: this.state.userMomentsList.map((item) => {
                  if (item.momentId === momentId) {
                    return {
                      ...item,
                      watchStatus: "1",
                      ...specialGoodsList[0],
                      otherBeanAmount,
                      otherRealPrice,
                    };
                  }
                  return item;
                }),
              },
              (res) => {
                this.setState({
                  beanflag: true,
                  beanLimitStatus,
                });
              }
            );
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
                if (item.momentId === momentId) {
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
              toast("关注成功");
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
  componentDidHide() {}
  componentDidShow() {
    const { time, player } = this.state;
    // this.listParentCategory();
    this.fetchUserShareCommission();
  }
  componentDidMount() {}
  componentWillMount() {
    const { selectObj, list, index } = this.props.store.homeStore;
    if (
      list.length === 0 &&
      getCurrentInstance().router.params.type !== "goods"
    ) {
      toast("参数异常");
    } else {
      if (getCurrentInstance().router.params.type === "goods") {
        this.setState(
          {
            httpData: {
              browseType: "pickUpMerge",
              page: 1,
              limit: "10",
            },
          },
          (res) => {
            this.getVideoList(() => {
              const { userMomentsList } = this.state;
              if (userMomentsList.length > 0) {
                this.setState({
                  userMomentsInfo: this.state.userMomentsList[0],
                });
              }
            });
          }
        );
      } else {
        this.setState({
          userMomentsList: list,
          current: index,
          userMomentsInfo: list[index],
          httpData: {
            ...this.state.httpData,
            browseType: "sameCity",
            page: Math.ceil(list.length / 10) + 1,
          },
        });
      }
    }
  }
  componentWillUnmount() {
    const { homeStore } = this.props.store;
    if (!getCurrentInstance().router.params.type) {
      homeStore.clearNavitor();
      evens.$emit("updateMomentsList", this.state.userMomentsList);
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
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?shareUserId=${userIdString}&shareUserType=user&momentId=${momentId}&ownerId=${ownerId}`,
          complete: function () {
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
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
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/perimeter/videoDetails/index?momentId=${momentId}&ownerId=${ownerId}`,
          complete: function () {
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      }
    }
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
      commentShow,
    } = this.state;
    const { homeStore = {}, commonStore = {} } = this.props.store;
    const { beanLimitStatus } = homeStore;
    const { balance } = commonStore;
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
              shareInfo={this.shareImageInfo.bind(this)}
              beanLimitStatus={beanLimitStatus}
              changeComment={() => this.setState({ commentShow: true })}
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
        <Lead balance={balance} beanLimitStatus={beanLimitStatus}></Lead>
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
