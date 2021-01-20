import React, { Component, useState } from "react";
import Taro, { getCurrentInstance, EventChannel } from "@tarojs/taro";
import { View, Text, CoverView } from "@tarojs/components";
import GetBeanCanvas from "@/components/getBeanCanvas";
import StopBean from "@/components/stopBean";
import Toast from "@/components/beanToast";
import Video from "@/components/video";
import {
  getUserMomentDetailById,
  saveWatchBean,
  saveMerchantCollection,
  closeMerchantCollection,
  updateMomentsLikeAmount,
  deleteMomentsLikeAmount,
} from "@/server/index";
import APPShare from "@/components/shareApp";
import classNames from "classnames";
import {
  imgList,
  backgroundObj,
  setPeople,
  saveFollow,
  deleteFollow,
  navigateTo,
  setIntive,
  toast,
  onShareFriend,
  onTimeline,
  getDom,
} from "@/common/utils";
import touch from "@/common/touch";
import "./index.scss";
import evens from "@/common/evens";
import Coupons from "@/components/coupon";
import { getAvailableCoupon } from "@/server/coupon";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        momentId: getCurrentInstance().router.params.momentId || "",
      },
      userMomentsInfo: {},
      visible: false,
      toast: false,
      beanSet: false,
      initDec: true,
      shareStatus: getCurrentInstance().router.params.type || "",
      viewFlag: true,
      stopStatus: false,
      decStatus: null,
      lookStatus: "1",
      conpouVisible: false,
      couponList: [],
    };
  }

  onReady() {
    setTimeout(this.setShowStatus.bind(this), 500);
  }
  componentDidMount() {
    this.getAvailable();
  }
  getAvailable() {
    getAvailableCoupon(
      {
        identifyId: getCurrentInstance().router.params.momentId,
        channel: "moment",
        merchantId: getCurrentInstance().router.params.merchantId,
      },
      (res) => {
        const { couponList } = res;
        this.setState({
          couponList,
        });
      }
    );
  }
  componentDidShow() {
    this.shareDetailsById();
  }

  followStatus(e) {
    e.stopPropagation();
    let that = this;
    const {
      userMomentsInfo,
      userMomentsInfo: {
        merchantFollowStatus,
        merchantIdString,
        merchantId,
        userIdString,
        userType,
      },
    } = this.state;
    if (merchantFollowStatus === "1") {
      let that = this;
      const {
        userMomentsInfo: { userIdString },
      } = this.state;
      deleteFollow(
        {
          followUserId: userIdString,
        },
        () => {
          that.setState(
            {
              userMomentsInfo: {
                ...userMomentsInfo,
                merchantFollowStatus: "0",
              },
            },
            (res) => {
              toast("取消成功");
            }
          );
        }
      );
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
      userMomentsInfo: { momentId, merchantCollectionStatus },
      userMomentsInfo,
    } = this.state;
    if (merchantCollectionStatus === "1") {
      closeMerchantCollection(
        {
          collectionId: momentId,
        },
        () => {
          that.setState({
            userMomentsInfo: {
              ...userMomentsInfo,
              merchantCollectionStatus: "0",
              collectionAmount: parseInt(userMomentsInfo.collectionAmount) - 1,
            },
          });
        }
      );
    } else {
      saveMerchantCollection(
        {
          collectionId: momentId,
        },
        () => {
          that.setState({
            userMomentsInfo: {
              ...userMomentsInfo,
              merchantCollectionStatus: "1",
              collectionAmount: parseInt(userMomentsInfo.collectionAmount) + 1,
            },
          });
        }
      );
    }
  }
  fallStatus() {
    let that = this;
    const {
      userMomentsInfo: { momentId, userLikeStatus },
      userMomentsInfo,
    } = this.state;
    if (userLikeStatus === "1") {
      deleteMomentsLikeAmount({ likeId: momentId }, (res) => {
        that.setState({
          userMomentsInfo: {
            ...userMomentsInfo,
            userLikeStatus: "0",
            likeAmount: parseInt(userMomentsInfo.likeAmount) - 1,
          },
        });
      });
    } else {
      updateMomentsLikeAmount({ likeId: momentId }, (res) => {
        that.setState({
          userMomentsInfo: {
            ...userMomentsInfo,
            userLikeStatus: "1",
            likeAmount: parseInt(userMomentsInfo.likeAmount) + 1,
          },
        });
      });
    }
  }

  //用户点赞信息
  onShareAppMessage() {
    const {
      userMomentsInfo: { title, frontImage },
    } = this.state;
    return onShareFriend({
      title: title,
      img: frontImage,
    });
  }

  onShareTimeline() {
    const {
      userMomentsInfo: { title, frontImage },
    } = this.state;
    onTimeline({
      title: title,
      img: frontImage,
    });
  }

  //用户收藏信息
  shareDetailsById() {
    // 阻止事件冒泡
    const { httpData, bannerSetting } = this.state;
    getUserMomentDetailById(httpData, (res) => {
      console.log(res);
      const {
        userMomentsInfo,
        userMomentsInfo: { imageContent, imageHost, beanFlag },
      } = res;
      if (beanFlag != "1") {
        this.setState({
          userMomentsInfo,
          visible: false,
          bannerSetting: {
            ...bannerSetting,
            data: imgList(imageContent, imageHost, "key"),
          },
        });
        return;
      } else {
        this.setState(
          {
            userMomentsInfo,
            lookStatus: userMomentsInfo.watchStatus,
            visible: false,
            beanSet: true,
            bannerSetting: {
              ...bannerSetting,
              data: imgList(imageContent, imageHost, "key"),
            },
          },
          (res) => {
            if (
              this.state.userMomentsInfo.watchStatus == 0 &&
              !this.state.interval &&
              !this.state.time
            ) {
              this.setState(
                {
                  time: this.state.userMomentsInfo.length,
                },
                (res) => {
                  this.setState({
                    interval: setIntive(
                      this.state.time,
                      this.getBean.bind(this)
                    ),
                  });
                }
              );
            } else if (
              this.state.userMomentsInfo.watchStatus == 0 &&
              (this.state.time || this.state.time === 0)
            ) {
              this.initInterval();
            }
          }
        );
      }
    });
  }

  initInterval() {
    if (!this.state.interval && this.state.time) {
      this.setState({
        interval: setIntive(this.state.time, this.getBean.bind(this)),
      });
    }
  }
  //初始化详情数据
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
      userMomentsInfo: { momentId, beanLimitStatus },
      userMomentsInfo,
    } = this.state;
    if (beanLimitStatus === "1") {
      saveWatchBean(
        {
          momentId,
        },
        (res) => {
          this.setState({
            toast: true,
            userMomentsInfo: { ...userMomentsInfo, watchStatus: "1" },
          });
        }
      );
    } else {
    }
  }
  //领取卡豆
  errorToast(e) {}

  stopInterval(obj) {
    clearInterval(obj);
    this.setState({
      interval: null,
    });
  }

  link_stop(fn) {
    const { time } = this.state;
    if (time) {
      this.setState(
        {
          stopStatus: true,
          linkFn: fn,
        },
        (res) => {
          this.stopInterval(this.state.interval);
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
        this.initInterval();
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
  componentDidHide() {
    this.stopInterval(this.state.interval);
  }
  componentWillUnmount() {
    const { userMomentsInfo } = this.state;
    evens.$emit("updateShareList", userMomentsInfo);
  }
  render() {
    const {
      decStatus,
      toast,
      userMomentsInfo,
      videoSetting,
      beanSet,
      userMomentsInfo: {
        merchantIdString, //商家id'
        merchantCover, //商家組圖
        merchantName, //商家名稱
        merchantCategoryName, //商家標簽名稱
        merchantAddress, //商家地址
        topicIdString,
        title, //標題
        message, //内容
        collectionAmount, //收藏數量
        distanceRange, //距離
        userProfile, //頭像
        merchantFollowStatus, //關注狀態
        likeAmount, //點贊，
        username,
        userLikeStatus, //點贊狀態
        merchantCollectionStatus, //收藏狀態,
        userIdString,
        watchStatus,
        topicId,
        topicName,
        beanAmount,
        interactionTime,
        merchantCityName,
        length,
        couponIds,
        beanLimitStatus,
      },
      time,
      shareStatus,
      viewFlag,
      stopStatus,
      lookStatus,
      couponList,
      conpouVisible,
    } = this.state;
    if (Object.keys(userMomentsInfo).length > 0) {
      return (
        <View className="lookVideo_box">
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
                  jumpUrl: "videoMomentDetailPage",
                  id: getUserMomentDetail.momentId,
                  type: "jumpToPage",
                  jumpType: "native",
                  path: "videoMomentDetailPage",
                  params: { id: getUserMomentDetail.momentId },
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
              kolMomentsInfo={userMomentsInfo}
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
                <View className="shareVideo_userName font_hide">
                  {username}
                </View>
                <View
                  onClick={(e) => this.followStatus(e)}
                  className={classNames(
                    merchantFollowStatus === "0"
                      ? "shareVideo_installNow"
                      : "shareVideo_install"
                  )}
                >
                  {merchantFollowStatus === "0" ? "关注" : "已关注"}
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

                <View style={{ display: "flex", alignItems: "center" }}>
                  <View
                    className={classNames(
                      "shareVideo_icon_size",
                      merchantCollectionStatus === "1"
                        ? "shareVideo_shoucang_icon2"
                        : "shareVideo_shoucang_icon1"
                    )}
                    onClick={() => this.collectionStatus()}
                  ></View>
                  <View className="shareVideo_icon_num">
                    {setPeople(collectionAmount)}
                  </View>
                </View>
              </View>
            </View>
            <View className="bounceInUp animated shareVideo_shop">
              {(couponList.length>0 && watchStatus  ===  '0') && (
                <View className="shareVideo_shop_couponBox">
                  <View className="public_center coupon_index_box">
                    <View className="coupon_icon"></View>
                    <View className="coupon_font">看完领券</View>
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
                {topicIdString && (
                  <View className="shareVideo_conversation">
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
            {beanSet && (
              <GetBeanCanvas
                beanStatus={watchStatus}
                beanNum={beanAmount}
                interval={time}
                length={length}
                lookStatus={lookStatus}
                getBeanStatus={beanLimitStatus}
              ></GetBeanCanvas>
            )}
            {toast && (
              <Toast
                data={userMomentsInfo}
                visible={() => {
                  if (couponList.length > 0) {
                    this.setState({
                      toast: false,
                      lookStatus: "1",
                      conpouVisible: true,
                    });
                  } else {
                    this.setState({
                      toast: false,
                      lookStatus: "1",
                    });
                  }
                }}
              ></Toast>
            )}
            {conpouVisible && (
              <Coupons
                title={"看分享大礼包"}
                visible={() => {
                  this.setState({ conpouVisible: false });
                }}
                type={"moment"}
                data={couponList}
              ></Coupons>
            )}
          </View>
        </View>
      );
    } else return null;
  }
}
export default Index;
