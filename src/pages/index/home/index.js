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
import { Button, Image, ScrollView, View } from "@tarojs/components";
import InterVal from "@/components/setTimeCanvas";
import {
  getUserMomentList,
  saveWatchBean,
  saveMerchantCollection,
  closeMerchantCollection,
  saveMomentType,
  getUserMomentDetailById,
} from "@/server/index";
import {
  getMomentBarrage,
  listParentCategory,
  getShareParamInfo,
} from "@/server/common";
import "./index.scss";
import Barrage from "./components/barrage";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import { nearList } from "@/components/nearList";
import Toast from "@/components/beanToast";
import Waterfall from "@/components/waterfall";
import Dressing from "./components/dressing";
import evens from "@/common/evens";
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
      },
      countStatus: true,
      time: null,
      interval: null,
      momentBarrageList: [],
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
    };
  }
  saveMomentType() {
    const {
      userMomentsInfo: { userMomentIdString },
    } = this.state;
    saveMomentType({ updateType: "view", id: userMomentIdString }, (res) => {
      toast("分享成功");
    });
  }

  onChange(e) {
    const {
      countStatus,
      httpData,
      userMomentsList,
      interval,
      time,
    } = this.state;
    const { current } = e.detail;
    this.setState(
      {
        current,
        userMomentsInfo: userMomentsList[current],
        time: null,
      },
      (res) => {
        interval && this.stopInterval(interval);
        this.getMomentBarrage();
        this.videoPlayerControl();
        this.initInterval();
        if (current >= this.state.userMomentsList.length - 3 && countStatus) {
          this.setState(
            {
              httpData: {
                ...httpData,
                page: parseInt(userMomentsList.length / 10) + 1,
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

  getMomentBarrage() {
    getMomentBarrage({ size: 25 }, (res) => {
      const { momentBarrageList = [] } = res;
      this.setState({
        momentBarrageList,
      });
    });
  }

  selectList(data = {}) {
    const { httpData, interval } = this.state;
    const { val } = data;
    if (interval) {
      this.stopInterval(interval);
    }
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
            scenesIds: loadCategoryIds.join(","),
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
      userMomentsInfo: { userMomentIdString, beanLimitStatus },
      userMomentsInfo,
    } = this.state;
    if (beanLimitStatus === "1") {
      saveWatchBean(
        {
          momentId: userMomentIdString,
        },
        (res) => {
          this.setState({
            time: null,
            userMomentsInfo: { ...userMomentsInfo, watchStatus: "1" },
            userMomentsList: this.state.userMomentsList.map((item) => {
              if (item.userMomentIdString === userMomentIdString) {
                return {
                  ...item,
                  watchStatus: "1",
                };
              }
              return item;
            }),
            toast: true,
          });
        }
      );
    } else {
    }
  }
  //领取卡豆
  initInterval() {
    const { userMomentsInfo } = this.state;
    const { watchStatus, length } = userMomentsInfo;
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
    const { userMomentsList } = this.state;
    this.setState({
      userMomentsList: list,
    });
  }
  componentDidShow() {
    const { time } = this.state;
    this.listParentCategory();
    if (time || time === 0) {
      this.initInterval();
    }
  }
  componentDidMount() {
    this.getMomentBarrage();
    evens.$on("updateMomentsList", this.updateList.bind(this));
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
    );
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
  render() {
    const {
      userMomentsList,
      current,
      circular,
      userMomentsInfo,
      userMomentsInfo: { length = "" },
      time,
      momentBarrageList,
      httpData: { browseType },
      visible,
      distanceList = [],
      promotionTypeList = [],
      categoryList = [],
      beanflag,
    } = this.state;
    const { selectObj } = this.props.store.homeStore;
    const { scenesIds, distance, promotionType } = selectObj;
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
                setWidth={335}
                style={{ width: Taro.pxTransform(335) }}
                store={this.props.store}
              ></Waterfall>
            </ScrollView>
          );
        } else {
          return (
            <View className="home_near_box">
              <View>
                <View className="home_near_image"></View>
                <View className="home_near_font">附近暂无内容</View>
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
              ></InterVal>
              <VideoView
                circular={circular}
                data={userMomentsList}
                current={current}
                onChange={this.onChange.bind(this)}
                follow={this.followStatus.bind(this)}
                collection={this.collection.bind(this)}
              >
                <Barrage data={momentBarrageList}></Barrage>
              </VideoView>
            </>
          );
        } else {
          return (
            <View className="home_order_box public_center">
              <View>
                <View className="home_order_image home_nullStatus_black"></View>
                <View className="home_order_font">
                  {browseType === "commend"
                    ? "暂无推荐的内容"
                    : "暂无关注的内容"}
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

        {visible && (
          <Dressing
            distanceList={distanceList}
            promotionTypeList={promotionTypeList}
            categoryList={categoryList}
            distance={distance}
            promotionType={promotionType}
            categoryIds={scenesIds.split(",")}
            visible={visible}
            onClose={() =>
              this.setState({
                visible: false,
              })
            }
            onReload={this.setScreen.bind(this)}
            onConfirm={this.setScreen.bind(this)}
          ></Dressing>
        )}
        {beanflag && (
          <Toast
            data={userMomentsInfo}
            visible={() => {
              this.setState({
                beanflag: false,
              });
            }}
          ></Toast>
        )}
      </View>
    );
  }
}

export default Index;
