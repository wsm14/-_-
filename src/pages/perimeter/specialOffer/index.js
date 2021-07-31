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
import classNames from "classnames";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      kolGoodsList: [],
      specialGoodsList: [],
      noticeList: [],
      httpData: {
        page: 1,
        limit: 10,
        specialFilterType: "hot",
      },
      configUserLevelInfo: {},
      countStatus: true,
      selectType: 0,
    };
  }

  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }

  // 获取周边特价
  componentDidShow() {}
  componentDidMount() {
    this.fetchUserShareCommission();
    this.getshopList();
    this.featchAcitivity();
    this.fetchNoticeActivity();
  }
  getshopList(key = "kolGoodsList", init) {
    fetchSpecialGoods(this.state.httpData, (res) => {
      const { specialGoodsList = [] } = res;
      Taro.stopPullDownRefresh();
      if (specialGoodsList.length > 0) {
        if (init) {
          this.setState({
            [key]: specialGoodsList,
          });
        } else {
          this.setState({
            [key]: [...this.state[key], ...specialGoodsList],
          });
        }
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
  fetchNoticeActivity() {
    getListSpecialByPeriod(
      {
        periodType: "notice",
      },
      (res) => {
        const { specialGoodsList = [] } = res;
        this.setState({
          noticeList: specialGoodsList,
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

  selectag(val) {
    this.setState({
      selectType: val,
    });
  }
  onPullDownRefresh() {
    const { httpData } = this.state;
    Taro.stopPullDownRefresh();
    this.setState(
      {
        httpData: {
          ...httpData,
          page: 1,
        },
        selectType: 0,
        kolGoodsList: [],
        specialGoodsList: [],
        noticeList: [],
      },
      (res) => {
        this.fetchUserShareCommission();
        this.getshopList("kolGoodsList", true);
        this.featchAcitivity();
        this.fetchNoticeActivity();
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
          countStatus: true,
        },
        (res) => {
          this.getshopList();
        }
      );
    } else {
    }
  } //上拉加载
  render() {
    const {
      kolGoodsList,
      configUserLevelInfo,
      specialGoodsList,
      noticeList,
      selectType,
    } = this.state;
    console.log(noticeList, specialGoodsList);
    const template = () => {
      if (noticeList.length > 0 && specialGoodsList.length > 0) {
        return (
          <View className="specialOffer_novite">
            <View className="specialOffer_novite_content">
              <View className={classNames("specialOffer_select_content")}>
                <View className="public_auto" style={{ width: "100%" }}>
                  <View
                    onClick={() => this.selectag(0)}
                    className={classNames(
                      "specialOffer_select_view bold",
                      selectType === 0
                        ? "specialOffer_select_tags1"
                        : "specialOffer_select_tags2"
                    )}
                  >
                    本期必抢
                  </View>
                  <View
                    onClick={() => this.selectag(1)}
                    className={classNames(
                      "specialOffer_select_view bold",
                      selectType === 1
                        ? "specialOffer_select_tags1"
                        : "specialOffer_select_tags2"
                    )}
                  >
                    下期预告
                  </View>
                </View>
              </View>
              <View className="specialOffer_novite_scroll">
                {(selectType === 0 ? specialGoodsList : noticeList).map(
                  (item) => {
                    return specailGoods(item, configUserLevelInfo);
                  }
                )}
              </View>
            </View>
          </View>
        );
      } else if (specialGoodsList.length > 0) {
        return (
          <View className="specialOffer_novite">
            <View className="specialOffer_novite_content">
              <View className="specialOffer_select_content1">
                <View className="specialOffer_select_view specialOffer_select_tags1">
                  本期必抢
                </View>
              </View>
              <View className="specialOffer_novite_scroll">
                {specialGoodsList.map((item) => {
                  return specailGoods(item, configUserLevelInfo);
                })}
              </View>
            </View>
          </View>
        );
      } else if (noticeList.length > 0) {
        return (
          <View className="specialOffer_novite">
            <View className="specialOffer_novite_content">
              <View className="specialOffer_select_content1">
                <View className="specialOffer_select_view specialOffer_select_tags1">
                  下期预告
                </View>
              </View>
              <View className="specialOffer_novite_scroll">
                {noticeList.map((item) => {
                  return specailGoods(item, configUserLevelInfo);
                })}
              </View>
            </View>
          </View>
        );
      } else {
        console.log(111);
        return null;
      }
    };
    return (
      <View className="specialOffer_box">
        <View className="specialOffer_banner"></View>
        {template()}

        <View
          style={noticeList && specialGoodsList ? { marginTop: 24 } : {}}
          className="specialOffer_content"
        >
          <View className="specialOffer_content_pay public_center">
            抢购列表
          </View>
          {kolGoodsList.map((item) => {
            return childTemplate(item, configUserLevelInfo);
          })}
        </View>
      </View>
    );
  }
}

export default Index;
