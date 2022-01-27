import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { Button, Image, View } from "@tarojs/components";
import UserTitle from "./components/userTop";
import { fetchMainPage } from "@/server/index";
import { fetchBanner } from "@/server/common";
import { objStatus } from "@/utils/utils";
import UserContent from "./components/userCenter";
import Skeleton from "./components/SkeletonView";
import { inject, observer } from "mobx-react";
import NewUser from "@/components/public_ui/newUserToast";
import "./index.scss";
@inject("store")
@observer
class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      bannerList: [],
      //轮播图数组
      bannerHttp: {
        bannerType: "person",
      },
      //轮播图参数
      loginStatus: 0,
      //登录状态
      userInfo: {},
      //用户信息
      loading: false,
      //骨架屏是否展示
      size: 0,
      //与骨架屏关联
    };
  }
  onPullDownRefresh() {
    this.setState(
      {
        bannerList: [],
        loginStatus: 0,
        userInfo: {},
      },
      (res) => {
        let time = setTimeout(() => {
          Taro.stopPullDownRefresh();
          clearTimeout(time);
        }, 500);
        this.fetchBannerList();
        this.fetchUser();
      }
    );
  }
  fetchBannerList() {
    const { bannerHttp } = this.state;
    fetchBanner(bannerHttp).then((res) => {
      const { bannerList } = res;
      this.setState({
        bannerList,
      });
    });
  }

  fetchUser() {
    const { size } = this.state;
    if (size === 0) {
      this.setState({
        size: 1,
        loading: true,
      });
    }
    fetchMainPage().then((val) => {
      const { userInfo = {} } = val;
      this.setState({
        userInfo: userInfo,
        loginStatus: objStatus(userInfo) ? 1 : 0,
        loading: false,
      });
    });
  }
  //获取用户信息
  componentDidMount() {
    this.fetchBannerList();
  }

  componentDidShow() {
    this.fetchUser();
  }

  render() {
    const { bannerList = [], loginStatus, userInfo, loading } = this.state;

    return (
      <Skeleton loading={loading}>
        <View className="page_userBox">
          <NewUser></NewUser>
          <UserTitle
            reload={() => {
              this.fetchUser();
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
