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
} from "@/common/utils";
import { ScrollView, View } from "@tarojs/components";
import InterVal from "@/components/setTimeCanvas";
import {
  getUserMomentList,
  saveWatchBean,
  saveMerchantCollection,
  closeMerchantCollection,
  saveMomentType,
  getUserMomentDetailById,
  checkPuzzleBeanLimitStatus,
  updateUserMomentParam,
  fetchUserShareCommission,
} from "@/server/index";
import { listParentCategory, getShareParamInfo } from "@/server/common";
import "./index.scss";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import { nearList } from "@/components/nearList";
import Toast from "@/components/beanToast";
import Waterfall from "@/components/waterfall";
import Coupon from "@/components/freeCoupon";
import Lead from "@/components/lead";
import evens from "@/common/evens";
import Router from "@/common/router";
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
        browseType: "commend",
        page: 1,
        limit: "10",
        newDeviceFlag: Taro.getStorageSync("newDeviceFlag") || "1",
      },
      countStatus: true,
      time: null,
      interval: null,
      visible: false,
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
      beanLimitStatus: "1",
      player: true,
      configUserLevelInfo: {},
    };
    this.interReload = null;
    this.interSwper = null;
  }
  saveMomentType() {
    const {
      userMomentsInfo: { userMomentIdString },
    } = this.state;
    saveMomentType({ updateType: "view", id: userMomentIdString }, (res) => {
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
        time: null,
        couponFlag: false,
      },
      (res) => {
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
  selectList(data = {}) {
    console.log(data);
    const { httpData, interval } = this.state;
    const { val } = data;
    const obj = {};
    if (val) {
      obj.browseType = val;
    }
    if (interval) {
      this.stopInterval(interval);
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
    getUserMomentList(httpData, (res) => {
      let { userMomentsList = [], beanLimitStatus } = res;
      if (userMomentsList.length === 0) {
        this.setState({
          countStatus: false,
        });
        return;
      }
      this.setState(
        {
          userMomentsList: [...this.state.userMomentsList, ...userMomentsList],
          beanLimitStatus: beanLimitStatus,
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
      userMomentsInfo: { userMomentIdString, guideMomentFlag },
      userMomentsInfo,
      beanLimitStatus,
    } = this.state;
    if (beanLimitStatus === "1") {
      saveWatchBean(
        {
          momentId: userMomentIdString,
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
                if (item.userMomentIdString === userMomentIdString) {
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
              this.setState(
                {
                  beanflag: true,
                },
                (res) => {
                  checkPuzzleBeanLimitStatus({}, (res) => {
                    const { beanLimitStatus = "1" } = res;
                    this.setState({ beanLimitStatus });
                  });
                }
              );
            }
          );
        }
      );
    } else {
      return;
    }
  }
  //领取卡豆
  initInterval() {
    const { userMomentsInfo, interval } = this.state;
    const { watchStatus, length } = userMomentsInfo;
    interval && clearInterval(interval);
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
  stopVideoPlayerControl() {
    const { current, interval, player } = this.state;
    if (player) {
      if (interval) {
        this.stopInterval(interval);
      }
      this.setState({
        player: false,
      });
      Taro.createVideoContext(`video${current}`).stop();
    } else {
      if (interval) {
        this.stopInterval(interval);
      }
      this.setState({
        player: true,
      });
      this.initInterval();
      Taro.createVideoContext(`video${current}`).play();
    }
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
    const { momentId, scene } = getCurrentInstance().router.params;
    if (scene || momentId) {
      if (scene) {
        getShareParamInfo({ uniqueKey: scene }, (res) => {
          const {
            shareParamInfo: { param },
          } = res;
          if (param && JSON.parse(param)) {
            const { momentId } = JSON.parse(param);
            if (momentId) {
              this.getUserMomentDetailById(momentId);
            } else {
              this.getVideoList(() => {
                const { userMomentsList } = this.state;
                if (userMomentsList.length > 0) {
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
          }
        });
      } else if (momentId) {
        this.getUserMomentDetailById(momentId);
      } else {
        return;
      }
    } else {
      this.getVideoList(() => {
        const { userMomentsList } = this.state;
        if (userMomentsList.length > 0) {
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
  }
  componentDidHide() {
    const { interval } = this.state;
    if (interval) {
      this.stopInterval(interval);
    }
  }
  updateList(list) {
    console.log(list);
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
    const { time } = this.state;
    // this.listParentCategory();
    this.fetchUserShareCommission();
    if (time || time === 0) {
      this.initInterval();
    }
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
                    this.initInterval();
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
      toast("暂无数据");
    }
  } //上拉加载
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
          complete: function () {
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/index/home/index?shareUserId=${userIdString}&shareUserType=user&momentId=${userMomentIdString}`,
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
          path: `/pages/index/home/index?momentId=${userMomentIdString}`,
          complete: function () {
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/index/home/index?momentId=${userMomentIdString}`,
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
      userMomentsInfo,
      userMomentsInfo: { length = "" },
      time,
      httpData: { browseType },
      visible,
      distanceList = [],
      promotionTypeList = [],
      categoryList = [],
      beanflag,
      couponFlag,
      beanLimitStatus,
      configUserLevelInfo,
      player,
    } = this.state;
    const { selectObj } = this.props.store.homeStore;
    const { categoryIds, distance, promotionType } = selectObj;
    const templateView = () => {
      if (browseType === "near") {
        if (userMomentsList.length > 0) {
          return (
            <ScrollView
              scrollY
              onScrollToLower={() => {
                this.pageUpNear();
              }}
              className="home_Waterfall_box"
              style={{
                top: computedClient().top + computedClient().height + 20,
              }}
            >
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
              <InterVal
                interval={time}
                length={length}
                data={userMomentsInfo}
                current={current}
                beanLimitStatus={beanLimitStatus}
              ></InterVal>
              <VideoView
                circular={circular}
                data={userMomentsList}
                current={current}
                onChange={this.onInterSwper.bind(this)}
                onTransition={this.onTransition.bind(this)}
                follow={this.followStatus.bind(this)}
                collection={this.collection.bind(this)}
                stop={this.stopVideoPlayerControl.bind(this)}
                userInfo={configUserLevelInfo}
              ></VideoView>
            </>
          );
        } else {
          if (!loginStatus() && browseType === "follow") {
            return (
              <View className="home_order_box">
                <View className="home_order_followImg home_new_login"></View>
                <View className="home_order_font">您还未登录</View>
                <View className="home_order_font1">
                  登录之后，可以查看您关注的精彩内容
                </View>
                <View
                  className="home_order_followBtn"
                  onClick={() => Router({ routerName: "login" })}
                >
                  去登录
                </View>
              </View>
            );
          }
          return (
            <View className="home_order_box public_center">
              <View>
                <View className="home_order_image home_new_nullStatus"></View>
                <View className="home_order_font">
                  {browseType === "commend"
                    ? "暂无推荐的内容"
                    : "您还没任何关注"}
                </View>
                <View className="home_order_font1">
                  {browseType === "commend"
                    ? ""
                    : "去关注想关注的人，实时了解精彩内容"}
                </View>
              </View>
            </View>
          );
        }
      }
    };
    return (
      <View
        className={classNames(
          "home_box",
          browseType === "near" ? "home_white" : "home_black"
        )}
      >
        <View style={{ top: computedClient().top }} className="home_wait">
          <TopView
            data={browseType}
            onChange={this.selectList.bind(this)}
            session={() => this.setState({ visible: true })}
          ></TopView>
        </View>

        <View className="home_video_box">{templateView()}</View>

        {/* {visible && (
          <Dressing
            distanceList={distanceList}
            promotionTypeList={promotionTypeList}
            categoryList={categoryList}
            distance={distance}
            promotionType={promotionType}
            categoryIds={categoryIds.split(",")}
            visible={visible}
            onClose={() =>
              this.setState({
                visible: false,
              })
            }
            onReload={this.setScreen.bind(this)}
            onConfirm={this.setScreen.bind(this)}
          ></Dressing>
        )} */}

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
        <Lead beanLimitStatus={beanLimitStatus}></Lead>
        {/* <GuideView current={current} data={userMomentsInfo}></GuideView> */}
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
