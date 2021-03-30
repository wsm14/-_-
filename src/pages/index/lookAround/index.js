import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { ScrollView, View } from "@tarojs/components";
import Navition from "./components/navition";
import HotSpecal from "./components/hotSpecal";
import DateSpecal from "./components/dateSpecal";
import SelectSpecal from "./components/selectSpecal";
import Banner from "@/components/banner";
import { backgroundObj, toast, getDom } from "@/common/utils";
import {
  getBanner,
  getConfigWindVaneBySize,
  getSpecialGoodsCategory,
} from "@/server/common";
import classNames from "classnames";
import { fetchSpecialGoods, fetchUserShareCommission } from "@/server/index";
import "./index.scss";
import { inject, observer } from "mobx-react";
import Router from "@/common/router";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      specialHeadList: [], //头部轮播图
      configWindVaneList: [], //类目筛序
      specialShopping: [], //中间轮播图
      left: 0,
      hotHttp: {
        page: 1,
        limit: 5,
        specialFilterType: "hot",
      },
      dateHttp: {
        page: 1,
        limit: 6,
        specialFilterType: "today",
      },

      specialHttp: {
        page: 1,
        limit: 10,
        specialFilterType: "recommend",
        categoryIds: "",
      },
      configUserLevelInfo: {},

      hotList: [],
      dateList: [],
      kolGoodsList: [],
      categoryList: [],
      flagDom: false,
    };
  }

  componentDidMount() {
    const { hotHttp, dateHttp } = this.state;
    this.topBanner();
    this.getConfigWindVaneBySize();
    this.contentBanner();
    this.getshopList(hotHttp, "hotList");
    this.getshopList(dateHttp, "dateList");
    this.getSpecialGoodsCategory();
  }
  componentDidShow() {
    this.fetchUserShareCommission();
  }

  getshopList(data, key = "kolGoodsList") {
    fetchSpecialGoods(data, (res) => {
      const { specialGoodsList = [] } = res;
      console.log(res);
      this.setState({
        [key]: [...this.state[key], ...specialGoodsList],
      });
    });
  }
  topBanner() {
    getBanner({ bannerType: "wanderAroundMainBanner" }, (res) => {
      const { bannerList } = res;
      this.setState({
        specialHeadList: bannerList,
      });
    });
  }
  contentBanner() {
    getBanner({ bannerType: "wanderAroundCapsule" }, (res) => {
      const { bannerList = [] } = res;
      this.setState({
        specialShopping: bannerList,
      });
    });
  }
  getConfigWindVaneBySize() {
    getConfigWindVaneBySize({ size: 10 }, (res) => {
      const { configWindVaneList } = res;
      this.setState({
        configWindVaneList,
      });
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
  setSlider = (val) => {
    const {
      detail: { scrollLeft, scrollWidth },
    } = val;
    let box = scrollWidth - 335;
    if (parseInt((scrollLeft / box) * 100) < 50) {
      this.setState({
        left: 0,
      });
      return;
    }
    this.setState({
      left: parseInt((scrollLeft / box) * 100) - 50,
    });
  };

  getSpecialGoodsCategory() {
    getSpecialGoodsCategory({}, (res) => {
      const { categoryList = [] } = res;
      if (categoryList.length > 0) {
        this.setState(
          {
            categoryList,
            specialHttp: {
              ...this.state.specialHttp,
              categoryIds: categoryList[0].categoryIdString,
            },
          },
          (res) => {
            const { specialHttp } = this.state;
            this.getshopList(specialHttp);
          }
        );
      }
    });
  }

  tabGoods(item) {
    const { categoryIdString } = item;
    const {
      specialHttp: { categoryIds },
    } = this.state;
    if (categoryIdString === categoryIds) {
      return;
    } else {
      this.setState(
        {
          specialHttp: {
            ...this.state.specialHttp,
            page: 1,
            categoryIds: categoryIdString,
          },
          kolGoodsList: [],
        },
        (res) => {
          this.getshopList(this.state.specialHttp);
        }
      );
    }
  }

  getReachBottom() {
    const { countStatus, specialHttp } = this.state;

    this.setState(
      {
        specialHttp: {
          ...specialHttp,
          page: specialHttp.page + 1,
        },
      },
      (res) => {
        this.getshopList(this.state.specialHttp);
      }
    );
  } //上拉加载
  saveRouter(activityId, merchantId) {
    Router({
      routerName: "favourableDetails",
      args: {
        specialActivityId: activityId,
        merchantId: merchantId,
      },
    });
  }
  render() {
    const {
      specialHeadList,
      configWindVaneList,
      specialShopping,
      left,
      configUserLevelInfo,
      hotList,
      categoryList = [],
      kolGoodsList = [],
      flagDom,
      specialHttp: { categoryIds },
    } = this.state;
    const { cityName, cityCode } = this.props.store.locationStore;
    const bannerStyle = {
      width: Taro.pxTransform(686),
      height: Taro.pxTransform(200),
      margin: `${Taro.pxTransform(0)} auto  0`,
      position: "relative",
    };
    const bottom = {
      bottom: Taro.pxTransform(-12),
      justifyContent: "flex-end",
    };
    const bannerContentStyle = {
      width: Taro.pxTransform(686),
      height: Taro.pxTransform(160),
      margin: `${Taro.pxTransform(30)} auto  0`,
      position: "relative",
    };
    const bottomContent = {
      bottom: Taro.pxTransform(-12),
      justifyContent: "center",
    };
    return (
      <View className="lookAround_box">
        <Navition city={cityName}></Navition>
        <ScrollView
          scrollY
          onScrollToLower={this.getReachBottom.bind(this)}
          className="lookAround_category_box"
          onScroll={(e) => {
            getDom(".lookAround_categorys_box", (res) => {
              const { top } = res[0];
              if (top < 40) {
                this.setState({
                  flagDom: true,
                });
              } else {
                this.setState({
                  flagDom: false,
                });
              }
            });
          }}
        >
          <Banner
            imgName="coverImg"
            data={[...specialHeadList]}
            bottom={bottom}
            boxStyle={bannerStyle}
            showNear
          ></Banner>
          <ScrollView
            onScroll={this.setSlider.bind(this)}
            className="lookAround_category_scroll"
            scrollX
          >
            {configWindVaneList.map((item) => {
              const { name, image, bubbleFlag, bubbleContent } = item;
              return (
                <View className="lookAround_category_view animated  fadeIn">
                  <View
                    className="lookAround_category_image  dakale_nullImage"
                    style={backgroundObj(image)}
                  ></View>
                  <View className="lookAround_category_font">{name}</View>
                  {bubbleFlag === "1" && (
                    <View className="lookAround_category_bubble">
                      {bubbleContent}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
          <View className="lookAround_category_liner">
            <View
              style={{ left: left + "%" }}
              className="slider-inside .slider-inside-location"
            ></View>
          </View>
          <Banner
            imgName="coverImg"
            data={[...specialShopping]}
            bottom={bottomContent}
            boxStyle={bannerContentStyle}
            showNear
          ></Banner>
          <HotSpecal
            linkTo={this.saveRouter.bind(this)}
            userInfo={configUserLevelInfo}
            data={hotList}
          ></HotSpecal>
          <DateSpecal
            userInfo={configUserLevelInfo}
            data={hotList}
            linkTo={this.saveRouter.bind(this)}
          ></DateSpecal>
          <View className="lookAround_category_linder"></View>
          <View
            style={
              flagDom
                ? { visibility: "hidden", position: "relative", zIndex: "-1" }
                : {}
            }
            className="lookAround_categorys_box lookAround_categorys_box1"
          >
            <ScrollView
              scrollWithAnimation={true}
              scrollX
              className="lookAround_categorys_parent"
            >
              {categoryList.map((item) => {
                const { categoryName, subtitle, categoryIdString } = item;
                return (
                  <View
                    onClick={this.tabGoods.bind(this, item)}
                    className={classNames(
                      "lookAround_categorys",
                      categoryIds === categoryIdString
                        ? "lookAround_categorys_true"
                        : "lookAround_categorys_flag"
                    )}
                  >
                    <View className="lookAround_topText">{categoryName}</View>
                    <View
                      className={classNames(
                        "lookAround_categorys_iconText",
                        categoryIds === categoryIdString
                          ? "lookAround_iconText_color1"
                          : "lookAround_iconText_color2"
                      )}
                    >
                      {subtitle}
                      {categoryIds === categoryIdString && (
                        <View className="lookAround_categorys_icon"></View>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <SelectSpecal
            userInfo={configUserLevelInfo}
            data={kolGoodsList}
            linkTo={this.saveRouter.bind(this)}
          ></SelectSpecal>
        </ScrollView>
        {
          <View
            style={!flagDom ? { display: "none" } : {}}
            className="lookAround_categorys_box nav_flex"
          >
            <ScrollView
              scrollWithAnimation={true}
              scrollX
              className="lookAround_categorys_parent"
            >
              {categoryList.map((item) => {
                const { categoryName, subtitle, categoryIdString } = item;
                return (
                  <View
                    onClick={this.tabGoods.bind(this, item)}
                    className={classNames(
                      "lookAround_categorys",
                      categoryIds === categoryIdString
                        ? "lookAround_categorys_true"
                        : "lookAround_categorys_flag"
                    )}
                  >
                    <View className="lookAround_topText">{categoryName}</View>
                    <View
                      className={classNames(
                        "lookAround_categorys_iconText",
                        categoryIds === categoryIdString
                          ? "lookAround_iconText_color1"
                          : "lookAround_iconText_color2"
                      )}
                    >
                      {subtitle}
                      {categoryIds === categoryIdString && (
                        <View className="lookAround_categorys_icon"></View>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        }
      </View>
    );
  }
}

export default Index;
