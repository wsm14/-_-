import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { city } from "@/common/city";
import classNames from "classnames";
import {
  getDom,
  getLat,
  getLnt,
  toast,
  fakeStorage,
  fetchStorage,
} from "@/utils/utils";
import { resiApiKey } from "@/common/constant";
import { getAuthStatus } from "@/common/authority";
import { fetchDictionary } from "@/server/common";
import { getRestapiAddress } from "@/server/other";
import evens from "@/common/evens";
import Router from "@/utils/router";
import { inject, observer } from "mobx-react";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      scrollTop: 0,
      initCity: {},
      initCityStatus: 0,
      oldCity: fetchStorage("oldCity") || [],
      hot: [],
    };
  }
  filterAddress() {
    getAuthStatus({
      key: "location",
      success: () => {
        this.fetchAddress();
      },
      fail: () => {
        this.setState({
          initCityStatus: 2,
        });
      },
    });
  }
  fetchHotCity() {
    fetchDictionary(
      {
        parent: "hotCityConfig",
        child: "hotCityList",
      },
      (res) => {
        const { keyValueInfo = {} } = res;
        const { extraParam = "" } = keyValueInfo;
        this.setState({
          hot: extraParam
            ? JSON.parse(extraParam).map((item) => {
                return { name: item.cityName, cityCode: item.cityCode };
              })
            : [],
        });
      }
    );
  }
  filterCity() {
    getAuthStatus({
      key: "location",
      success: () => {
        this.fetchAddress();
      },
      fail: () => {
        evens.$emit("setLocation");
      },
    });
  }
  fetchAddress() {
    getRestapiAddress(
      {
        location: `${getLnt()},${getLat()}`,
        key: resiApiKey,
      },
      (res) => {
        const { info, regeocode = {} } = res;
        if (info === "OK") {
          console.log(res, regeocode);
          const { addressComponent = {} } = regeocode;
          const { adcode, city } = addressComponent;
          this.setState({
            initCity: {
              cityCode: adcode.slice(0, 4),
              name: city,
            },
            initCityStatus: 1,
          });
        } else {
          this.setState({
            initCityStatus: 2,
          });
        }
      }
    );
  }
  componentDidMount() {
    this.filterAddress();
    this.fetchHotCity();
  }
  setIndex(item) {
    const { cityCode } = item;
    const { oldCity } = this.state;
    let newList = oldCity.filter((val) => {
      return val.cityCode !== cityCode;
    });
    fakeStorage("oldCity", [{ ...item }, ...newList].slice(0, 2));
    fakeStorage("city", {
      cityCode: item.cityCode,
      cityName: item.name,
      type: 1,
    });
    this.props.store.locationStore.setCity(item.name, item.cityCode, "1");
    Router({
      routerName: "perimeter",
      type: "reLaunch",
    });
  }

  searchSelect(title) {
    getDom("#" + title, (res) => {
      const { top } = res[0];
      Taro.pageScrollTo({
        selector: `#${title}`,
        duration: 300,
        success: () => {
          toast(title);
        },
      });
    });
  }
  tishiDom() {
    return (
      <View className="city_toast_box">
        <View>
          自动定位杭州，更多精彩敬请期待 详情可咨询客服，联系电话：
          <Text className="color4">400 -800-5881</Text>
        </View>
      </View>
    );
  }
  render() {
    const tagStyle = {
      marginRight: "14px",
    };
    const { hot, visible, initCityStatus, initCity, oldCity } = this.state;
    const marginTags = (list, num, style, components) => {
      return list.map((item, index) => {
        return (
          <View style={(index + 1) % num !== 0 && style}>
            {components(item, index)}
          </View>
        );
      });
    };
    return (
      <View className="city_box">
        <View className="city_title">当前定位/历史访问</View>
        <View className="city_tags">
          {initCityStatus === 1 && (
            <View
              className="city_tags_select city_tags_init color1"
              onClick={() => this.setIndex(initCity)}
            >
              <View className="max_font_width font_hide"> {initCity.name}</View>
            </View>
          )}
          {/* // 加载成功状态 */}
          {initCityStatus === 0 && (
            <View className="city_tags_box color4">正在定位...</View>
          )}
          {/* // 加载中状态 */}
          {initCityStatus === 2 && (
            <View
              onClick={() => {
                this.filterCity();
              }}
              className="city_tags_box city_tags_error color3"
            >
              定位失败，点击重试
            </View>
          )}
          {oldCity.map((item) => {
            return (
              <View
                style={{ marginLeft: Taro.pxTransform(12) }}
                onClick={() => this.setIndex(item)}
                className="city_tags_select color1"
              >
                <View className="max_font_width font_hide"> {item.name}</View>
              </View>
            );
          })}
        </View>
        <View className="city_title">热门城市</View>
        <View className="city_tags">
          {marginTags(hot, 3, tagStyle, (item, index) => {
            return (
              <View
                onClick={() => this.setIndex(item)}
                className={classNames("city_tags_select color1")}
              >
                <View className="max_font_width font_hide"> {item.name}</View>
              </View>
            );
          })}
        </View>
        {city.map((item) => {
          const { title, items } = item;
          return (
            <View className="city_father">
              <View id={title} className="city_type_select color1">
                {item.title}
              </View>
              {items.map((val) => {
                return (
                  <View
                    onClick={() => this.setIndex(val)}
                    className="city_type_selectTab font28 color1"
                  >
                    {val.name}
                  </View>
                );
              })}
            </View>
          );
        })}
        <View className="city_right_layer">
          <View>
            <View
              onClick={() =>
                Taro.pageScrollTo({
                  scrollTop: 0,
                  duration: 300,
                })
              }
              className="city_child_box"
            >
              顶部
            </View>
            {city.map((item) => {
              const { title, items } = item;
              return (
                <View
                  onClick={() => this.searchSelect(title)}
                  className="city_child_box"
                >
                  {item.title}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
