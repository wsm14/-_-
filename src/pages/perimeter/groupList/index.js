import React, { Component, PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { CoverView, Image, ScrollView, View } from "@tarojs/components";
import SearchView from "@/components/searchView";
import { fetchServiceMerchants } from "@/server/perimeter";
import { loginStatus, mapGo } from "@/common/utils";
import { list } from "./components/listView";
import "./index.scss";
import Router from "@/common/router";
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
        page: 1,
        limit: 10,
      },
      userMerchantList: [],
      visible: false,
      countStatus: true,
    };
  }

  getList() {
    const { httpData } = this.state;
    fetchServiceMerchants(httpData, (res) => {
      const { userMerchantList = [] } = res;
      if (userMerchantList.length > 0) {
        this.setState({
          userMerchantList: [...this.state.userMerchantList, ...userMerchantList],
        });
      } else {
        this.setState({
          countStatus: false,
        });
      }
    });
  }
  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  // 获取周边特价
  componentDidMount() {
    this.getList();
  }

  onPage() {
    if (this.state.countStatus) {
      this.setState(
        {
          httpData: {
            ...this.state.httpData,
            page: this.state.httpData.page + 1,
          },
        },
        (res) => {
          this.getList();
        }
      );
    }
  }

  onReachBottom() {} //上拉加载
  render() {
    const { userMerchantList } = this.state;
    return (
      <View className="groupList_box">
        <ScrollView
          onScrollToLower={this.onPage.bind(this)}
          scrollY
          className="groupList_scroll"
        >
          {userMerchantList.map((item, index) => {
            return list(item, index);
          })}
        </ScrollView>
      </View>
    );
  }
}

export default Index;
