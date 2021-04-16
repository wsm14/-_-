import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import "./index.scss";
import { getUserCoupon } from "@/server/perimeter";
import { toast } from "@/common/utils";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        merchantId: getCurrentInstance().router.params,
        page: 1,
        limit: 10,
      },
      countStatus: true,
      index: 0,
    };
  }
  getUserCoupon() {
    const { httpData } = this.state;
    getUserCoupon(httpData, (res) => {
      const { couponList = [] } = res;
      if (couponList.length !== 0) {
        this.setState({
          couponList: [...this.state.couponList, ...couponList],
          index: 1,
        });
      } else {
        this.setState({
          countStatus: false,
        });
      }
    });
  }
  componentDidShow() {
    const { index } = this.state;
    if (index === 0) {
      this.getUserCoupon();
    }
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
          this.getUserCoupon();
        }
      );
    } else {
      return toast("暂无数据");
    }
  } //上拉加载
  render() {
    const {
      locationCityList,
      locationCityInfo: { cityDesc = "" },
    } = this.state;
    const { cityCode, cityName } = this.props.store.locationStore;
    return (
      <View className="city_box">
        <View className="city_content_box">
          <View className="city_content_user">
            <View className="city_content_userIcon"></View>
            <View className="city_content_userName bold">我在·{cityName}</View>
            <View className="city_content_desc">{cityDesc}</View>
          </View>
        </View>
        <View className="city_content_citys">
          {locationCityList.map((item) => {
            const {
              backgroundImg,
              locationCityIdString,
              cityCode,
              cityName,
              citySpell,
            } = item;
            return (
              <View
                className="city_content_cityImage"
                onClick={() => {
                  this.props.store.locationStore.setCity(
                    cityName,
                    cityCode,
                    "1"
                  );
                  Taro.reLaunch({
                    url: "/pages/index/lookAround/index",
                  });
                }}
                style={backgroundObj(backgroundImg)}
              >
                <View className="city_content_font1 bold">{citySpell}</View>
                <View className="city_content_font2 bold">{cityName}</View>
              </View>
            );
          })}
        </View>

        <View className="city_content_bottom"></View>
        <View
          className="city_content_bottomGO"
          onClick={() =>
            Router({
              routerName: "willCity",
            })
          }
        ></View>
      </View>
    );
  }
}

export default Index;
