import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, ScrollView } from "@tarojs/components";
import FilterDropdown from "@/components/public_ui/filterDropdown";
import Search from "@/components/public_ui/searchView";
import {
  fetchCategory,
  fetchBusinessHub,
  fetchUserShareCommission,
} from "@/server/common";
import { fetchSpecialGoods } from "@/server/index";
import Tags from "@/components/public_ui/goodsTagView";
import { template } from "@/components/public_ui/specalTemplate";
import { computedViewHeight } from "@/utils/utils";
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
      fatherId: "",
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
      fetchCategory({ parentId: "0" }, () => {}),
      fetchBusinessHub({}),
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
              ...categoryList,
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
      fatherId,
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
            this.setState({ fatherId: e.fatherIds });
            this.changeSelect(e);
          }}
          configUserLevelInfo={configUserLevelInfo}
          dataFormat="Object"
        ></FilterDropdown>
        <Tags
          onChange={(val) => {
            this.changeSelect({ goodsTags: val });
          }}
          val={fatherId}
        ></Tags>
        <View className="scroll_margin"></View>
        <View className="scroll_padding_info">
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
      </View>
    );
  }
}

export default Index;
