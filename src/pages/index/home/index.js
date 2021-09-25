import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import TopView from "./components/top";
import VideoView from "./components/videoView";
import {
  computedClient,
  toast,
  setIntive,
  saveFollow,
  loginStatus,
  filterPath,
} from "@/common/utils";
import { ScrollView, View, Image } from "@tarojs/components";
import {
  getUserMomentList,
  saveWatchBean,
  fakeInsertUserCollectionMoment,
  fakeDeleteUserCollection,
  saveMomentType,
  getUserMomentDetailById,
  checkPuzzleBeanLimitStatus,
  updateUserMomentParam,
  fetchUserShareCommission,
} from "@/server/index";
import {
  listParentCategory,
  getShareParamInfo,
  getShareInfo,
} from "@/server/common";
import { inject, observer } from "mobx-react";
import { nearList } from "@/components/nearList";
import Toast from "@/components/beanToast";
import Waterfall from "@/components/waterfall";
import Coupon from "@/components/freeCoupon";
import Lead from "@/components/lead";
import evens from "@/common/evens";
import Comment from "@/components/componentView/comment";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import NearTitle from "./components/nearTitle";
import NewToast from "@/components/noviceGuide";
import Router from "@/common/router";
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
        limit: "10",
        newDeviceFlag: Taro.getStorageSync("newDeviceFlag") || "1",
      },
      shareInfoData: {},
      countStatus: true,
      time: null,
      interval: null,
      visible: false,
      paramsInfo: getCurrentInstance().router.params,
      distanceList: [
        { value: "", description: "全部" },
        { value: "500", description: "500m" },
        { value: "1000", description: "1km" },
        { value: "2000", description: "2km" },
        { value: "5000", description: "5km" },
        { value: "10000", description: "10km" },
        { value: "20000", description: "20km" },
      ],
      promotionTypeList: [
        { value: "", description: "全部" },
        { value: "special", description: "特价活动" },
        { value: "reduce", description: "优惠券" },
      ],
      categoryList: [],
      beanflag: false,
      couponFlag: false,
      player: true,
      configUserLevelInfo: {},
      cavansObj: {
        data: null,
        start: false,
      },
      showTwoToast: false,
      triggered: false,
      commentShow: false,
    };
    this.interReload = null;
    this.interSwper = null;
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
        time: null,
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
    const { val } = data;
    const obj = {};
    if (val) {
      obj.browseType = val;
    }
    this.setState(
      {
        httpData: { ...httpData, page: 1, ...obj },
        current: 0,
        userMomentsList: [],
        VideoList: [],
        circular: false,
        countStatus: true,
        time: null,
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
  screen(data = {}) {
    const { httpData, interval } = this.state;
    const {
      loadDistance = "",
      loadPromotionType = "",
      loadCategoryIds = [],
    } = data;

    this.setState(
      {
        httpData: {
          ...httpData,
          page: 1,
          ...{
            distance: loadDistance,
            categoryIds: loadCategoryIds.join(","),
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
            this.setState({
              userMomentsInfo: this.state.userMomentsList[0],
            });
          }
        });
      }
    );
  }
  // setScreen(data) {
  //   const { homeStore } = this.props.store;
  //   homeStore.setSelectObj(data);
  //   this.screen(data);
  // }
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

  //初始化详情数据

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
  listParentCategory() {
    const { categoryList } = this.state;
    if (categoryList.length === 0) {
      listParentCategory({}, (res) => {
        const { categoryList = [] } = res;
        this.setState({
          categoryList: [...categoryList],
        });
      });
    }
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
  updateList(list = []) {
    const { userMomentsList } = this.state;
    this.setState({
      userMomentsList: list,
    });
  }
  reload() {
    let data = {};
    this.selectList(data);
  }
  componentDidShow() {
    const { time, player } = this.state;
    // this.listParentCategory();
    this.fetchUserShareCommission();
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
  getUserMomentDetailById(momentId) {
    getUserMomentDetailById(
      {
        momentId,
      },
      (res) => {
        const { userMomentsInfo } = res;
        this.setState(
          {
            userMomentsInfo,
            userMomentsList: [userMomentsInfo],
          },
          (res) => {
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
        );
      }
    ).catch((val) => {
      this.getVideoList(() => {
        const { userMomentsList } = this.state;
        if (userMomentsList.length > 0) {
          this.setState({
            userMomentsInfo: this.state.userMomentsList[0],
          });
        }
      });
    });
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
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
        addressContentObject: { address },
        ownerId,
      },
      userMomentsInfo,
      player,
    } = this.state;
    getShareInfo(
      {
        shareType: "newVideo",
        shareId: momentId,
        subType: momentType,
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
      userMomentsInfo: { ownerId },
      httpData: { browseType },
      beanflag,
      couponFlag,
      configUserLevelInfo,
      player,
      interval,
      cavansObj,
      triggered,
      showTwoToast,
      paramsInfo,
      commentShow,
    } = this.state;
    const {
      homeStore = {},
      authStore = {},
      activeInfoStore = {},
    } = this.props.store;
    const { selectObj, beanLimitStatus } = homeStore;
    const { login, shareType } = authStore;
    const { setCount } = activeInfoStore;
    const templateView = () => {
      if (browseType === "near") {
        if (userMomentsList.length > 0) {
          return (
            <ScrollView
              scrollY
              onScrollToLower={() => {
                this.pageUpNear();
              }}
              refresherEnabled
              onRefresherRefresh={this.onReload.bind(this)}
              refresherTriggered={triggered}
              refresherBackground={"#000000"}
              className="home_Waterfall_box"
              style={{
                top: computedClient().top + computedClient().height + 20,
              }}
            >
              <NearTitle
                configUserLevelInfo={configUserLevelInfo}
                reload={triggered}
              ></NearTitle>
              <Waterfall
                list={userMomentsList}
                createDom={nearList}
                imgHight={"frontImageHeight"}
                imgWidth={"frontImageWidth"}
                setWidth={372}
                noMargin={{
                  margin: "0",
                }}
                style={{ width: Taro.pxTransform(372) }}
                store={this.props.store}
              ></Waterfall>
            </ScrollView>
          );
        } else {
          return (
            <View className="home_near_box">
              <NearTitle
                configUserLevelInfo={configUserLevelInfo}
                reload={triggered}
              ></NearTitle>
              <View>
                <View className="home_near_image  home_new_nullStatus"></View>
                <View className="home_near_font">您的附近没有内容</View>
                <View className="home_near_font2">
                  附近周边精彩内容还未发布
                </View>
              </View>
            </View>
          );
        }
      } else {
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
                initVideo={() => {
                  if (!player && !this.interSwper) {
                    !this.state.player &&
                      Taro.createVideoContext(`video${current}`).pause();
                  }
                }}
              ></VideoView>
            </>
          );
        } else {
          // if (!loginStatus() && browseType === "follow") {
          //   return (
          //     <View className="home_order_box">
          //       <View className="home_order_followImg home_new_login"></View>
          //       <View className="home_order_font">您还未登录</View>
          //       <View className="home_order_font1">
          //         登录之后，可以查看您关注的精彩内容
          //       </View>
          //       <View
          //         className="home_order_followBtn"
          //         onClick={() => Router({ routerName: "login" })}
          //       >
          //         去登录
          //       </View>
          //     </View>
          //   );
          // }
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
                  <View className="home_order_font">
                    {browseType === "commend"
                      ? "我们正在努力探索更多城市，敬请期待"
                      : "暂无捡豆视频"}
                  </View>
                  <View className="home_order_font1">
                    若无数据请下拉刷新试试
                  </View>
                </View>
              </View>
            </ScrollView>
          );
        }
      }
    };
    return (
      <View className="home_box home_black">
        <View style={{ top: computedClient().top }} className="home_wait">
          <TopView
            data={browseType}
            onChange={this.selectList.bind(this)}
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
        {!player && (
          <View
            onClick={() => this.stopVideoPlayerControl()}
            className="player_no"
          ></View>
        )}
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
      </View>
    );
  }
}
export default Index;
