import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import TopView from "./components/top";
import VideoView from "./components/videoView";
import {
  computedClient,
  toast,
  saveFollow,
  loginStatus,
  backgroundObj,
} from "@/common/utils";
import { ScrollView, View } from "@tarojs/components";
import {
  getUserMomentList,
  saveWatchBean,
  fakeInsertUserCollectionMoment,
  fakeDeleteUserCollection,
  saveMomentType,
  checkPuzzleBeanLimitStatus,
  updateUserMomentParam,
  fetchUserShareCommission,
  fakeNewUserVideo,
} from "@/server/index";
import { getShareInfo, fetchUgcMomentRule } from "@/server/common";
import { fakRewarde } from "@/server/user";
import { inject, observer } from "mobx-react";
import Toast from "@/components/beanToast";
import Coupon from "@/components/freeCoupon";
import Lead from "@/components/lead";
import evens from "@/common/evens";
import Comment from "@/components/componentView/comment";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import NewToast from "@/components/noviceGuide";
import Router from "@/common/router";
import { fetchStorage } from "@/common/utils";
import Drawer from "@/components/Drawer";
import UgcCanvas from "@/components/videoComponents/components/ugcTimeOver";
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
        browseType: "pickUp",
        page: 1,
        limit: 10,
        newDeviceFlag: Taro.getStorageSync("newDeviceFlag") || "1",
      },
      shareInfoData: {},
      countStatus: true,
      time: {},
      interval: null,
      visible: false,
      paramsInfo: getCurrentInstance().router.params,
      beanflag: false,
      couponFlag: false,
      player: true,
      configUserLevelInfo: {},
      cavansObj: {
        data: null,
        start: false,
      },
      triggered: false,
      commentShow: false,
      ugcBeanCount: fetchStorage("ugcBeanCount") || 0,
      ugcMomentRules: {},
      ugcVisible1: false,
      ugcVisible2: false,
      animated: "",
    };
    this.interReload = null;
    this.interSwper = null;
    this.animatedTime = null;
  }
  componentWillMount() {
    this.getVideoList(() => {
      const { userMomentsList } = this.state;
      if (userMomentsList.length > 0) {
        this.setState(
          {
            userMomentsInfo: this.state.userMomentsList[0],
          },
          (res) => {
            this.setState({
              interval: true,
            });
          }
        );
      }
    });
  }
  componentDidShow() {
    this.fetchUserShareCommission();
    fetchUgcMomentRule().then((val) => {
      const { platformRewardBeanRules, rewardRules } = val;
      this.setState({
        ugcMomentRules: {
          rewardRules,
          platformRewardBeanRules,
        },
      });
    });
    Taro.setTabBarStyle({
      color: "#999999",
      selectedColor: "#FFFFFF",
      backgroundColor: "#000000",
    });
  }
  componentDidHide() {
    Taro.setTabBarStyle({
      color: "#999999",
      selectedColor: "#333333",
      backgroundColor: "FFFFFF",
    });
  }
  componentDidMount() {
    evens.$on("updateMomentsList", this.updateList.bind(this));
    evens.$on("reload", this.reload.bind(this));
  }
  saveMomentType() {
    const {
      userMomentsInfo: { momentId },
    } = this.state;
    saveMomentType({ updateType: "view", id: momentId }, (res) => {
      toast("分享成功");
    });
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
  onTransition(e) {
    const { dy } = e.detail;
    const { current } = this.state;
    if (current === 0 && dy > -200 && dy < -50) {
      if (this.interReload) {
        clearTimeout(this.interReload);
        return (this.interReload = setTimeout(() => this.selectList(), 300));
      }
      return (this.interReload = setTimeout(() => this.selectList(), 300));
    }
  }
  onReload() {
    const { httpData, interval } = this.state;
    this.setState(
      {
        triggered: true,
        httpData: { ...httpData, page: 1 },
        current: 0,
        userMomentsList: [],
        VideoList: [],
        circular: false,
        countStatus: true,

        player: true,
      },
      (res) => {
        this.getVideoList(() =>
          this.setState({
            triggered: false,
          })
        );
      }
    );
  }
  selectList(data = {}) {
    const { httpData, interval } = this.state;
    const { val, configMomentTagId } = data;
    const obj = {};
    if (val) {
      obj.browseType = val;
      obj.momentTags = configMomentTagId;
    }
    this.setState(
      {
        httpData: { ...httpData, page: 1, ...obj },
        current: 0,
        userMomentsList: [],
        VideoList: [],
        circular: false,
        countStatus: true,

        player: true,
      },
      (res) => {
        this.getVideoList(() => {
          if (this.state.userMomentsList.length > 0 && val !== "near") {
            this.setState({
              userMomentsInfo: this.state.userMomentsList[0],
            });
          }
        });
      }
    );
  }
  getVideoList(fn) {
    const { httpData, current } = this.state;
    getUserMomentList(httpData, (res) => {
      let { userMomentsList = [], beanLimitStatus } = res;
      if (userMomentsList.length === 0) {
        this.setState({
          countStatus: false,
          triggered: false,
        });
        return;
      }
      this.setState(
        {
          userMomentsList: [...this.state.userMomentsList, ...userMomentsList],
          triggered: false,
        },
        (res) => {
          fn && fn();
        }
      );
    }).catch((e) => {
      this.setState({
        triggered: false,
      });
    });
  }

  saveBean() {
    const {
      userMomentsInfo: { momentId, guideMomentFlag = "0", ownerId },
      userMomentsInfo,
    } = this.state;
    const { homeStore } = this.props.store;
    checkPuzzleBeanLimitStatus({}, (res) => {
      const { beanLimitStatus = "1" } = res;
      if (beanLimitStatus === "1") {
        if (guideMomentFlag === "1") {
          fakeNewUserVideo(
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
          saveWatchBean(
            {
              momentId: momentId,
              ownerId,
            },
            (res) => {
              this.setState(
                {
                  userMomentsInfo: {
                    ...userMomentsInfo,
                    watchStatus: "1",
                  },
                  userMomentsList: this.state.userMomentsList.map((item) => {
                    if (item.momentId === momentId) {
                      return {
                        ...item,
                        watchStatus: "1",
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
        }
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
        Taro.createVideoContext(`video${item}`).stop();
      }
    }
    Taro.createVideoContext(`video${current}`).play();
    clearTimeout(this.interSwper);
    this.interSwper = null;
  }
  stopVideoPlayerControl() {
    const { current, interval, player } = this.state;
    if (!this.interSwper) {
      if (player) {
        this.setState(
          {
            player: false,
          },
          (res) => {
            Taro.createVideoContext(`video${current}`).pause();
          }
        );
      } else {
        this.setState(
          {
            player: true,
          },
          (res) => {
            Taro.createVideoContext(`video${current}`).play();
          }
        );
      }
    }
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
      saveFollow(
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
  updateList(list = []) {
    this.setState({
      userMomentsList: list,
    });
  }
  reload() {
    let data = {};
    this.selectList(data);
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  fakeUgcBean() {
    const { ugcMomentRules, userMomentsInfo } = this.state;
    const { momentId, ownerId } = userMomentsInfo;
    const { rewardRules = {} } = ugcMomentRules;
    const { bean } = rewardRules;
    fakRewarde({
      rewardBean: bean,
      momentId: momentId,
      ownerId: ownerId,
    })
      .then((val) => {
        const { successRewardBeans } = val;
        this.setState(
          {
            userMomentsList: this.state.userMomentsList.map((item) => {
              if (item.momentId === momentId) {
                return {
                  ...item,
                  ugcRewardAmount: item.ugcRewardAmount + successRewardBeans,
                };
              }
              return item;
            }),
            animated: "",
          },
          (res) => {
            if (this.animatedTime) {
              clearTimeout(this.animatedTime);
              this.setState({
                animated: "video_beanIn",
              });
              this.animatedTime = setTimeout(() => {
                this.setState({
                  animated: "",
                });
                clearTimeout(this.animatedTime);
                this.animatedTime = null;
              }, 2000);
            } else {
              this.setState({
                animated: "video_beanIn",
              });
              this.animatedTime = setTimeout(() => {
                this.setState({
                  animated: "",
                });
                clearTimeout(this.animatedTime);
                this.animatedTime = null;
              }, 2000);
            }
          }
        );
      })
      .catch((val) => {
        const { resultCode } = val;
        console.log(val);
        if (resultCode === "5037") {
          this.setState({
            ugcVisible1: true,
          });
        }
      });
  }
  pageUpNear() {
    const {
      httpData,
      httpData: { browseType },
      countStatus,
    } = this.state;
    if (countStatus && browseType === "near") {
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
    } else {
    }
  } //上拉加载
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
    getShareInfo(
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
    updateUserMomentParam(
      {
        updateType: "share",
        id: momentId,
      },
      (res) => {}
    );
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
      userMomentsList = [],
      current,
      circular,
      userMomentsInfo = {},
      userMomentsInfo: { ownerId, relateImg },
      httpData: { browseType, momentTags },
      beanflag,
      couponFlag,
      configUserLevelInfo,
      player,
      cavansObj,
      triggered,
      paramsInfo,
      commentShow,
      ugcBeanCount,
      ugcMomentRules,
      ugcVisible1,
      ugcVisible2,
      animated,
      time,
    } = this.state;
    const {
      homeStore = {},
      authStore = {},
      activeInfoStore = {},
      locationStore = {},
    } = this.props.store;
    const { locationStatus = false } = locationStore;
    const { beanLimitStatus } = homeStore;
    const { login, shareType } = authStore;
    const { platformRewardBeanRules = {}, rewardRules = {} } = ugcMomentRules;
    const templateView = () => {
      if (userMomentsList.length > 0) {
        return (
          <>
            <VideoView
              circular={circular}
              data={userMomentsList}
              dataInfo={userMomentsInfo}
              current={current}
              ugcBeanCount={ugcBeanCount}
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
              saveUgcBean={this.fakeUgcBean.bind(this)}
              onTimeUpdate={(e) => {
                const { currentTime, duration } = e.detail;
                this.setState({
                  time: { currentTime, duration },
                });
              }}
              initVideo={() => {
                if (!player && !this.interSwper) {
                  !this.state.player &&
                    Taro.createVideoContext(`video${current}`).pause();
                }
              }}
            >
              <View className={`video_tags_box public_center ${animated}`}>
                成功赠送{rewardRules.bean}卡豆
              </View>
            </VideoView>
          </>
        );
      } else {
        return (
          <ScrollView
            scrollY
            onRefresherRefresh={this.onReload.bind(this)}
            refresherEnabled
            refresherTriggered={triggered}
            refresherBackground={"#000000"}
            className="debug_test"
            style={{
              width: "100%",
              height: "100%",
              zIndex: 100,
            }}
          >
            <View className="home_order_box public_center">
              <View>
                <View className="home_order_image home_new_nullStatus"></View>
                <View className="home_order_font">暂无捡豆视频</View>
                <View className="home_order_font1">若无数据请下拉刷新试试</View>
              </View>
            </View>
          </ScrollView>
        );
      }
    };
    return (
      <View className="home_box home_black">
        <View style={{ top: computedClient().top }} className="home_wait">
          <TopView
            data={momentTags}
            onChange={this.selectList.bind(this)}
            store={locationStatus}
            session={() => this.setState({ visible: true })}
          ></TopView>
        </View>
        <View
          className="home_bean_info"
          onClick={() => {
            Router({
              routerName: "prefecture",
            });
          }}
        ></View>
        <View className="home_video_box">{templateView()}</View>
        <Toast
          data={userMomentsInfo}
          show={beanflag}
          scan={paramsInfo || {}}
          configUserLevelInfo={configUserLevelInfo}
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
        <Lead beanLimitStatus={beanLimitStatus}></Lead>
        {!Taro.getStorageSync("deviceFlag") && (
          <NewToast
            type={"index"}
            stopVideo={() => {
              this.setState({ player: false });
            }}
            initVideo={() => {
              this.setState({ player: true }, (res) => {
                Taro.createVideoContext(`video${current}`).play();
              });
            }}
            auth={login}
            data={{ ...shareType }}
          ></NewToast>
        )}
        <TaroShareDrawer
          {...cavansObj}
          onSave={() => console.log("点击保存")}
          onClose={() =>
            this.setState({ cavansObj: { start: false, data: null } })
          }
        ></TaroShareDrawer>
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
        <View>
          <UgcCanvas
            current={current}
            time={time}
            data={momentTags}
            platformRewardBeanRules={platformRewardBeanRules}
            data={userMomentsInfo}
          ></UgcCanvas>
          {!player && (
            <View
              onClick={() => this.stopVideoPlayerControl()}
              className="player_no"
            ></View>
          )}
          {ugcVisible1 && (
            <Drawer
              show={ugcVisible1}
              closeBtn={false}
              close={() => {
                this.setState({
                  ugcVisible1: false,
                });
              }}
            >
              <View className="video_layer_ugc">
                <View className="video_layer_content">
                  <View
                    className="video_layer_userProfile merchant_dakale_logo"
                    style={backgroundObj(relateImg)}
                  ></View>
                  <View className="video_layer_title">
                    谢谢你送的{rewardRules.times}卡豆
                  </View>
                  <View className="video_layer_titleLiner">
                    我会继续努力加油出好作品
                  </View>
                  <View className="video_layer_desc">
                    你对作者的该视频打赏已达上限 作者收到的卡豆会产生金钱收益
                  </View>
                  <View
                    className="video_layer_btn public_center"
                    onClick={() => {
                      this.setState({
                        ugcVisible1: false,
                      });
                    }}
                  >
                    知道了
                  </View>
                </View>
              </View>
            </Drawer>
          )}
          {ugcVisible2 && (
            <Drawer
              show={ugcVisible2}
              closeBtn={false}
              close={() => {
                this.setState({
                  ugcVisible2: false,
                });
              }}
            >
              <View className="video_layer_ugc">
                <View className="video_layer_content">
                  <View className="video_layer_titleLiner">
                    你剩余的卡豆数量不足 无法赠送
                  </View>
                  <View className="video_layer_desc">
                    每天登陆哒卡乐看视频可以获得卡豆奖励，卡豆可以用来赠送、消费抵扣
                  </View>
                  <View
                    className="video_layer_btn public_center"
                    onClick={() => {
                      this.setState({
                        ugcVisible2: false,
                      });
                    }}
                  >
                    知道了
                  </View>
                </View>
              </View>
            </Drawer>
          )}
        </View>
      </View>
    );
  }
}
export default Index;
