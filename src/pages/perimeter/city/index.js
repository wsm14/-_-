import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
import { listAllLocationCity, getLocationCity } from "@/server/common";
import { backgroundObj, goBack } from "@/common/utils";
import Router from "@/common/router";
import { inject, observer } from "mobx-react";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        status: "1",
        page: 1,
        limit: 10,
      },
      countStatus: true,
      locationCityList: [],
      locationCityInfo: {},
    };
  }
  listAllLocationCitys() {
    const { httpData } = this.state;
    listAllLocationCity(httpData, (res) => {
      const { locationCityList = [] } = res;
      if (locationCityList && locationCityList.length > 0) {
        this.setState({
          locationCityList: [
            ...this.state.locationCityList,
            ...locationCityList,
          ],
        });
      } else {
        this.setState({
          countStatus: false,
        });
      }
    });
  }
  getLocationCitys() {
    const { cityCode } = this.props.store.locationStore;
    getLocationCity({ cityCode: cityCode }, (res) => {
      const { locationCityInfo } = res;
      this.setState({
        locationCityInfo,
      });
    });
  }
  componentDidMount() {
    this.listAllLocationCitys();
    this.getLocationCitys();
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
          this.listAllLocationCitys();
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
                    url: "/pages/index/perimeter/index",
                  });
                }}
                style={backgroundObj(backgroundImg)}
              >
                <View className="city_content_font1  bold">{citySpell}</View>
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
