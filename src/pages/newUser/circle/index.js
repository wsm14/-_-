import React, { Component, useState } from "react";
import { View, Text, Swiper, SwiperItem } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Tabs from "@/components/tabs";
import UserFamily from "./components/userFamily";
import ShopFamily from "./components/shopFamily";
import "./index.scss";

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      setting: {
        tabList: ["我的家人", "我的家店"],
        current: 0,
      },
    };
  }
  setIndex(index) {
    const that = this;
    if (index != this.state.setting.current) {
      this.setState({
        setting: {
          ...this.state.setting,
          current: index,
        },
      });
    }
    return;
  }
  getUserDetails() {
    const {
      userFamily: { getFamilyUser },
    } = user;
    httpGet(
      {
        data: {},
        url: getFamilyUser,
      },
      (res) => {
        this.setState({
          userInfo: { ...res },
        });
      }
    );
  }
  getUserList() {
    const { httpData } = this.state;
    const {
      userFamily: { getListUser },
    } = user;
    httpGet(
      {
        data: httpData,
        url: getListUser,
      },
      (res) => {
        const { userList } = res;
        if (userList && userList.length > 0) {
          if (userList && userList.length === 10) {
            this.setState({
              userList: [...this.state.userList, ...userList],
            });
          } else {
            this.setState({
              countStatus: false,
              userList: [...this.state.userList, ...userList],
            });
          }
        } else {
          this.setState(
            {
              countStatus: false,
            },
            (res) => {
              if (this.state.userList.length > 0) {
                toast("暂无更多");
              }
            }
          );
        }
      }
    );
  }
  onReachBottom() {
    const { page, limit, countStatus, httpData } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: {
            ...httpData,
            page: httpData.page + 1,
          },
        },
        (res) => {
          this.getUserList();
        }
      );
    }
  }
  componentDidShow() {}
  errorToast(e) {}
  render() {
    const {
      setting,
      setting: { current },
    } = this.state;
    const tabStyle = {
      height: Taro.pxTransform(88),
      borderRadius: "0px 0px 20px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#FFFFFF",
      padding: `0 ${Taro.pxTransform(128)}`,
      position: "fixed",
      left: 0,
      right: 0,
      top: 0,
      zIndex: 100,
    };
    console.log(current);
    return (
      <View className="page_circle">
        <Tabs
          fn={this.setIndex.bind(this)}
          style={tabStyle}
          {...setting}
        ></Tabs>
        <Swiper
          onChange={(e) => {
            const { current } = e.detail;
            this.setState({
              setting: {
                ...setting,
                current,
              },
            });
          }}
          circular
          current={current}
          className="page_body"
        >
          <SwiperItem>
            <UserFamily></UserFamily>
          </SwiperItem>
          <SwiperItem>
            <ShopFamily></ShopFamily>
          </SwiperItem>
        </Swiper>
      </View>
    );
  }
}

export default Index;
