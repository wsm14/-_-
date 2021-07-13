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
import "./index.scss";
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
    getMainPage({}, (res) => {
      const { userInfo } = res;
      if (!userInfo) {
        removeLogin();
        this.setState({
          userInfo: {},
          loginStatus: 0,
        });
        return;
      } else {
        this.setState(
          {
            loginStatus: 1,
            userInfo,
          },
          (res) => {
            this.getLevel();
            this.getUserSub();
          }
        );
      }
    });
  }
  fetchCollect() {
    toast("关注啦");
  }
  fetchLever() {
    const {
      collectStatus,
      collectStatus: { toastClick, ruleStatus },
    } = this.state;
    if (!toastClick) {
      this.setState({
        collectStatus: {
          ...collectStatus,
          toastVisible: true,
        },
      });
    } else if (!ruleStatus) {
      this.setState({
        collectStatus: {
          ...collectStatus,
          ruleVisible: true,
        },
      });
    } else {
      saveLevelTarget({}).then((val) => {
        this.setState({
          collectStatus: {
            ...collectStatus,
            successToast: true,
          },
        });
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
    } = this.state;
    return (
      <View className="page_userBox">
        <UserTitle
          reload={() => {
            this.getUserDetails.bind(this);
            this.setState({
              visible: true,
            });
          }}
          status={loginStatus}
          data={userInfo}
        ></UserTitle>
        <View className="page_user_liner"></View>
        <UserContent
          levelDetails={levelDetails}
          nextLevel={nextLevel}
          status={loginStatus}
          data={userInfo}
          infoCollect={this.fetchCollect.bind(this)}
          fetchLever={this.fetchLever.bind(this)}
        ></UserContent>
        <View className="page_user_liner"></View>
        <UserBottom list={bannerList}></UserBottom>
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
      </View>
    );
  }
}

export default Index;
