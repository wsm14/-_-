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
  computedWinHeight,
  setNavTitle,
  computedSize,
} from "@/common/utils";
import Skeleton from "./components/SkeletonView";
import "./index.scss";
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
        bannerType:
          getCurrentInstance().router.params.bannerType ||
          getCurrentInstance().router.params.type,
      },
      selectList: [],
      configUserLevelInfo: {},
      specialGoodsList: [],
      bannerList: [],
      size: computedSize(220),
      height: computedWinHeight() - computedSize(44),
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
        }).catch((e) => {
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
        console.log();
        this.getshopList();
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
  componentDidMount() {
    this.initSelect();
    this.getshopList();
    this.getBannerList();
    setNavTitle(getCurrentInstance().router.params.title);
  }
  componentDidShow() {
    this.fetchUserShare();
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
      topFlag,
      size,
      loading,
      httpData: { categoryIds, goodsTags },
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
    console.log(computedWinHeight());
    const templateView = () => {
      return (
        <View className="publicTypeGoods_box">
          <View className="publicTypeGoods_scroll">
            {bannerList.length ? (
              <View className="publicTypeGoods_bannerBox">
                <Banner
                  imgName="coverImg"
                  data={bannerList}
                  bottom={bottom}
                  boxStyle={bannerStyle}
                  showNear
                ></Banner>
              </View>
            ) : null}

            <View className="publicTypeGoods_view_box">
              <View className="publicTypeGoods_view_nodeBox">
                <FilterDropdown
                  filterData={selectList}
                  confirm={(e) => {
                    this.changeSelect(e);
                  }}
                  top={true}
                  configUserLevelInfo={configUserLevelInfo}
                  dataFormat="Object"
                  setTop={{
                    falgNav: true,
                    topNav: bannerList.length ? size : 0,
                    setNav: 0,
                  }}
                ></FilterDropdown>
              </View>

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
                style={{ minHeight: height + "px" }}
                className="perimeterList_scroll1"
              >
                {specialGoodsList.length === 0 && (
                  <>
                    <View className="perimeterList_nullStatus"></View>
                    <View className="perimeterList_text">暂无商品</View>
                  </>
                )}
                {specialGoodsList.map((item) => {
                  return template(item, configUserLevelInfo, false);
                })}
                <View className="perimeterList_liner"></View>
              </View>
            </View>
          </View>
        </View>
      );
    };
    return <Skeleton loading={loading}>{templateView()}</Skeleton>;
  }
}

export default Index;
