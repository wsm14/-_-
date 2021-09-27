import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
import { listAllLocationCity } from "@/server/common";
import { backgroundObj ,toast} from "@/common/utils";
import Waterfall from "@/components/waterfall";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        status: "0",
        page: 1,
        limit: 10,
      },
      countStatus: true,
      locationCityList: [],
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
  cityImage(item, index) {
    const { backgroundImg, cityName, cityDesc,citySpell } = item;
    return (
      <View style={backgroundObj(backgroundImg)} className="willCity_ImageBox">
        <View className="willCity_city">
          <View className="willCity_city_font1">{citySpell}</View>
          <View className="willCity_city_font2">{cityName}</View>
        </View>
      </View>
    );
  }
  componentDidMount() {
    this.listAllLocationCitys();
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
      return 
    }
  } //上拉加载
  render() {
    const { locationCityList } = this.state;
    return (
      <View className="willCity_box">
        <Waterfall
          noMargin={{ margin: "0" }}
          style={{ width: Taro.pxTransform(375) }}
          list={locationCityList}
          createDom={this.cityImage.bind(this)}
          imgHight={240}
        ></Waterfall>
      </View>
    );
  }
}

export default Index;
