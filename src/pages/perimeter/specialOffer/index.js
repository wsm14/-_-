import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import {
  toast,
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
} from "@/common/utils";

import { fetchSpecialGoods, fetchUserShareCommission } from "@/server/index";
import { getListSpecialByPeriod } from "@/server/perimeter";
import { childTemplate } from "@/components/specalTemplate";
import { specailGoods } from "@/components/componentView/specail";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      kolGoodsList: [],
      specialGoodsList: [],
      httpData: {
        page: 1,
        limit: 10,
        specialFilterType: "hot",
      },
      configUserLevelInfo: {},
      countStatus: true,
    };
  }

  componentWillMount() {}

  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }

  // 获取周边特价
  componentDidShow() {}
  componentDidMount() {
    this.fetchUserShareCommission();
    this.getshopList();
    this.featchAcitivity();
  }
  getshopList(key = "kolGoodsList") {
    fetchSpecialGoods(this.state.httpData, (res) => {
      const { specialGoodsList = [] } = res;
      if (specialGoodsList.length > 0) {
        this.setState({
          [key]: [...this.state[key], ...specialGoodsList],
        });
      } else {
        this.setState({
          countStatus: false,
        });
      }
    });
  }
  featchAcitivity() {
    getListSpecialByPeriod(
      {
        periodType: "thisPeriod",
      },
      (res) => {
        const { specialGoodsList = [] } = res;
        this.setState({
          specialGoodsList,
        });
      }
    );
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  onReachBottom() {
    console.log(11111);
    const { httpData, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: {
            ...httpData,
            page: httpData.page + 1,
          },
        },
        (res) => {
          this.getshopList();
        }
      );
    } else {
      return toast("暂无数据");
    }
  } //上拉加载
  render() {
    const { kolGoodsList, configUserLevelInfo, specialGoodsList } = this.state;
    console.log(specialGoodsList);
    return (
      <View className="specialOffer_box">
        {specialGoodsList.length > 0 && (
          <View className="specialOffer_novite">
            <View className="specialOffer_novite_content">
              <View className="specialOffer_novite_title">本期必抢</View>
              <View className="specialOffer_novite_liner"></View>
              <View className="specialOffer_novite_scroll">
                {specialGoodsList.map((item) => {
                  return specailGoods(item, configUserLevelInfo);
                })}
              </View>
            </View>
          </View>
        )}
        <View className="specialOffer_content_pay">抢购列表</View>
        <View className="specialOffer_content">
          {kolGoodsList.map((item) => {
            return childTemplate(item, configUserLevelInfo);
          })}
        </View>
      </View>
    );
  }
}

export default Index;
