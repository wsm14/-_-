import React, { Component } from "react";
import Taro, { getCurrentInstance, EventChannel } from "@tarojs/taro";
import { View, Text, CoverView } from "@tarojs/components";
import GetBeanCanvas from "@/components/getBeanCanvas";
import StopBean from "@/components/stopBean";
import Toast from "@/components/beanToast";
import Video from "@/components/video";
import { kol } from "@/api/api";
import APPShare from "@/components/shareApp";
import { httpGet, httpPost } from "@/api/newRequest";
import {
  backgroundObj,
  setPeople,
  navigateTo,
  saveFollow,
  deleteFollow,
  saveCollection,
  deleteCollection,
  setIntive,
  saveFall,
  deleteFall,
  toast,
  onShareFriend,
  onTimeline,
  getDom,
} from "@/common/utils";
import touch from "@/common/touch";
import classNames from "classnames";
import "./index.scss";
import evens from "@/common/evens";
import Router from "@/common/router";
import { inject, observer } from "mobx-react";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      kolMomentsInfo: {},
      httpData: {
        kolMomentId:
          getCurrentInstance().router.params.kolMomentId ||
          "1317009859036827649",
      },
      visible: false,
      toast: false,
      beanSet: false,
      initDec: true,
      shareStatus: getCurrentInstance().router.params.type || "",
      viewFlag: true,
      stopStatus: false,
      decStatus: null,
      lookStatus: "1",
      reportStatus: false,
    };
  }
  shareDetailsById() {
    // 阻止事件冒泡
    const { httpData } = this.state;
    const {
      shareDetails: { getMomentDetail },
    } = kol;
    httpGet({ url: getMomentDetail, data: httpData }, (res) => {
      const {
        kolMomentsInfo,
        kolMomentsInfo: { beanFlag, userLevel },
      } = res;
      if (userLevel === "0" || beanFlag != "1") {
        this.setState({
          kolMomentsInfo,
          visible: false,
        });
        return;
      }
      this.setState(
        {
          kolMomentsInfo,
          lookStatus: kolMomentsInfo.watchStatus,
          visible: false,
          beanSet: true,
        },
        (res) => {
          if (
            this.state.kolMomentsInfo.watchStatus == 0 &&
            !this.state.interval &&
            !this.state.time
          ) {
            this.setState(
              {
                time: this.state.kolMomentsInfo.length,
              },
              (res) => {
                this.setState({
                  interval: setIntive(this.state.time, this.getBean.bind(this)),
                });
              }
            );
          } else if (
            this.state.kolMomentsInfo.watchStatus == 0 &&
            (this.state.time || this.state.time === 0)
          ) {
            this.initInterval();
          }
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
      kolMomentsInfo: { kolMomentId, userIdString },
      kolMomentsInfo,
    } = this.state;
    const {
      shareDetails: { saveWatch },
    } = kol;
    httpPost(
      {
        data: {
          momentId: kolMomentId,
          momentUserId: userIdString,
        },
        url: saveWatch,
      },
      (res) => {
        this.setState({
          toast: true,
          kolMomentsInfo: { ...kolMomentsInfo, watchStatus: "1" },
        });
      }
    );
  } //领取卡豆
  followStatus(e) {
    e.stopPropagation();
    let that = this;
    const {
      kolMomentsInfo,
      kolMomentsInfo: {
        userFollowStatus,
        merchantIdString,
        merchantId,
        userIdString,
        userType,
      },
    } = this.state;
    if (userFollowStatus === "1") {
      let that = this;
      const {
        kolMomentsInfo: { userIdString },
      } = this.state;
      deleteFollow(
        {
          followUserId: userIdString,
        },
        () => {
          that.setState(
            {
              kolMomentsInfo: {
                ...kolMomentsInfo,
                userFollowStatus: "0",
              },
            },
            (res) => {
              toast("取消成功");
            }
          );
        }
      );
    } else {
      let type = "user";
      if (merchantId && merchantIdString) {
        type = "merchant";
      }
      saveFollow(
        {
          followType: type,
          followUserId: userIdString,
        },
        () =>
          that.setState(
            {
              kolMomentsInfo: {
                ...kolMomentsInfo,
                userFollowStatus: "1",
              },
            },
            (res) => {
              toast("关注成功");
            }
          )
      );
    }
  }
  //用户关注状态
  collectionStatus() {
    let that = this;
    const {
      kolMomentsInfo: { kolMomentId, momentCollectionStatus },
      kolMomentsInfo,
    } = this.state;
    if (momentCollectionStatus === "1") {
      deleteCollection(
        {
          collectionType: "kolMoments",
          collectionId: kolMomentId,
        },
        () => {
          that.setState({
            kolMomentsInfo: {
              ...kolMomentsInfo,
              momentCollectionStatus: "0",
              collectionAmount: kolMomentsInfo.collectionAmount - 1,
            },
          });
        }
      );
    } else {
      saveCollection(
        {
          collectionType: "kolMoments",
          collectionId: kolMomentId,
        },
        () => {
          that.setState({
            kolMomentsInfo: {
              ...kolMomentsInfo,
              momentCollectionStatus: "1",
              collectionAmount: kolMomentsInfo.collectionAmount + 1,
            },
          });
        }
      );
    }
  }
  //用户收藏信息
  fallStatus() {
    let that = this;
    const {
      kolMomentsInfo: { kolMomentId, userLikeStatus },
      kolMomentsInfo,
    } = this.state;
    if (userLikeStatus === "1") {
      deleteFall(
        {
          kolMomentsId: kolMomentId,
        },
        () => {
          that.setState({
            kolMomentsInfo: {
              ...kolMomentsInfo,
              userLikeStatus: "0",
              likeAmount: kolMomentsInfo.likeAmount - 1,
            },
          });
        }
      );
    } else {
      saveFall(
        {
          kolMomentsId: kolMomentId,
        },
        () => {
          that.setState({
            kolMomentsInfo: {
              ...kolMomentsInfo,
              userLikeStatus: "1",
              likeAmount: kolMomentsInfo.likeAmount + 1,
            },
          });
        }
      );
    }
  }
  kolStatus() {
    const {
      kolMomentsInfo: { merchantIdString, userLevel },
    } = this.state;
    if (merchantIdString || userLevel > 1) {
      return true;
    }
    return false;
  }
  //用户收藏信息
  //用户点赞信息
  stopInterval(obj) {
    clearInterval(obj);
    this.setState({
      interval: null,
    });
  }

  initInterval() {
    if (!this.state.interval && this.state.time) {
      this.setState({
        interval: setIntive(this.state.time, this.getBean.bind(this)),
      });
    }
  }

  errorToast(e) {
    this.setState({
      Toast: {
        status: "error",
        text: e,
        isOpened: true,
      },
    });
  }

  link_stop(fn) {
    const {
      time,
      kolMomentsInfo: { userIdString },
    } = this.state;
    if (time) {
      this.setState(
        {
          stopStatus: true,
          linkFn: fn,
        },
        (res) => {
          this.stopInterval(this.state.interval);
          Taro.createVideoContext("video", this).pause();
        }
      );
    } else {
      fn && fn();
    }
  }

  canfirm() {
    this.setState(
      {
        stopStatus: false,
      },
      (res) => {
        Taro.createVideoContext("video", this).play();
      }
    );
  }

  cancel() {
    this.setState(
      {
        stopStatus: false,
      },
      (res) => {
        this.state.linkFn && this.state.linkFn();
      }
    );
  }
  componentDidHide() {
    this.stopInterval(this.state.interval);
  }
  componentWillUnmount() {
    const { kolMomentsInfo } = this.state;
    if (Object.keys(kolMomentsInfo).length > 0) {
      evens.$emit("updateList", kolMomentsInfo);
    }
  }
  componentDidShow() {
    this.shareDetailsById();
  }
  setShowStatus() {
    getDom(".shareVideo_dec_box", (res) => {
      if (res[0]) {
        const { height } = res[0];
        if (height > 46) {
          this.setState({
            decStatus: true,
          });
        }
      }
    });
  }
  onReady() {
    setTimeout(this.setShowStatus.bind(this), 500);
  }
  onShareAppMessage() {
    const {
      kolMomentsInfo: { title, frontImage },
    } = this.state;
    return onShareFriend({
      title: title,
      img: frontImage,
    });
  }
  onShareTimeline() {
    const {
      kolMomentsInfo: { title, frontImage },
    } = this.state;
    return onTimeline({
      title: title,
      img: frontImage,
    });
  }
  render() {
    const navSetting = {
      style: {
        background: "rgba(255,255,255,0)",
      },
      type: "white",
    };
    const {
      decStatus,
      toast,
      kolMomentsInfo,
      videoSetting,
      beanSet,
      kolMomentsInfo: {
        watchStatus,
        beanAmount,
        message,
        topicIdString,
        topicName,
        interactionTime,
        collectionAmount, //收藏數量
        distanceRange, //距離
        userProfile, //頭像
        userFollowStatus, //關注狀態
        likeAmount, //點贊，
        username,
        userLikeStatus, //點贊狀態
        momentCollectionStatus, //收藏狀態,
        merchantIdString,
        merchantCover,
        merchantName,
        merchantCategoryName,
        merchantAddress,
        userLevel,
        merchantCityName,
        userIdString,
        length,
        goodsName,
        goodsPrice,
        kolActivityIdString,
        userLevelImage,
        kolMomentId,
        contentType,
      },
      time,
      shareStatus,
      viewFlag,
      stopStatus,
      lookStatus,
      reportStatus,
    } = this.state;
    if (Object.keys(kolMomentsInfo).length > 0) {
      return (
        <View className="shareVideo_box">
          {stopStatus && (
            <StopBean
              canfirm={() => this.canfirm()}
              cancel={() => this.cancel()}
            ></StopBean>
          )}
          {shareStatus == "share" && (
            <APPShare
              {...{
                content: "我在哒卡乐发了一篇有趣的视频",
                userId: getCurrentInstance().router.params.shareUserId,
                jumpObj: {
                  jumpUrl: "MomentVideoKol",
                  momentId: getCurrentInstance().router.params.kolMomentId,
                  type: "jumpToPage",
                  jumpType: "native",
                  path: "DKLShareKOLVideoPlayerViewController",
                  params: {
                    momentId: getCurrentInstance().router.params.kolMomentId,
                  },
                },
              }}
            ></APPShare>
          )}
          <View
            onTouchStart={(e) => {
              touch.touchStart(e);
            }}
            onLongPress={() =>
              this.setState({
                reportStatus: true,
              })
            }
            onClick={(e) =>
              touch.multipleTap(e, () =>
                this.setState({ viewFlag: !this.state.viewFlag })
              )
            }
            className="shareVideo_setting"
          >
            <Video
              kolMomentsInfo={kolMomentsInfo}
              onPlay={() => this.initInterval()}
              {...videoSetting}
              onPause={() => this.stopInterval(this.state.interval)}
            ></Video>
          </View>
          <View style={!viewFlag ? { visibility: "hidden" } : {}}>
            <View className={"animated fadeInUp shareVideo_details_box"}>
              <View style={{ display: "flex", alignItems: "center" }}>
                <View
                  className="shareVideo_userProfile"
                  style={backgroundObj(userProfile)}
                  onClick={() =>
                    this.link_stop(() =>
                      navigateTo(
                        `/pages/newUser/userDetails/index?userStingId=${userIdString}&type=share`
                      )
                    )
                  }
                ></View>
                <View
                  className="shareVideo_tipIcon"
                  style={backgroundObj(userLevelImage)}
                ></View>
                <View className="shareVideo_userName font_hide">
                  {username}
                </View>
                <View
                  onClick={(e) => this.followStatus(e)}
                  className={classNames(
                    userFollowStatus === "0"
                      ? "shareVideo_installNow"
                      : "shareVideo_install"
                  )}
                >
                  {userFollowStatus === "0" ? "关注" : "已关注"}
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: Taro.pxTransform(220),
                }}
              >
                <View
                  onClick={() => this.fallStatus()}
                  className={classNames(
                    "shareVideo_icon_size",
                    userLikeStatus === "1"
                      ? "shareVideo_zd_icon2"
                      : "shareVideo_zd_icon1"
                  )}
                ></View>
                <View className="shareVideo_icon_num">
                  {setPeople(likeAmount)}
                </View>
                {this.kolStatus() && (
                  <View style={{ display: "flex", alignItems: "center" }}>
                    <View
                      className={classNames(
                        "shareVideo_icon_size",
                        momentCollectionStatus === "1"
                          ? "shareVideo_shoucang_icon2"
                          : "shareVideo_shoucang_icon1"
                      )}
                      onClick={() => this.collectionStatus()}
                    ></View>
                    <View className="shareVideo_icon_num">
                      {setPeople(collectionAmount)}
                    </View>
                  </View>
                )}
              </View>
            </View>
            {this.kolStatus() && (
              <View className="bounceInUp animated shareVideo_shop">
                {kolActivityIdString &&
                  this.props.store.activeStore.activeStatusObj.kolGoods ===
                    "1" && (
                    <View className="shareVideo_shop_couponBox">
                      {/*<View className='public_center coupon_box'>*/}
                      {/*  <View className='coupon_icon'></View>*/}
                      {/*  <View className='coupon_font'>看完领券</View>*/}
                      {/*</View>*/}
                      <View
                        className="goshop public_center"
                        onClick={() =>
                          this.link_stop(() =>
                            navigateTo(
                              `/pages/perimeter/shopDetails/index?merchantId=${merchantIdString}&kolActivityIdString=${kolActivityIdString}&kolMomentsId=${
                                getCurrentInstance().router.params.kolMomentId
                              }`
                            )
                          )
                        }
                      >
                        <View className="shop_icon"></View>
                        <View className="shop_font font_hide">
                          <Text className="shop_video_good font_hide">
                            {goodsName}
                          </Text>
                          <Text style={{ fontSize: Taro.pxTransform(20) }}>
                            {" ¥ "}
                          </Text>
                          <Text style={{ fontSize: Taro.pxTransform(28) }}>
                            {goodsPrice}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                <View
                  className="sharekol_merchant"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.link_stop(() =>
                      navigateTo(
                        `/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`
                      )
                    );
                  }}
                >
                  <View className="shareVideo_shopDetails">
                    <View
                      className="shareVideo_shopProfile"
                      style={backgroundObj(merchantCover)}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.link_stop(() =>
                          navigateTo(
                            `/pages/newUser/merchantDetails/index?userId=${merchantIdString}`
                          )
                        );
                      }}
                    ></View>
                    <View className="shareVideo_shopFont">
                      <View className="shareVideo_shopName font_hide">
                        {merchantName}
                      </View>
                      <View className="shareVideo_shopTag font_hide">
                        {merchantCityName ||
                          "杭州" +
                            "·" +
                            merchantCategoryName +
                            " ｜ " +
                            distanceRange +
                            " | " +
                            merchantAddress}
                      </View>
                    </View>
                  </View>
                  <View className="shareVideo_merchant"></View>
                </View>
                <View
                  className={classNames(
                    "shareVideo_dec_box",
                    decStatus && "shareVideo_dec_expand"
                  )}
                >
                  {topicIdString && userLevel && userLevel !== "0" && (
                    <View
                      onClick={() =>
                        Router({
                          routerName: "tipView",
                          args: {
                            topicId: topicIdString,
                          },
                        })
                      }
                      className="shareVideo_conversation"
                    >
                      <Text className="shareVideo_conversationBox">
                        {"#" + topicName}
                      </Text>
                    </View>
                  )}
                  {message}
                </View>
                <View className="shareVideo_dec_details">
                  {decStatus && (
                    <View
                      className="shareVideo_dec_hide"
                      onClick={() => {
                        this.setState({ decStatus: false });
                      }}
                    >
                      <View style={{ width: "100%", textAlign: "right" }}>
                        展开
                      </View>
                      {/*<View className='shareVideo_dec_hideIcon'></View>*/}
                    </View>
                  )}
                  {!decStatus && decStatus !== null && (
                    <View
                      className="shareVideo_dec_hide"
                      onClick={() => {
                        this.setState({ decStatus: true });
                      }}
                    >
                      <View className="font24 color6">
                        {"发布于" + interactionTime}
                      </View>
                      <View>收起</View>
                      {/*<View className='shareVideo_dec_hideIcon'></View>*/}
                    </View>
                  )}
                </View>
              </View>
            )}
            {beanSet && (
              <GetBeanCanvas
                beanStatus={watchStatus}
                beanNum={beanAmount}
                interval={time}
                length={length}
                lookStatus={lookStatus}
              ></GetBeanCanvas>
            )}
            {toast && (
              <Toast
                data={kolMomentsInfo}
                visible={() => {
                  this.setState({
                    toast: false,
                    lookStatus: true,
                  });
                }}
              ></Toast>
            )}
          </View>
          {shareStatus !== "share" && reportStatus && (
            <CoverView
              className="report_layer_byUser"
              onClick={(e) => {
                e.stopPropagation();
                this.setState({ reportStatus: false });
              }}
            >
              <CoverView
                className="report_layer_btn"
                onClick={(e) =>
                  navigateTo(
                    `/pages/kol/report/index?name=${username}&momentsId=${kolMomentId}&pushUserId=${userIdString}&momentsType=${contentType}`
                  )
                }
              >
                举报
              </CoverView>
            </CoverView>
          )}
        </View>
      );
    } else return null;
  }
}
export default Index;
