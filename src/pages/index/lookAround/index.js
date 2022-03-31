import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Banner from "@/components/banner";
import { toast, getLat, getLnt } from "@/utils/utils";
import { resiApiKey } from "@/common/constant";
import {
  fetchBanner,
  fetchConfigWindVaneBySizeNew,
  getSpecialGoodsCategory,
  fetchAroundModule,
  fetchUserShareCommission,
} from "@/server/common";
import { getRestapiAddress } from "@/server/other";
import classNames from "classnames";
import {
  fetchSpecialGoods,
  fetchSelfTourGoods,
  getConfigNewcomerOrders,
} from "@/server/index";
import Router from "@/utils/router";
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
import NewUser from "@/components/public_ui/newUserToast";
import Education from "./components/beanEducation";
import SpecalSelf from "./components/specialSelf";
import GlobalDrawer from "@/components/GlobalDrawer";
import Sign from "./components/sign";
import HotExchange from "./components/hotExchange";
import SixPalaceLattice from "./components/sudoku";
import HotMetal from "./components/hotMetal";
import Rebate from "./components/rebate";
import FieldResource from "./components/fieldResource";
import { fetchBeanAndEarn } from "@/server/index";
import { inject, observer } from "mobx-react";
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
      topBeanData: {
        bean: 0,
        todayTotalIncome: 0,
      },
    };
  }
  getBeanInfo() {
    fetchBeanAndEarn().then((val) => {
      this.setState({
        topBeanData: {
          bean: 0,
          todayTotalIncome: 0,
          ...val,
        },
      });
    });
  }
  topBanner() {
    fetchBanner({ bannerType: "wanderAroundMainBanner" }).then((res) => {
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
  //周边游模块
  contentBanner() {
    fetchBanner({ bannerType: "wanderAroundCapsule" }).then((res) => {
      const { bannerList = [] } = res;
      this.setState({
        specialShopping: bannerList,
      });
    });
  }
  selfTourBanner() {
    fetchBanner({ bannerType: "wanderAroundRecharge" }).then((res) => {
      const { bannerList = [] } = res;
      this.setState({
        selfTourBanner: bannerList,
      });
    });
  }
  beanCodeBanner() {
    fetchBanner({ bannerType: "wanderAroundBean" }).then((res) => {
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
    wanderAroundModule
      .map((item) => {
        return item.moduleName;
      })
      .forEach((val) => {
        requestObj[val] && requestObj[val]();
      });
    this.fetchUserShare();
  }
  //根据后端配置 请求接口
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
        this.getBeanInfo();
        this.fetchModule();
      }
    );
  }
  //下拉刷新
  onPullDownRefresh() {
    this.onReload();
  }
  componentDidMount() {
    this.setMap();
    this.fetchModule();
    this.getBeanInfo();
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
        fetchAroundModule({})
          .then((res) => {
            const { wanderAroundModule = {} } = res;
            const { wanderAroundModuleObjects = [] } = wanderAroundModule;
            this.setState(
              {
                wanderAroundModule: wanderAroundModuleObjects,
                loading: false,
              },
              (res) => {
                this.filterRequest();
              }
            );
          })
          .catch((e) => {
            this.setState({
              requestStatus: false,
              loading: false,
            });
          });
      }
    );
  }
  //获取后端逛逛显示配置项
  fetchgNewcomerOrders() {
    getConfigNewcomerOrders({}).then((res) => {
      const { configNewcomerOrdersInfo = {} } = res;
      this.setState({
        configNewcomerOrdersInfo,
      });
    });
  }
  //获取是否有三单福利
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
  //获取当前定位
  getshopList(data, key = "kolGoodsList") {
    fetchSpecialGoods(data).then((res) => {
      const { specialGoodsList = [] } = res;
      this.setState({
        [key]: [...this.state[key], ...specialGoodsList],
      });
    });
  }

  getConfigWindVaneBySize() {
    fetchConfigWindVaneBySizeNew({}).then((res) => {
      const { configWindVaneList } = res;
      this.setState({
        configWindVaneList,
      });
    });
  }
  //获取风向标配置
  fetchUserShare() {
    fetchUserShareCommission({})
      .then((res) => {
        const { configUserLevelInfo = {} } = res;
        this.setState({
          configUserLevelInfo,
        });
      })
      .catch((e) => {
        this.setState({});
      });
  }
  //获取达人身份
  getSpecialGoodsCategory() {
    getSpecialGoodsCategory({}).then((res) => {
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
    let {
      param = "",
      jumpUrlNew,
      jumpUrlType = "",
      jumpUrl = "",
      identification,
      payBeanCommission,
      resourceTemplateContentId,
    } = item;
    param = (param && JSON.parse(param)) || {};
    jumpUrlNew = (jumpUrlNew && JSON.parse(jumpUrlNew)) || {};
    const { weChatUrl = "" } = jumpUrlNew;
    if (jumpUrlType === "template") {
      Router({
        routerName: "wanderAround",
        args: {
          ...param,
          resourceTemplateContentId,
          payBeanCommission,
          identification,
        },
      });
    } else if (jumpUrlType === "native" && weChatUrl) {
      Router({
        routerName: weChatUrl,
        args: {
          payBeanCommission,
          identification,
          categoryId: param.categoryId || param.topCategoryId,
          ...param,
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
  //风向标跳转函数
  onPageScroll(e) {
    const { flagDom } = this.state;
    if (!flagDom) {
      Taro.createSelectorQuery()
        .select(".lookAround_categorys_box1")
        .boundingClientRect((rect) => {
          if (rect) {
            const { top } = rect;
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
  //移动指定位置 特惠筛选置顶函数
  onReachBottom() {
    const { specialHttp } = this.state;
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
  //点击函数跳转商品详情页
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
      topBeanData,
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
    //筛选特惠样式
    const bannerStyle = {
      width: Taro.pxTransform(686),
      height: Taro.pxTransform(200),
      margin: `${Taro.pxTransform(32)} auto  ${Taro.pxTransform(24)}`,
      position: "relative",
    };
    //主轮播图
    const bottom = {
      bottom: Taro.pxTransform(-24),
      justifyContent: "flex-end",
    };
    //切换点
    const bannerContentStyle = {
      width: Taro.pxTransform(686),
      height: Taro.pxTransform(160),
      margin: `${Taro.pxTransform(40)} auto  0`,
      position: "relative",
    };
    //逛逛胶囊轮播样式
    const bottomContent = {
      bottom: Taro.pxTransform(-12),
      justifyContent: "center",
    };
    //逛逛胶囊底部点
    const selfContentStyle = {
      width: Taro.pxTransform(702),
      height: Taro.pxTransform(380),
      margin: `${Taro.pxTransform(40)} auto  0`,
      position: "relative",
    };
    //周边游玩轮播样式
    const beanCodeStyle = {
      width: Taro.pxTransform(688),
      height: Taro.pxTransform(240),
      margin: `${Taro.pxTransform(24)} auto  0`,
      position: "relative",
    };
    //卡豆专区轮播样式
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
      resource: <Plate></Plate>,
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
          data={wanderAroundModule}
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
          data={wanderAroundModule}
        
          linkTo={this.saveRouter.bind(this)}
          list={selfTourResourceList}
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
      beanEducation: <Education></Education>,
      specialAndSelfTourAndCommerce: (
        <SpecalSelf type="specalSelf" data={wanderAroundModule}></SpecalSelf>
      ),
      selfTourAndCommerce: (
        <SpecalSelf type="commerceSelf" data={wanderAroundModule}></SpecalSelf>
      ),
      sixPalaceLattice: (
        <SixPalaceLattice
          onChange={this.bubbleLink.bind(this)}
          data={wanderAroundModule}
        ></SixPalaceLattice>
      ),
      //六宫格
      signInModule: (
        <Sign
          link={this.bubbleLink.bind(this)}
          data={wanderAroundModule}
        ></Sign>
      ),
      //签到
      limitedTimeHotMixing: (
        <HotExchange data={wanderAroundModule}></HotExchange>
        //现实热销
      ),
      timeLimitedCoupon: <HotMetal data={wanderAroundModule}></HotMetal>,
      beanDeductionZone: <Rebate data={wanderAroundModule}></Rebate>,
      fieldResource: <FieldResource data={wanderAroundModule}></FieldResource>,
    };
    //根据后端 显示函数 映射对应渲染模板
    return (
      <View className="lookAround_box">
        <Navition val={topBeanData} city={cityName}></Navition>
        <NewUser></NewUser>
        <Skeleton loading={loading}>
          <View className="lookAround_no_style">
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
                  {wanderAroundModule.map((item, index) => {
                    if (templateObj[item["moduleName"]]) {
                      if (index === wanderAroundModule.length - 2) {
                        return (
                          <View style={{ marginBottom: Taro.pxTransform(24) }}>
                            {templateObj[item["moduleName"]]}
                          </View>
                        );
                      }
                      return templateObj[item["moduleName"]];
                    }
                    return null;
                  })}
                </View>
              </React.Fragment>
            )}
          </View>
          <GlobalDrawer pageName="wanderAround"></GlobalDrawer>
        </Skeleton>
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
