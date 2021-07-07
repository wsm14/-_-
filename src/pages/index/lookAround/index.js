import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { ScrollView, View, Text } from "@tarojs/components";
import Banner from "@/components/banner";
import {
  backgroundObj,
  toast,
  getDom,
  getLat,
  getLnt,
  navigateTo,
  resiApiKey,
  computedClient,
} from "@/common/utils";
import {
  getBanner,
  getConfigWindVaneBySize,
  getSpecialGoodsCategory,
  getRestapiAddress,
} from "@/server/common";
import classNames from "classnames";
import { fetchSpecialGoods, fetchUserShareCommission } from "@/server/index";
import { getConfigNewcomerOrders } from "@/server/goods";
import { inject, observer } from "mobx-react";
import Router from "@/common/router";
import TabCity from "./components/tabCity";
import ToastCity from "./components/toastCity";
import Navition from "./components/navition";
import Plate from "./components/plate";
import SelectSpecal from "./components/selectSpecal";
import SpecalPlate from "./components/specalPlate";
import "./index.scss";
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
        specialFilterType: "aroundSpecial",
        categoryIds: "",
      },
      configUserLevelInfo: {},
      hotList: [],
      dateList: [],
      kolGoodsList: [],
      categoryList: [],
      flagDom: false,
      result: {},
      num: Taro.getStorageSync("toast") || 0,
      configNewcomerOrdersInfo: {},
    };
  }
  //上拉刷新
  onReload() {
    this.setState(
      {
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
          specialFilterType: "aroundSpecial",
          categoryIds: "",
        },
        configUserLevelInfo: {},
        hotList: [],
        dateList: [],
        kolGoodsList: [],
        categoryList: [],
        triggered: true,
        flagDom: false,
      },
      (res) => {
        const { hotHttp, dateHttp } = this.state;
        this.topBanner();
        this.getConfigWindVaneBySize();
        this.contentBanner();
        this.getshopList(hotHttp, "hotList");
        this.getshopList(dateHttp, "dateList");
        this.getSpecialGoodsCategory();
        this.fetchUserShare();
        this.fetchgNewcomerOrders();
      }
    );
  }
  componentDidMount() {
    const { hotHttp, dateHttp, num } = this.state;
    Taro.setStorageSync("toast", num + 1);
    this.setMap();
    this.topBanner();
    this.getConfigWindVaneBySize();
    this.contentBanner();
    this.getshopList(hotHttp, "hotList");
    this.getshopList(dateHttp, "dateList");
    this.getSpecialGoodsCategory();
    this.fetchgNewcomerOrders();
  }
  componentDidShow() {
    this.fetchUserShare();
  }
  fetchgNewcomerOrders() {
    getConfigNewcomerOrders({}, (res) => {
      const { configNewcomerOrdersInfo = {} } = res;
      this.setState({
        configNewcomerOrdersInfo,
      });
    });
  }
  setMap() {
    const latitude = getLat();
    const longitude = getLnt();
    if (latitude && longitude)
      this.setState(
        {
          lnt: longitude,
          lat: latitude,
        },
        (res) => {
          getRestapiAddress(
            {
              location: `${longitude},${latitude}`,
              key: resiApiKey,
            },
            (res) => {
              const { info, regeocode = {} } = res;
              if (info === "OK") {
                const { addressComponent = {} } = regeocode;
                this.setState({
                  result: addressComponent,
                });
              } else {
                toast(info);
              }
            }
          );
        }
      );
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

  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
        triggered: false,
      });
    }).catch((e) => {
      this.setState({
        triggered: false,
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
    } else if (box === scrollLeft || scrollLeft > box) {
      this.setState({
        left: 65,
      });
    } else {
      this.setState({
        left: parseInt((scrollLeft / box) * 100) - 32,
      });
    }
  };

  getSpecialGoodsCategory() {
    getSpecialGoodsCategory({}, (res) => {
      const { categoryList = [] } = res;
      if (categoryList.length > 0) {
        this.setState(
          {
            categoryList: [...categoryList],
            specialHttp: {
              ...this.state.specialHttp,
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
            specialFilterType: null,
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
      dateList = [],
      kolGoodsList = [],
      flagDom,
      triggered,
      specialHttp: { categoryIds, specialFilterType },
      result = {},
      num,
      configNewcomerOrdersInfo: {
        taskStatus = "2",
        remainDay,
        orderNum,
        subsidyBean,
      },
    } = this.state;
    const { cityName, cityCode } = this.props.store.locationStore;
    const templateSelect = () => {
      return (
        <>
          <View
            onClick={() => {
              this.setState(
                {
                  specialHttp: {
                    specialFilterType: "aroundSpecial",
                    categoryIds: "",
                    page: 1,
                    limit: 10,
                  },
                  kolGoodsList: [],
                },
                (res) => {
                  this.getshopList(this.state.specialHttp);
                }
              );
            }}
            className={classNames(
              "lookAround_categorys",
              specialFilterType === "aroundSpecial"
                ? "lookAround_categorys_true bold"
                : "lookAround_categorys_flag"
            )}
          >
            <View className="lookAround_topText">周边特惠</View>
            <View
              className={classNames(
                "lookAround_categorys_iconText",
                specialFilterType === "aroundSpecial"
                  ? "lookAround_iconText_color1"
                  : "lookAround_iconText_color2"
              )}
            >
              {specialFilterType === "aroundSpecial" && (
                <View className="lookAround_categorys_icon"></View>
              )}
            </View>
          </View>

          <View
            onClick={() => {
              this.setState(
                {
                  specialHttp: {
                    specialFilterType: "follow",
                    categoryIds: "",
                    page: 1,
                    limit: 10,
                  },
                  kolGoodsList: [],
                },
                (res) => {
                  this.getshopList(this.state.specialHttp);
                }
              );
            }}
            className={classNames(
              "lookAround_categorys",
              specialFilterType === "follow"
                ? "lookAround_categorys_true bold"
                : "lookAround_categorys_flag"
            )}
          >
            <View className="lookAround_topText">关注</View>
            <View
              className={classNames(
                "lookAround_categorys_iconText",
                specialFilterType === "follow"
                  ? "lookAround_iconText_color1"
                  : "lookAround_iconText_color2"
              )}
            >
              {specialFilterType === "follow" && (
                <View className="lookAround_categorys_icon"></View>
              )}
            </View>
          </View>
        </>
      );
    };
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
        {num === 0 && (
          <View className="wechant_init color6 font28">
            “添加到我的小程序”，更多优惠抢不停
          </View>
        )}
        <ScrollView
          scrollY
          onScrollToLower={this.getReachBottom.bind(this)}
          refresherEnabled
          onRefresherRefresh={this.onReload.bind(this)}
          refresherTriggered={triggered}
          className="lookAround_category_box"
          onScroll={(e) => {
            getDom(".lookAround_categorys_box", (res) => {
              const { top } = res[0];
              if (top) {
                if (top < 40) {
                  this.setState({
                    flagDom: true,
                  });
                } else {
                  this.setState({
                    flagDom: false,
                  });
                }
              }
            });
          }}
        >
          <View>
            <Banner
              imgName="coverImg"
              data={[...specialHeadList]}
              bottom={bottom}
              boxStyle={bannerStyle}
              showNear
            ></Banner>
          </View>
          <ScrollView
            onScroll={this.setSlider.bind(this)}
            className="lookAround_category_scroll"
            scrollX
          >
            {[
              {
                image:
                  "https://wechat-config.dakale.net/miniprogram/image/icon567.png",
                name: "周边好店",
                bubbleFlag: "0",
                bubbleContent: "",
                scenesId: "",
              },
              ...configWindVaneList,
            ].map((item, index) => {
              const { name, image, bubbleFlag, bubbleContent, scenesId } = item;
              if (index === 0) {
                return (
                  <View
                    className="lookAround_category_view animated  fadeIn"
                    onClick={() =>
                      Router({
                        routerName: "perimeterShops",
                      })
                    }
                  >
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
              } else {
                return (
                  <View
                    className="lookAround_category_view animated  fadeIn"
                    onClick={() =>
                      Router({
                        routerName: "benchmark",
                        args: {
                          scenesId,
                          name,
                        },
                      })
                    }
                  >
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
              }
            })}
          </ScrollView>
          <View className="lookAround_category_liner">
            <View
              style={{ left: left + "%" }}
              className="slider-inside .slider-inside-location"
            ></View>
          </View>
          {(taskStatus === "0" || taskStatus === "1") && (
            <View
              className="lookAround_goods_init"
              onClick={() =>
                Router({
                  routerName: "download",
                })
              }
            >
              <View className="lookAround_goods_font">
                新人{remainDay}天内成功核销{orderNum}单，赚
                <Text className="color3">{subsidyBean}</Text>卡豆
              </View>
            </View>
          )}
          <SpecalPlate
            data={hotList}
            userInfo={configUserLevelInfo}
            list={dateList}
          ></SpecalPlate>
          <Plate userInfo={configUserLevelInfo}></Plate>
          <Banner
            imgName="coverImg"
            data={[...specialShopping]}
            bottom={bottomContent}
            boxStyle={bannerContentStyle}
            showNear
          ></Banner>

          <View className="lookAround_linder_bottom"></View>
          <View className="lookAround_category_linder"></View>
          <View
            style={
              flagDom
                ? { visibility: "hidden", position: "relative", zIndex: "-1" }
                : {}
            }
            className="lookAround_categorys_box lookAround_categorys_box1"
          >
            <View
              className="lookAround_categorys_orderBtn"
              onClick={() =>
                Router({
                  routerName: "goodList",
                })
              }
            ></View>
            <ScrollView
              scrollWithAnimation={true}
              scrollX
              className="lookAround_categorys_parent"
            >
              {templateSelect()}
              {categoryList.map((item) => {
                const { categoryName, subtitle, categoryIdString } = item;
                return (
                  <View
                    onClick={this.tabGoods.bind(this, item)}
                    className={classNames(
                      "lookAround_categorys",
                      categoryIds === categoryIdString
                        ? "lookAround_categorys_true bold"
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
            type={specialFilterType}
          ></SelectSpecal>
        </ScrollView>
        {
          <View
            style={!flagDom ? { display: "none" } : {}}
            className="lookAround_categorys_box nav_flex"
          >
            <View
              className="lookAround_categorys_orderBtn"
              onClick={() =>
                Router({
                  routerName: "goodList",
                })
              }
            ></View>
            <ScrollView
              scrollWithAnimation={true}
              scrollX
              className="lookAround_categorys_parent"
            >
              {templateSelect()}
              {categoryList.map((item) => {
                const { categoryName, subtitle, categoryIdString } = item;
                return (
                  <View
                    onClick={this.tabGoods.bind(this, item)}
                    className={classNames(
                      "lookAround_categorys",
                      categoryIds === categoryIdString
                        ? "lookAround_categorys_true bold"
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
        <TabCity
          reload={this.onReload.bind(this)}
          store={this.props.store}
          data={result}
        ></TabCity>
        <ToastCity store={this.props.store} data={result}></ToastCity>
      </View>
    );
  }
}

export default Index;
