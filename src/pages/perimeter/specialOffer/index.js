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
import { template } from "@/components/specalTemplate";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      kolGoodsList: [],
      type: getCurrentInstance().router.params.type,
      httpData: {
        page: 1,
        limit: 10,
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
    const { type, httpData } = this.state;
    this.fetchUserShareCommission();
    if (type === "hot") {
      Taro.setNavigationBarTitle({
        title: "限时抢购 ",
      });
    } else {
      Taro.setNavigationBarTitle({
        title: "爆品福利 ",
      });
    }
    this.setState(
      {
        httpData: {
          ...httpData,
          specialFilterType: type,
        },
      },
      (res) => {
        this.getshopList();
      }
    );
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
    const { kolGoodsList, configUserLevelInfo } = this.state;
    return (
      <View className="specialOffer_box">
        <View className="specialOffer_content">
          {kolGoodsList.map((item) => {
            return template(item, configUserLevelInfo);
          })}
        </View>
      </View>
    );
  }
}

export default Index;
