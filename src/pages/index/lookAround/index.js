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
  fetchAroundModule,
} from "@/server/common";
import { fetchSelfTourGoods } from "@/server/perimeter";
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
import DateOnly from "./components/DateOnly";
import Empty from "@/components/Empty";
import GameGoods from "./components/gameBuyMe";
import Skeleton from "./components/SkeletonView";
import SelfGoods from "./components/selfourOnly";
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
        limit: 3,
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
      configNewcomerOrdersInfo: {},
      wanderAroundModule: [],
      selfTourBanner: [],
      requestStatus: true,
      loading: false,
      selfTourResourceList: [],
      beanCodeList: [],
      newDateList: [],
    };
  }
  topBanner() {
    getBanner({ bannerType: "wanderAroundMainBanner" }, (res) => {
      const { bannerList } = res;
      this.setState({
        specialHeadList: bannerList,
      });
    });
  }
  fetchSelfTour() {
    fetchSelfTourGoods({}).then((val) => {
      const { selfTourGoodList = [] } = val;
      this.setState({
        selfTourResourceList: selfTourGoodList,
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
  selfTourBanner() {
    getBanner({ bannerType: "wanderAroundRecharge" }, (res) => {
      const { bannerList = [] } = res;
      this.setState({
        selfTourBanner: bannerList,
      });
    });
  }
  beanCodeBanner() {
    getBanner({ bannerType: "wanderAroundBean" }, (res) => {
      const { bannerList = [] } = res;
      this.setState({
        beanCodeList: bannerList,
      });
    });
  }
  //轮播图配置项

  filterRequest() {
    const { hotHttp, dateHttp, wanderAroundModule } = this.state;
    const requestObj = {
      mainBanner: () => this.topBanner(),
      capsulePosition: () => this.contentBanner(),
      recharge: this.selfTourBanner(),
      notify: () => this.fetchgNewcomerOrders(),
      windVane: () => this.getConfigWindVaneBySize(),
      specialRecommend: () => {
        this.setState(
          {
            specialHttp: {
              page: 1,
              limit: 10,
              specialFilterType: "aroundSpecial",
              categoryIds: "",
            },
          },
          (res) => {
            this.getSpecialGoodsCategory();
          }
        );
      },
      limitedTimeAndExplosive: () => {
        this.getshopList(hotHttp, "hotList");
        this.getshopList(dateHttp, "dateList");
      },
      explosive: () => this.getshopList(dateHttp, "dateList"),
      limitedTime: () => this.getshopList(hotHttp, "hotList"),
      selfTour: () => {
        this.fetchSelfTour();
      },
      selfTourResource: () => {
        this.fetchSelfTour();
      },
      newProductRecommend: () => {
        fetchSpecialGoods(
          { page: 1, limit: 10, specialFilterType: "newProductRecommend" },
          (res) => {
            const { specialGoodsList = [] } = res;
            this.setState({
              newDateList: specialGoodsList,
            });
          }
        );
      },
      beanSpecialArea: () => this.beanCodeBanner(),
    };
    wanderAroundModule.forEach((val) => {
      requestObj[val] && requestObj[val]();
    });
    this.fetchUserShare();
  }
  //上拉刷新
  onReload() {
    const { specialHttp } = this.state;
    this.setState(
      {
        specialHeadList: [], //头部轮播图
        configWindVaneList: [], //类目筛序
        specialShopping: [], //中间轮播图
        specialHttp: {
          ...specialHttp,
          page: 1,
        },
        configUserLevelInfo: {},
        hotList: [],
        dateList: [],
        kolGoodsList: [],
        categoryList: [],
        triggered: true,
      },
      (res) => {
        Taro.stopPullDownRefresh();
        this.fetchModule();
      }
    );
  }
  onPullDownRefresh() {
    this.onReload();
  }
  componentDidMount() {
    // Taro.setStorageSync("toast", num + 1);
    this.setMap();
    this.fetchModule();
  }
  componentDidShow() {
    this.fetchUserShare();
    Taro.setTabBarStyle({
      color: "#999999",
      selectedColor: "#333333",
      backgroundColor: "FFFFFF",
    });
  }
  fetchModule() {
    this.setState(
      {
        loading: true,
      },
      (res) => {
        fetchAroundModule({}, (res) => {
          const { wanderAroundModule = {} } = res;
          const { wanderAroundModuleObjects = [] } = wanderAroundModule;
          this.setState(
            {
              wanderAroundModule: wanderAroundModuleObjects.map(
                (item) => item.moduleName
              ),
            },
            (res) => {
              this.filterRequest();
            }
          );
        }).catch((e) => {
          this.setState({
            requestStatus: false,
            loading: false,
          });
        });
      }
    );
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
        loading: false,
      });
    }).catch((e) => {
      this.setState({
        loading: false,
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
          if (rect) {
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
      loading,
      selfTourBanner = [],
      wanderAroundModule = [],
      selfTourResourceList = [],
      newDateList = [],
      beanCodeList = [],
      configNewcomerOrdersInfo: {
        taskStatus = "2",
        remainDay,
        orderNum,
        subsidyBean,
      },
      requestStatus,
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
      margin: `${Taro.pxTransform(32)} auto  ${Taro.pxTransform(24)}`,
      position: "relative",
    };
    const bottom = {
      bottom: Taro.pxTransform(-24),
      justifyContent: "flex-end",
    };
    const bannerContentStyle = {
      width: Taro.pxTransform(686),
      height: Taro.pxTransform(160),
      margin: `${Taro.pxTransform(40)} auto  0`,
      position: "relative",
    };
    const bottomContent = {
      bottom: Taro.pxTransform(-12),
      justifyContent: "center",
    };
    const selfContentStyle = {
      width: Taro.pxTransform(702),
      height: Taro.pxTransform(380),
      margin: `${Taro.pxTransform(40)} auto  0`,
      position: "relative",
    };
    const beanCodeStyle = {
      width: Taro.pxTransform(688),
      height: Taro.pxTransform(240),
      margin: `${Taro.pxTransform(24)} auto  0`,
      position: "relative",
    };
    let templateObj = {
      beanSpecialArea: (
        <Banner
          imgName="coverImg"
          data={[...beanCodeList]}
          bottom={bottomContent}
          boxStyle={beanCodeStyle}
          showNear
        ></Banner>
      ),
      mainBanner: (
        <Banner
          imgName="coverImg"
          data={[...specialHeadList]}
          bottom={bottom}
          boxStyle={bannerStyle}
          showNear
        ></Banner>
      ),
      capsulePosition: (
        <Banner
          imgName="coverImg"
          data={[...specialShopping]}
          bottom={bottomContent}
          boxStyle={bannerContentStyle}
          showNear
        ></Banner>
      ),
      recharge: (
        <Banner
          imgName="coverImg"
          data={[...selfTourBanner]}
          bottom={bottomContent}
          boxStyle={selfContentStyle}
          showNear
        ></Banner>
      ),
      resource: <Plate userInfo={configUserLevelInfo}></Plate>,
      notify: (taskStatus === "0" || taskStatus === "1") && (
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
      ),
      windVane: (
        <ConfigWind
          onChange={this.bubbleLink.bind(this)}
          list={configWindVaneList}
        ></ConfigWind>
      ),
      specialRecommend: (
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
      ),
      limitedTimeAndExplosive: (
        <SpecalPlate
          data={hotList}
          userInfo={configUserLevelInfo}
          list={dateList}
        ></SpecalPlate>
      ),
      explosive: (
        <HotOnly data={dateList} userInfo={configUserLevelInfo}></HotOnly>
      ),
      limitedTime: (
        <DateOnly data={hotList} userInfo={configUserLevelInfo}></DateOnly>
      ),
      selfTour: (
        <GameGoods
          userInfo={configUserLevelInfo}
          linkTo={this.saveRouter.bind(this)}
          data={selfTourResourceList}
        ></GameGoods>
      ),
      selfTourResource: (
        <SelfGoods
          userInfo={configUserLevelInfo}
          linkTo={this.saveRouter.bind(this)}
          data={selfTourResourceList}
        ></SelfGoods>
      ),
      newProductRecommend: (
        <SelfGoods
          userInfo={configUserLevelInfo}
          linkTo={this.saveRouter.bind(this)}
          data={newDateList}
          type={"date"}
        ></SelfGoods>
      ),
    };

    return (
      <View className="lookAround_box">
        <Navition city={cityName}></Navition>
        <Skeleton loading={loading}>
          <View className="lookAround_no_style">
            <View className="lookAround_goods_topHeight"></View>
            {!requestStatus ? (
              <Empty
                fn={this.onReload.bind(this)}
                show={!requestStatus}
                type={"error"}
                toast={"数据加载失败，请检查网络"}
              ></Empty>
            ) : (
              <React.Fragment>
                <View className="lookAround_content_margin">
                  {wanderAroundModule.map((item) => {
                    if (templateObj[item]) {
                      return templateObj[item];
                    }
                    return null;
                  })}
                </View>
              </React.Fragment>
            )}
          </View>
        </Skeleton>
        {/* {num === 0 && (
          <View className="wechant_init color6 font28">
            “添加到我的小程序”，更多优惠抢不停
          </View>
        )} */}
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
