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
import { fetchUserShareCommission, fetchSpecialGoods } from "@/server/index";
import Tags from "@/components/componentView/goodsTagView";
import { template } from "@/components/specalTemplate";
import { toast, computedViewHeight } from "@/common/utils";
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
      specialGoodsList: [],
      height: 0,
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
      const { categoryDTOList } = val[0];
      console.log(categoryDTOList);
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
      httpData: { categoryIds },
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
          {specialGoodsList.length === 0 && (
            <>
              <View className="perimeterList_nullStatus"></View>
              <View className="perimeterList_text">暂无商品</View>
            </>
          )}
          {specialGoodsList.map((item) => {
            return template(item, configUserLevelInfo);
          })}
        </ScrollView>
      </View>
    );
  }
}

export default Index;
