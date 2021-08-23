import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { Button, Image, View } from "@tarojs/components";
import UserTitle from "./components/userTop";
import UserContent from "./components/userContent";
import UserBottom from "./components/userBottom";
import {
  getMainPage,
  getUserSub,
  getLevel,
  saveLevelTarget,
} from "@/server/user";
import { getBanner } from "@/server/common";
import {
  backgroundObj,
  removeLogin,
  navigateTo,
  filterStrList,
  toast,
} from "@/common/utils";
import Router from "@/common/router";
import Toast from "@/components/stopBean";
import Rules from "./components/retailRules";
import Success from "./components/successLevel";
import ReloadBottom from "./components/reloadBottom";
import LeverToast from "./components/userLevelToast";
import Skeleton from "./components/SkeletonView";
import { inject, observer } from "mobx-react";
import "./index.scss";
@inject("store")
@observer
class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      bannerList: [],
      bannerHttp: {
        bannerType: "person",
      },
      loginStatus: 0,
      userInfo: {},
      nextLevel: {},
      levelDetails: {},
      visible: false,
      collectStatus: {
        toastVisible: false,
        toastClick: false,
        ruleVisible: false,
        ruleStatus: false,
        successToast: false,
      },
      levelToast: false,
      loading: false,
      size: 0,
    };
  }
  onPullDownRefresh() {
    this.setState(
      {
        bannerList: [],
        loginStatus: 0,
        userInfo: {},
        nextLevel: {},
        levelDetails: {},
      },
      (res) => {
        let time = setTimeout(() => {
          Taro.stopPullDownRefresh();
          clearTimeout(time);
        }, 500);
        this.getBannerList();
        this.getUserDetails();
      }
    );
  }
  getBannerList() {
    const { bannerHttp } = this.state;
    getBanner(bannerHttp, (res) => {
      const { bannerList } = res;
      this.setState({
        bannerList,
      });
    });
  }
  getLevel() {
    getLevel({}, (res) => {
      const { nextLevel } = res;
      this.setState({
        nextLevel,
      });
    });
  }
  getUserDetails() {
    const { size } = this.state;
    if (size === 0) {
      this.setState({
        size: 1,
        loading: true,
      });
    }
    getMainPage({}, (res) => {
      const { userInfo } = res;
      if (!userInfo) {
        removeLogin();
        this.setState({
          userInfo: {},
          loginStatus: 0,
          loading: false,
        });
        return;
      } else {
        this.setState(
          {
            loginStatus: 1,
            userInfo: { ...userInfo },
            loading: false,
          },
          (res) => {
            this.getLevel();
            this.getUserSub();
          }
        );
      }
    }).catch((e) => {
      this.setState({
        loading: false,
      });
    });
  }
  fetchCollect() {
    Router({
      routerName: "webView",
      args: {
        link: "https://mp.weixin.qq.com/s/cigoCWs94L4wT_T40fSOkw",
        title: "关注公众号",
      },
    });
  }
  fetchLoad() {
    Router({
      routerName: "webView",
      args: {
        link: "https://dakale-wx-hutxs-1302395972.tcloudbaseapp.com/dakale-web-page/wechant/page/interface.html",
        title: "关注公众号",
      },
    });
  }
  fetchLever() {
    const {
      collectStatus,
      collectStatus: { toastClick, ruleStatus },
    } = this.state;
    if (!ruleStatus) {
      this.setState({
        collectStatus: {
          ...collectStatus,
          ruleVisible: true,
        },
      });
    } else {
      saveLevelTarget({}).then((val) => {
        this.setState(
          {
            collectStatus: {
              ...collectStatus,
              successToast: true,
            },
          },
          (res) => {
            this.getUserDetails();
          }
        );
      });
    }
  }
  getUserSub() {
    getUserSub({}, (res) => {
      this.setState({
        levelDetails: { ...res },
      });
    });
  }

  fetchUserLeverToast() {
    const { level = "0" } = this.state.userInfo;
    if (level === "0") {
      this.fetchLoad();
    } else {
      this.setState({
        levelToast: true,
      });
    }
  }
  componentDidMount() {
    this.getBannerList();
  }

  componentDidShow() {
    this.getUserDetails();
  }

  render() {
    const {
      bannerList = [],
      list,
      loginStatus,
      userInfo,
      nextLevel,
      levelDetails,
      visible,
      collectStatus,
      collectStatus: { toastVisible, ruleVisible, successToast },
      levelToast,
      loading,
    } = this.state;
    const {
      homeStore = {},
      authStore = {},
      activeInfoStore = {},
    } = this.props.store;
    return (
      <Skeleton loading={loading}>
        <View className="page_userBox">
          <UserTitle
            reload={() => {
              this.getUserDetails();
              this.setState({
                visible: true,
              });
            }}
            status={loginStatus}
            data={userInfo}
          ></UserTitle>
          <View className="page_user_liner"></View>
          <UserContent
            bannerList={bannerList}
            levelDetails={levelDetails}
            nextLevel={nextLevel}
            status={loginStatus}
            data={userInfo}
            fetchLoad={this.fetchLoad.bind(this)}
            infoCollect={this.fetchCollect.bind(this)}
            fetchLever={this.fetchLever.bind(this)}
            fetchUserLeverToast={this.fetchUserLeverToast.bind(this)}
          ></UserContent>
          <View className="page_user_liner"></View>
          <UserBottom></UserBottom>
          {visible && (
            <Toast
              cancel={() =>
                this.setState({
                  visible: false,
                })
              }
              visible={visible}
              title={"账号已授权成功"}
              canfirm={() => {
                this.setState(
                  {
                    visible: false,
                  },
                  (res) => {
                    this.fetchCollect();
                  }
                );
              }}
              content={`更多福利通知建议关注「哒卡乐DAKALE」公众号`}
              canfirmText="取消"
              cancelText="去关注"
            ></Toast>
          )}
          {toastVisible && (
            <Toast
              cancel={() =>
                this.setState({
                  collectStatus: {
                    ...collectStatus,
                    toastVisible: false,
                  },
                })
              }
              visible={toastVisible}
              title={"恭喜您达到哒人的解锁条件"}
              canfirm={() => {
                this.setState(
                  {
                    collectStatus: {
                      ...collectStatus,
                      toastVisible: false,
                      toastClick: true,
                    },
                  },
                  (res) => {
                    this.fetchCollect();
                  }
                );
              }}
              content={`请先关注「哒卡乐DAKALE」公众号，收益到账立即知道`}
              canfirmText="取消"
              cancelText="去关注"
            ></Toast>
          )}
          {ruleVisible && (
            <Rules
              onClose={() =>
                this.setState({
                  collectStatus: {
                    ...collectStatus,
                    ruleVisible: false,
                  },
                })
              }
              canfirm={() =>
                this.setState(
                  {
                    collectStatus: {
                      ...collectStatus,
                      ruleVisible: false,
                      ruleStatus: true,
                    },
                  },
                  (res) => {
                    this.fetchLever();
                  }
                )
              }
              visible={ruleVisible}
            ></Rules>
          )}
          <Success
            onClose={() =>
              this.setState({
                collectStatus: {
                  ...collectStatus,
                  successToast: false,
                },
              })
            }
            canfirm={() =>
              this.setState(
                {
                  collectStatus: {
                    ...collectStatus,
                    successToast: false,
                  },
                },
                (res) => {
                  Router({
                    routerName: "download",
                  });
                }
              )
            }
            visible={successToast}
          ></Success>
          <ReloadBottom onChange={this.fetchCollect.bind(this)}></ReloadBottom>
          <LeverToast
            data={userInfo}
            onClose={() =>
              this.setState({
                levelToast: false,
              })
            }
            canfirm={() =>
              this.setState(
                {
                  levelToast: false,
                },
                (res) => {
                  Router({
                    routerName: "download",
                  });
                }
              )
            }
            visible={levelToast}
          ></LeverToast>
          <View className="users_ourcard"></View>
        </View>
      </Skeleton>
    );
  }
}

export default Index;
