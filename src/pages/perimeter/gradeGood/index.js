import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, ScrollView } from "@tarojs/components";
import FilterDropdown from "@/components/componentView/filterDropdown";
import Banner from "@/components/banner";
import {
  getCategory,
  getConfigWindVaneBySize,
  getBusinessHub,
  getBanner,
} from "@/server/common";
import { fetchUserShareCommission, fetchSpecialGoods } from "@/server/index";
import Tags from "@/components/componentView/goodsTagView";
import { template } from "@/components/specalTemplate";
import {
  toast,
  computedViewHeight,
  setNavTitle,
  computedClient,
  goBack,
  computedWinHeight,
  computedSize,
} from "@/common/utils";
import classNames from "classnames";
import Skeleton from "./components/SkeletonView";
import "./index.scss";
import Router from "@/common/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        page: 1,
        limit: 10,
        distance: "",
        businessHubId: "",
        categoryIds: "",
        keyword: "",
        goodsTags: "",
        specialFilterType: getCurrentInstance().router.params.type,
        sortRule: "distanceSort",
      },
      bannerType: {
        bannerType: getCurrentInstance().router.params.bannerType,
      },
      selectList: [],
      configUserLevelInfo: {},
      specialGoodsList: [],
      bannerList: [],
      height: 0,
      top: 0,
      body: getCurrentInstance().router.params.body,
      title: getCurrentInstance().router.params.title,
      size: 0,
      loading: false,
      topFlag: false,
      computedHight: computedWinHeight() - computedSize(44),
    };
  }
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  getBannerList() {
    const { bannerType } = this.state;
    this.setState(
      {
        loading: true,
      },
      (res) => {
        getBanner(bannerType, (res) => {
          const { bannerList } = res;
          this.setState({
            bannerList,
            loading: false,
          });
        }).catch(() => {
          this.setState({
            loading: false,
          });
        });
      }
    );
  }
  onPullDownRefresh() {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: { ...httpData, page: 1, limit: 10 },
        configUserLevelInfo: {},
        specialGoodsList: [],
      },
      (res) => {
        let time = setTimeout(() => {
          Taro.stopPullDownRefresh();
          clearTimeout(time);
        }, 500);
        this.fetchUserShare();
        this.getshopList();
      }
    );
  }
  initSelect() {
    Promise.all([
      getCategory({ parentId: "0" }, () => {}),
      getBusinessHub({}),
    ]).then((val = []) => {
      const { businessHubList = [] } = val[1];
      const { categoryList } = val[0];
      this.setState({
        selectList: [
          {
            name: "附近",
            type: "near",
            list: [
              {
                name: "附近",
                type: "near",
                list: [
                  { value: "", description: "附近" },
                  { value: "500", description: "500m" },
                  { value: "1000", description: "1km" },
                  { value: "2000", description: "2km" },
                  { value: "5000", description: "5km" },
                  { value: "10000", description: "10km" },
                  { value: "20000", description: "20km" },
                ],
              },
            ],
            hubList: businessHubList.map((item) => {
              const { businessHubList, districtCode } = item;
              return {
                ...item,
                businessHubList: [
                  {
                    districtCode,
                    businessHubName: "全部",
                    type: "all",
                  },
                  ...businessHubList,
                ],
              };
            }),
          },
          {
            name: "品类",
            type: "category",
            list: [
              {
                categoryIdString: "",
                categoryName: "全部",
                categoryDTOList: [],
                type: "father",
              },
              ...categoryList.map((item) => {
                const {
                  categoryName,
                  categoryIdString,
                  categoryDTOList = [],
                } = item;
                return {
                  ...item,
                  categoryDTOList: [
                    {
                      categoryDTOList: [],
                      fatherId: categoryIdString,
                      categoryName: "全部",
                      type: "all",
                    },
                    ...categoryDTOList,
                  ],
                };
              }),
            ],
          },
          {
            name: "筛选",
            type: "select",
            list: [
              { value: "distanceSort", description: "按距离排序" },
              { value: "priceSort", description: "按价格排序" },
              { value: "commissionSort", description: "按佣金排序" },
            ],
          },
        ],
      });
    });
  }
  getshopList() {
    fetchSpecialGoods(this.state.httpData, (res) => {
      const { specialGoodsList = [] } = res;
      this.setState({
        specialGoodsList: [...this.state.specialGoodsList, ...specialGoodsList],
      });
    });
  }
  changeSelect(val) {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: {
          ...httpData,
          ...val,
          page: 1,
        },
        specialGoodsList: [],
      },
      (res) => {
        this.getshopList();
      }
    );
  }
  componentDidMount() {
    this.initSelect();
    this.getshopList();
    this.getBannerList();
    this.computedSize();
  }
  componentDidShow() {
    this.fetchUserShare();
  }
  computedSize() {
    let width = Taro.getSystemInfoSync().windowWidth;
    let sizeScale = width / 375;
    this.setState({
      size: parseInt(sizeScale * 220),
    });
  }
  onPageScroll(res) {
    const { scrollTop } = res;
    console.log(scrollTop);
    this.setState({
      top: scrollTop,
    });
  }
  onReachBottom() {
    this.onPageUp();
  }
  onPageUp() {
    const { httpData } = this.state;
    this.setState(
      {
        httpData: {
          ...httpData,
          page: httpData.page + 1,
        },
      },
      (res) => {
        this.getshopList();
      }
    );
  } //上拉加载
  render() {
    const {
      selectList,
      specialGoodsList,
      configUserLevelInfo,
      height,
      bannerList,
      top,
      body,
      httpData: { categoryIds, goodsTags },
      title,
      size,
      loading,
      computedHight,
      topFlag,
    } = this.state;
    const bannerStyle = {
      width: "100%",
      height: Taro.pxTransform(440),
      margin: `${Taro.pxTransform(0)} auto  0`,
      position: "relative",
      zIndex: 280,
    };
    const bottom = {
      bottom: Taro.pxTransform(12),
      justifyContent: "center",
      zIndex: 285,
    };
    const templateView = () => {
      return (
        <View className="gradeGood_box">
          <View className="gradeGood_scroll">
            <View className="gradeGood_scroll_banner">
              <Banner
                imgName="coverImg"
                data={bannerList}
                bottom={bottom}
                boxStyle={bannerStyle}
                showNear
              ></Banner>
            </View>

            <View
              catchMove
              className={classNames(
                top >= size ? "gradeGood_tabbar_box1" : "gradeGood_tabbar_box"
              )}
              style={
                top >= size
                  ? {
                      paddingTop:
                        computedClient().top +
                        (computedClient().height - computedSize(24)) / 2,
                    }
                  : {
                      top:
                        computedClient().top +
                        (computedClient().height - computedSize(24)) / 2,
                    }
              }
            >
              <View
                onClick={() => goBack()}
                className={
                  top >= size
                    ? "gradeGood_tabbar_box_back1"
                    : "gradeGood_tabbar_box_back"
                }
              ></View>
              <View onClick={() => goBack()}> {title}</View>

              <View
                className={
                  top >= size
                    ? "gradeGood_tabbar_box_search1"
                    : "gradeGood_tabbar_box_search"
                }
                onClick={() =>
                  Router({
                    routerName: "search_shop",
                  })
                }
              ></View>
            </View>

            <View
              catchMove
              className={classNames(
                top >= size ? "gradeGood_view_box1" : "gradeGood_view_box"
              )}
              catchMove
            >
              <View className="gradeGood_view_body">{body}</View>
            </View>
            <FilterDropdown
              filterData={selectList}
              confirm={(e) => {
                this.changeSelect(e);
              }}
              top={size > top}
              setTop={{
                falgNav: true,
                topNav: size,
                setNav: computedSize(computedClient().top + 22),
              }}
              configUserLevelInfo={configUserLevelInfo}
              callback={(e) => {
                this.setState({}, (res) => {
                  e & e();
                });
              }}
              dataFormat="Object"
            ></FilterDropdown>
            <Tags
              onChange={(val) => {
                if (goodsTags !== val) {
                  this.changeSelect({ goodsTags: val });
                }
              }}
              val={categoryIds}
            ></Tags>
            <View className="scroll_margin"></View>
            <View
              style={{
                minHeight: computedHight + "px",
                position: "relative",
                top: top >= size ? computedSize(computedClient().top + 61) : 0,
              }}
              className="perimeterList_scroll1"
            >
              {specialGoodsList.length === 0 && (
                <>
                  <View className="perimeterList_nullStatus"></View>
                  <View className="perimeterList_text">暂无商品</View>
                </>
              )}
              {specialGoodsList.map((item) => {
                return template(item, configUserLevelInfo);
              })}
            </View>
          </View>
        </View>
      );
    };

    return (
      <Skeleton title={title} loading={loading}>
        {templateView()}
      </Skeleton>
    );
  }
}

export default Index;
