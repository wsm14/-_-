import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { Button, Image, View } from "@tarojs/components";
import UserTitle from "./components/userTop";
import {
  getMainPage,
  getUserSub,
  getLevel,
  saveLevelTarget,
} from "@/server/user";
import { getBanner } from "@/server/common";
import { removeLogin } from "@/common/utils";
import Router from "@/common/router";
import UserContent from "./components/userCenter";
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
    const {} = this.props.store;
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
          <UserContent bannerList={bannerList}></UserContent>
        </View>
        <View className="page_user_logo public_center">
          <View className="page_user_dakalelogo"></View>
        </View>
      </Skeleton>
    );
  }
}

export default Index;
