import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { toast } from "@/common/utils";
import { fetchSpecialGoods, fetchUserShareCommission } from "@/server/index";
import { getBanner } from "@/server/common";
import Banner from "@/components/banner";
import { childTemplate } from "@/components/specalTemplate";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      specialGoodsList: [],
      bannerList: [],
      httpData: {
        page: 1,
        limit: 10,
        specialFilterType: "today",
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
    this.getBanner();
  }
  getBanner() {
    getBanner({ bannerType: "hotWeal" }, (res) => {
      const { bannerList } = res;
      this.setState({
        bannerList,
      });
    });
  }
  getshopList(init) {
    fetchSpecialGoods(this.state.httpData, (res) => {
      Taro.stopPullDownRefresh();
      const { specialGoodsList = [] } = res;
      if (specialGoodsList.length > 0) {
        if (init) {
          this.setState({
            specialGoodsList,
          });
        } else {
          this.setState({
            specialGoodsList: [
              ...this.state.specialGoodsList,
              ...specialGoodsList,
            ],
          });
        }
      } else {
        this.setState({
          countStatus: false,
        });
      }
    }).catch((e) => {
      Taro.stopPullDownRefresh();
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

  onPullDownRefresh() {
    const { httpData } = this.state;
    let that = this;
    Taro.stopPullDownRefresh();
    this.setState(
      {
        httpData: {
          ...httpData,
          page: 1,
        },
        countStatus: true,
      },
      (res) => {
        this.getshopList(true);
      }
    );
  }
  onReachBottom() {
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
    }
  } //上拉加载
  render() {
    const { specialGoodsList, configUserLevelInfo, bannerList } = this.state;
    return (
      <View className="speciaMaterial_box">
        {bannerList.length > 0 && (
          <View className="speciaMaterial_banner_style">
            <Banner
              boxStyle={{ width: "100%", height: "100%" }}
              imgName="coverImg"
              data={bannerList}
            ></Banner>
          </View>
        )}

        <View className="speciaMaterial_content">
          <View className="speciaMaterial_content_pay public_center">
            抢购列表
          </View>
          {specialGoodsList.map((item) => {
            return childTemplate(item, configUserLevelInfo, "today");
          })}
        </View>
      </View>
    );
  }
}

export default Index;
