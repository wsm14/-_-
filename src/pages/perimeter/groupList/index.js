import React, { Component, PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { CoverView, Image, ScrollView, View } from "@tarojs/components";
import SearchView from "@/components/searchView";
import { getSpecialGoodsMerchants } from "@/server/perimeter";
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
      merchantList: [],
      visible: false,
      countStatus: true,
    };
  }
  setSelect(val) {
    const {
      httpData: { keyword },
    } = this.state;
    if (keyword !== val) {
      this.setState(
        {
          httpData: {
            ...this.state.httpData,
            page: 1,
            keyword: val,
            countStatus: true,
          },
          merchantList: [],
          visible: false,
        },
        (res) => {
          this.getList();
        }
      );
    } else {
      return;
    }
  }
  getList() {
    const { httpData } = this.state;
    getSpecialGoodsMerchants(httpData, (res) => {
      const { merchantList = [] } = res;
      if (merchantList.length > 0) {
        this.setState({
          merchantList: [...this.state.merchantList, ...merchantList],
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
  onShareAppMessage(res) {
    const { merchantList } = this.state;
    let userInfo = loginStatus() || {};
    if (loginStatus()) {
      const { userIdString } = userInfo;
      if (res.from === "button") {
        const { index } = res.target.dataset;
        let data = merchantList[index];
        const { coverImg, merchantId, merchantName } = data;
        return {
          title: merchantName,
          imageUrl: coverImg,
          path: `/pages/perimeter/merchantDetails/index?merchantId=${merchantId}&shareUserType=user&shareUserId=${userIdString}`,
        };
      }
      return {
        title: merchantName,
        imageUrl: coverImg,
        path: `/pages/index/home/index?merchantId=${merchantId}&shareUserType=user&shareUserId=${userIdString}`,
      };
    }
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
    const { merchantList, visible } = this.state;
    console.log(merchantList);
    return (
      <View className="groupList_box">
        <SearchView
          fn={this.setSelect.bind(this)}
          title={"搜索商家"}
        ></SearchView>
        <ScrollView
          onScrollToLower={this.onPage.bind(this)}
          scrollY
          className="groupList_scroll"
        >
          {merchantList.map((item, index) => {
            if (visible === false) {
              if (index < 4) {
                return list(item, index);
              }
            } else {
              return list(item, index);
            }
          })}
          {!visible && merchantList.length > 4 && (
            <View
              className="visible_btn"
              onClick={() => this.setState({ visible: true })}
            >
              点击收起
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default Index;
