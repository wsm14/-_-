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
} from "@/common/utils";
import classNames from "classnames";
import Skeleton from "./components/SkeletonView";
("");
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
      },
      bannerType: {
        bannerType: getCurrentInstance().router.params.type,
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
  initSelect() {
    Promise.all([
      getCategory({ parentId: "0" }, () => {}),
      getBusinessHub({}),
    ]).then((val = []) => {
      const { businessHubList = [] } = val[1];
      const { categoryDTOList } = val[0];

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
                childList: [],
                type: "father",
              },
              ...categoryDTOList.map((item) => {
                const { categoryName, categoryIdString, childList = [] } = item;
                return {
                  ...item,
                  childList: [
                    {
                      childList: [],
                      fatherId: categoryIdString,
                      categoryName: "全部",
                      type: "all",
                    },
                    ...childList,
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
    const { top } = this.state;
    this.setState({
      top: scrollTop,
    });
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
      httpData: { categoryIds },
      title,
      size,
      loading,
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
    console.log(loading);
    const templateView = () => {
      return (
        <View className="gradeGood_box">
          <View className="gradeGood_scroll">
            <Banner
              imgName="coverImg"
              data={bannerList}
              bottom={bottom}
              boxStyle={bannerStyle}
              showNear
            ></Banner>
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
                        (computedClient().height - 24) / 2,
                    }
                  : {
                      top:
                        computedClient().top +
                        (computedClient().height - 24) / 2,
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
              configUserLevelInfo={configUserLevelInfo}
              dataFormat="Object"
            ></FilterDropdown>
            <Tags
              onChange={(val) => {
                this.changeSelect({ goodsTags: val });
              }}
              val={categoryIds}
            ></Tags>
            <View className="scroll_margin"></View>
            <ScrollView
              scrollY
              onScrollToLower={(e) => {
                this.onPageUp();
              }}
              onScroll={(e) => {
                const { scrollTop } = e.detail;
                console.log(
                  scrollTop < size && top < size,
                  scrollTop,
                  top,
                  size
                );
                if (scrollTop < size && top < size) {
                  Taro.pageScrollTo({
                    selector: ".perimeterList_scroll1",
                    top: scrollTop,
                    success: (res) => {
                      this.setState({
                        top: scrollTop,
                      });
                    },
                  });
                }
              }}
              style={{
                height: height
                  ? height
                  : computedViewHeight(".perimeterList_scroll1", (e) => {
                      this.setState({ height: e });
                    }),
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
              {specialGoodsList.map((item) => {
                return template(item, configUserLevelInfo);
              })}
            </ScrollView>
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
