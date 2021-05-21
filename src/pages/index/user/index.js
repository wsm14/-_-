import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { Button, Image, View } from "@tarojs/components";
import UserTitle from "./components/userTop";
import UserContent from "./components/userContent";
import UserBottom from "./components/userBottom";
import { getMainPage, getUserSub, getLevel } from "@/server/user";
import { getBanner } from "@/server/common";
import {
  backgroundObj,
  removeLogin,
  navigateTo,
  filterStrList,
} from "@/common/utils";
import Router from "@/common/router";
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
    } = this.state;
    return (
      <View className="page_userBox">
        <UserTitle
          reload={this.getUserDetails.bind(this)}
          status={loginStatus}
          data={userInfo}
        ></UserTitle>
        <View className="page_user_liner"></View>
        <UserContent
          levelDetails={levelDetails}
          nextLevel={nextLevel}
          status={loginStatus}
          data={userInfo}
        ></UserContent>
        <View className="page_user_liner"></View>
        <UserBottom list={bannerList}></UserBottom>
      </View>
    );
  }
}

export default Index;
