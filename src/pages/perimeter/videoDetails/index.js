import React from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import VideoView from "./components/videoView";
import { toast, loginStatus } from "@/utils/utils";
import {
  fakeInsertUserCollectionMoment,
  fakeDeleteUserCollection,
  fakeUserFollow,
  getUserMomentDetailById,
  saveWatchBean,
} from "@/server/index";
import { fetchUserShareCommission } from "@/server/common";
import { fetchFormMomentDetail } from "@/server/share";
import { inject, observer } from "mobx-react";
import Toast from "@/components/public_ui/beanToast";
import Coupon from "@/components/public_ui/freeCoupon";
import { fetchShareInfo, fetchShareParamInfo } from "@/server/common";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import classNames from "classnames";
import Comment from "@/components/public_ui/comment";
import "./index.scss";
@inject("store")
@observer
class Index extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      userMomentsInfo: {},
      httpData: {
        ...getCurrentInstance().router.params,
      },
      countStatus: true,
      time: null,
      interval: null,
      momentBarrageList: [],
      beanflag: false,
      couponFlag: false,
      beanLimitStatus: "1",
      player: true,
      configUserLevelInfo: {},
      cavansObj: {
        data: null,
        start: false,
      },
      current: 0,
      commentShow: false,
    };
    this.interReload = null;
    this.interSwper = null;
  }

  stopVideoPlayerControl() {
    const { current, player } = this.state;
    if (player) {
      this.setState({
        player: false,
      });
      Taro.createVideoContext(`details1`).pause();
    } else {
      this.setState({
        player: true,
      });
      Taro.createVideoContext(`details1`).play();
    }
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
      userMomentsInfo: {},
      userMomentsInfo,
      httpData,
    } = this.state;
    const { shareUserId } = httpData;
    const { momentId, ownerId } = userMomentsInfo;
    saveWatchBean(
      {
        momentId: momentId,
        ownerId,
        shareUserId,
      },
      (res) => {
        this.setState({
          beanflag: true,
          time: null,
          userMomentsInfo: { ...userMomentsInfo, watchStatus: "1" },
        });
      }
    ).catch((res) => {
      const { resultCode } = res;
      if (resultCode == "5231") {
        this.setState({
          userMomentsInfo: {
            ...userMomentsInfo,
            beanFlag: 0,
          },
        });
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
        Taro.createVideoContext(`details1`).stop();
      }
    }
    Taro.createVideoContext(`details1`).play();
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
          });
        }
      );
    }
  }
  componentDidHide() {}
  componentDidShow() {
    this.fetchUserShareCommission();
  }

  getUserMomentDetailById() {
    const { httpData } = this.state;
    const { momentType } = httpData;
    if (momentType === "platform") {
      fetchFormMomentDetail({
        ...this.state.httpData,
      }).then((res) => {
        const { moment = {} } = res;
        this.setState({
          userMomentsInfo: moment,
          current: 1,
        });
      });
    } else {
      getUserMomentDetailById(
        {
          ...this.state.httpData,
        },
        (res) => {
          const { moment = {} } = res;
          this.setState({
            userMomentsInfo: moment,
            current: 1,
          });
        }
      );
    }
  }

  componentWillMount() {
    let { momentId, scene } = getCurrentInstance().router.params;
    if (scene || momentId) {
      if (scene) {
        fetchShareParamInfo({ uniqueKey: scene }, (res) => {
          let {
            shareParamInfo: { param },
          } = res;
          if (param && JSON.parse(param)) {
            param = JSON.parse(param);
            let { momentId } = param;
            if (momentId) {
              this.setState(
                {
                  httpData: {
                    ...param,
                  },
                },
                (res) => {
                  this.getUserMomentDetailById();
                }
              );
            }
          }
        });
      } else if (momentId) {
        this.getUserMomentDetailById();
      } else {
        return;
      }
    } else {
      toast("参数异常");
    }
  }
  componentWillUnmount() {}
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
      userMomentsInfo,
      userMomentsInfo: { ownerId },
      time,
      configUserLevelInfo,
      beanflag,
      couponFlag,
      beanLimitStatus,
      player,
      cavansObj,
      httpData,
      commentShow,
      current,
    } = this.state;
    const { login } = this.props.store.authStore;
    return (
      <View className={classNames("home_box home_black")}>
        <View className="home_video_box">
          <>
            <VideoView
              data={userMomentsInfo}
              follow={this.followStatus.bind(this)}
              collection={this.collection.bind(this)}
              stop={this.stopVideoPlayerControl.bind(this)}
              userInfo={configUserLevelInfo}
              shareInfo={this.shareImageInfo.bind(this)}
              beanLimitStatus={beanLimitStatus}
              saveBean={this.saveBean.bind(this)}
              changeComment={() => this.setState({ commentShow: true })}
              play={player}
              current={current}
            ></VideoView>
          </>
        </View>
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
        <Comment
          data={userMomentsInfo}
          current={"0"}
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
