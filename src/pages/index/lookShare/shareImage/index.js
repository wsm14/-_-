import React, { Component, useState } from "react";
import Taro, { getCurrentInstance, EventChannel } from "@tarojs/taro";
import { View, Text, CoverView } from "@tarojs/components";
import GetBeanCanvas from "@/components/getBeanCanvas";
import StopBean from "@/components/stopBean";
import Banner from "@/components/banner";
import Toast from "@/components/beanToast";
import Coupons from "@/components/coupon";
import { getAvailableCoupon } from "@/server/coupon";
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
  objStatus,
} from "@/common/utils";
import "./index.scss";
import evens from "@/common/evens";
export default class ShareImage extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        momentId: getCurrentInstance().router.params.momentId || "",
      },
      userMomentsInfo: {},
      visible: false,
      bannerSetting: {
        style: {
          width: "100%",
          height: Taro.pxTransform(810),
        },
        showToast: true,
        imgName: "key",
        data: [],
        height: "height",
      },
      toast: false,
      time: null,
      beanSet: false,
      shareStatus: getCurrentInstance().router.params.type || "",
      stopStatus: false,
      getBeanNow: false,
      lookStatus: "1",
      conpouVisible: false,
      couponList: [],
      shareUserId:getCurrentInstance().router.params.shareUserId||''
    };
  }
  componentDidMount() {
    this.getAvailable();
  }

  componentDidShow() {
    this.shareDetailsById();
  }
  getAvailable() {
    getAvailableCoupon(
      {
        identifyId: getCurrentInstance().router.params.momentId,
        channel: 'moment',
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
  componentDidHide() {
    this.stopInterval(this.state.interval);
  }
  componentWillUnmount() {
    const { userMomentsInfo } = this.state;
    evens.$emit("updateShareList", userMomentsInfo);
  }
  render() {
    const {
      userMomentsInfo,
      userMomentsInfo: {
        merchantIdString, //商家id'
        merchantCover, //商家組圖
        merchantName, //商家名稱
        merchantCategoryName, //商家標簽名稱
        merchantAddress, //商家地址
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
      bannerSetting,
      toast,
      beanSet,
      shareStatus,
      stopStatus,
      lookStatus,
      couponList,
      conpouVisible,
      httpData:{
        momentId
      },
      shareUserId
    } = this.state;
    if (objStatus(userMomentsInfo)) {
      return (
        <View className="lookImage_box">
          {shareStatus == "share" && (
            <APPShare
              {...{
                content: "我在哒卡乐发了一篇有趣的图文",
                userId: shareUserId,
                jumpObj: {
                  jumpUrl: "imageMomentDetailPage",
                  id: momentId,
                  type: "jumpToPage",
                  jumpType: "native",
                  path: "imageMomentDetailPage",
                  params: { id: momentId },
                },
              }}
            ></APPShare>
          )}
          {stopStatus && (
            <StopBean
              canfirm={() => this.canfirm()}
              cancel={() => this.cancel()}
            ></StopBean>
          )}
          <Banner {...bannerSetting}></Banner>
          <View className="shareImage_details">
            <View className="sharekol_Image">
              <View className="shareImage_shopDetails">
                <View
                  className="shareImage_shopProfile"
                  style={backgroundObj(merchantCover)}
                  onClick={() =>
                    this.link_stop(() =>
                      navigateTo(
                        `/pages/newUser/merchantDetails/index?userId=${merchantIdString}`
                      )
                    )
                  }
                ></View>
                <View className="shareImage_shopFont">
                  <View className="shareImage_shopName font_hide">
                    {merchantName}
                  </View>
                  <View className="shareImage_shopTag font_hide">
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
              <View
                className="shareImage_merchant"
                onClick={() =>
                  this.link_stop(() =>
                    navigateTo(
                      `/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`
                    )
                  )
                }
              ></View>
            </View>
            {/*//商家详情*/}
            {(couponList.length>0 && watchStatus  ===  '0' && beanLimitStatus ==='1') && (
              <View className="shareImage_shop_couponBox">
                <View className="public_center image_coupon_box">
                  <View className="image_coupon_icon"></View>
                  <View className="image_coupon_font">看完领券</View>
                </View>
              </View>
            )}
            <View className="shareImage_title">{title}</View>
            {/*//文章名称*/}
            {topicId && topicName && (
              <View className="shareImage_conversation font_hide">
                #{topicName}
              </View>
            )}
            {/*//文章话题*/}
            <View className="shareImage_dec">{message}</View>
            {/*//文章详情*/}
            <View className="shareImage_time">
              {"发布于" + interactionTime}
            </View>
            {/*//文章时间*/}
          </View>
          <View className={"animated fadeInUp shareImages_details_box"}>
            <View style={{ display: "flex", alignItems: "center" }}>
              <View
                className="shareImages_userProfile"
                style={backgroundObj(userProfile)}
                onClick={() =>
                  this.link_stop(() =>
                    navigateTo(
                      `/pages/newUser/merchantDetails/index?userId=${merchantIdString}`
                    )
                  )
                }
              ></View>
              <View className="shareImages_userName font_hide">{username}</View>
              <View
                onClick={(e) => this.followStatus(e)}
                className={classNames(
                  merchantFollowStatus === "0"
                    ? "shareImages_installNow"
                    : "shareImages_install"
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
                 style={{visibility:'hidden'}}
                onClick={() => this.fallStatus()}
                className={classNames(
                  "shareImages_icon_size",
                  userLikeStatus === "1"
                    ? "shareImages_zd_icon2"
                    : "shareImages_zd_icon1"
                )}
              ></View>
              <View style={{visibility:'hidden'}} className="shareImages_icon_num">
                {setPeople(likeAmount)}
              </View>
              {
                <View style={{ display: "flex", alignItems: "center" }}>
                  <View
                    className={classNames(
                      "shareImages_icon_size",
                      merchantCollectionStatus === "1"
                        ? "shareImages_shoucang_icon2"
                        : "shareImages_shoucang_icon1"
                    )}
                    onClick={() => this.collectionStatus()}
                  ></View>
                  <View className="shareImages_icon_num">
                    {setPeople(collectionAmount)}
                  </View>
                </View>
              }
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
              type={'moment'}
              data={couponList}
            ></Coupons>
          )}
        </View>
      );
    }
    return null;
  }
}
