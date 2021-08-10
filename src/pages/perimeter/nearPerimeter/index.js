import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, ScrollView } from "@tarojs/components";
import FilterDropdown from "@/components/componentView/filterDropdown";
import Search from "@/components/componentView/SearchView";
import {
  getCategory,
  getConfigWindVaneBySize,
  getBusinessHub,
} from "@/server/common";
import {
  fetchUserShareCommission,
  fetchSpecialGoods,
  fetchListCouponByFilterType,
} from "@/server/index";
import Tags from "@/components/componentView/goodsTagView";
import { template, couponTemplate } from "@/components/specalTemplate";
import { toast, computedViewHeight, setNavTitle } from "@/common/utils";
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
      },
      selectList: [],
      configUserLevelInfo: {},
      list: [],
      height: 0,
      categoryIds: getCurrentInstance().router.params.categoryIds,
      type: getCurrentInstance().router.params.type,
      name: getCurrentInstance().router.params.name,
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
              {
                value: "distanceSort",
                description: "按距离排序",
                name: "距离",
              },
              { value: "priceSort", description: "按价格排序", name: "价格" },
              {
                value: "commissionSort",
                description: "按佣金排序",
                name: "佣金",
              },
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
        list: [...this.state.list, ...specialGoodsList],
      });
    });
  }
  fetchCoupons() {
    const { httpData } = this.state;
    fetchListCouponByFilterType(httpData, (res) => {
      const { couponList = [] } = res;
      this.setState({
        list: [...this.state.list, ...couponList],
      });
    });
  }
  fecthRequest() {
    const { type } = this.state;
    if (type === "good") {
      this.getshopList();
    } else {
      this.fetchCoupons();
    }
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
        list: [],
      },
      (res) => {
        this.fecthRequest();
      }
    );
  }
  componentWillMount() {
    const { name, type } = this.state;
    setNavTitle(name + (type === "good" ? "·附近特惠" : "·附近优惠券"));
  }
  componentDidMount() {
    const { categoryIds, httpData } = this.state;
    this.initSelect();
    this.setState(
      {
        httpData: {
          ...httpData,
          categoryIds,
        },
      },
      (res) => {
        this.fecthRequest();
      }
    );
  }
  componentDidShow() {
    this.fetchUserShare();
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
        this.fecthRequest();
      }
    );
  } //上拉加载
  render() {
    const {
      selectList,
      list,
      configUserLevelInfo,
      height,
      httpData: { categoryIds },
      name,
      type,
    } = this.state;

    return (
      <View className="perimeterList_box">
        <Search
          type={"link"}
          confirm={(e) => {
            this.changeSelect({ keyword: e });
          }}
        ></Search>
        <FilterDropdown
          filterData={selectList}
          confirm={(e) => {
            this.changeSelect(e);
          }}
          defaultData={this.state.categoryIds}
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
          style={{
            height: height
              ? height
              : computedViewHeight(".perimeterList_scroll", (e) => {
                  this.setState({ height: e });
                }),
          }}
          className="perimeterList_scroll"
        >
          {list.length === 0 && (
            <>
              <View className="perimeterList_nullStatus"></View>
              <View className="perimeterList_text">
                暂无{type === "good" ? "商品" : "优惠券"}
              </View>
            </>
          )}
          {list.map((item) => {
            const { type } = this.state;
            if (type === "good") {
              return template(item, configUserLevelInfo);
            } else {
              return couponTemplate(item, configUserLevelInfo);
            }
          })}
        </ScrollView>
      </View>
    );
  }
}

export default Index;