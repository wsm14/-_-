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
  fetchConfigWindVaneBySizeNew,
  getSpecialGoodsCategory,
  getRestapiAddress,
} from "@/server/common";
import classNames from "classnames";
import { fetchSpecialGoods, fetchUserShareCommission } from "@/server/index";
import { getConfigNewcomerOrders } from "@/server/goods";
import { inject, observer } from "mobx-react";
import Router from "@/common/router";
import TabCity from "./components/tabCity";
import Navition from "./components/navition";
import Plate from "./components/plate";
import SpecalPlate from "./components/specalPlate";
import ConfigWind from "./components/configWindVane";
import CategoryGoods from "./components/categoryGoods";
import HotOnly from "./components/hotOnly";
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
      hotHttp: {
        page: 1,
        limit: 2,
        specialFilterType: "hot",
      },
      dateHttp: {
        page: 1,
        limit: 3,
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
      size: 0,
      isFixedTop: 0,
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
        hotHttp: {
          page: 1,
          limit: 2,
          specialFilterType: "hot",
        },
        dateHttp: {
          page: 1,
          limit: 3,
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
        isFixedTop: 0,
        triggered: true,
      },
      (res) => {
        Taro.stopPullDownRefresh();
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
  onPullDownRefresh() {
    this.onReload();
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
    fetchConfigWindVaneBySizeNew({}, (res) => {
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
  bubbleLink(item) {
    let { param = "", jumpUrlNew, jumpUrlType = "", jumpUrl = "" } = item;
    param = (param && JSON.parse(param)) || {};
    jumpUrlNew = (jumpUrlNew && JSON.parse(jumpUrlNew)) || {};
    const { weChatUrl = "" } = jumpUrlNew;
    if (jumpUrlType === "native" && weChatUrl) {
      Router({
        routerName: weChatUrl,
        args: {
          ...param,
          categoryId: param.categoryId || param.topCategoryId,
        },
      });
    } else if (jumpUrlType === "h5" && jumpUrl) {
      Router({
        routerName: "webView",
        args: {
          link: jumpUrl.split("?")[0],
          url: jumpUrl.split("?")[1] || "",
        },
      });
    } else return toast("该风向标无跳转路径");
  }
  onPageScroll(e) {
    const { flagDom } = this.state;
    if (!flagDom) {
      Taro.createSelectorQuery()
        .select(".lookAround_categorys_box1")
        .boundingClientRect((rect) => {
          const { top } = rect;
          console.log(top);
          if (top >= 32) {
            if (flagDom) {
              this.setState({
                flagDom: false,
              });
            }
          } else {
            if (!flagDom) {
              this.setState({
                flagDom: true,
              });
            }
          }
        })
        .exec();
    } else {
      Taro.createSelectorQuery()
        .select(".lookAround_category_fixed")
        .boundingClientRect((rect) => {
          const { top } = rect;
          console.log(top);
          if (top >= 32) {
            if (flagDom) {
              this.setState({
                flagDom: false,
              });
            }
          } else {
            if (!flagDom) {
              this.setState({
                flagDom: true,
              });
            }
          }
        })
        .exec();
    }
  }
  onReachBottom() {
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
      configUserLevelInfo,
      hotList,
      categoryList = [],
      dateList = [],
      kolGoodsList = [],
      flagDom,
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
    const { cityName } = this.props.store.locationStore;

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
            <View className="lookAround_topText">特惠推荐</View>
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
        <View className="lookAround_goods_topHeight"></View>
        <Banner
          imgName="coverImg"
          data={[...specialHeadList]}
          bottom={bottom}
          boxStyle={bannerStyle}
          showNear
        ></Banner>
        <ConfigWind
          onChange={this.bubbleLink.bind(this)}
          list={configWindVaneList}
        ></ConfigWind>
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
        <HotOnly data={hotList} userInfo={configUserLevelInfo}></HotOnly>
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
        <CategoryGoods
          configUserLevelInfo={configUserLevelInfo}
          flagDom={flagDom}
          list={kolGoodsList}
          saveRouter={this.saveRouter.bind(this)}
          specialFilterType={specialFilterType}
          categoryList={categoryList}
          templateSelect={templateSelect}
          categoryIds={categoryIds}
          tabGoods={this.tabGoods.bind(this)}
        ></CategoryGoods>
        <TabCity
          reload={this.onReload.bind(this)}
          store={this.props.store}
          data={result}
        ></TabCity>
      </View>
    );
  }
}

export default Index;
