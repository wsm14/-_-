import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import FilterDropdown from "@/components/public_ui/filterDropdown";
import Search from "@/components/public_ui/searchView";
import {
  fetchCategory,
  fetchBusinessHub,
  fetchUserShareCommission,
} from "@/server/common";
import { fetchSpecialGoods, fetchListCouponByFilterType } from "@/server/index";
import Tags from "@/components/public_ui/goodsTagView";
import {
  template,
  couponTemplate,
} from "@/components/public_ui/specalTemplate";
import { computedViewHeight, setNavTitle } from "@/utils/utils";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        page: 1,
        limit: 10,
        distance: "",
        //距离筛选
        businessHubId: "",
        //商圈筛选
        categoryIds: "",
        //品类筛选
        keyword: "",
        //关键字筛选
        goodsTags: "",
        //商品标签筛选
      },
      //获取风向标内层品类页面列表
      selectList: [],
      //筛选条件
      configUserLevelInfo: {},
      //哒人身份
      list: [],
      //数据列表
      height: 0,
      categoryIds: getCurrentInstance().router.params.categoryIds,
      type: getCurrentInstance().router.params.type,
      name: getCurrentInstance().router.params.name,
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
  //哒人身份
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
            ],
          },
        ],
      });
    });
  }
  //获取筛选接口
  getshopList() {
    fetchSpecialGoods(this.state.httpData, (res) => {
      const { specialGoodsList = [] } = res;
      this.setState({
        list: [...this.state.list, ...specialGoodsList],
      });
    });
  }
  //请求商品列表数据
  fetchCoupons() {
    const { httpData } = this.state;
    fetchListCouponByFilterType(httpData, (res) => {
      const { couponList = [] } = res;
      this.setState({
        list: [...this.state.list, ...couponList],
      });
    });
  }
  //请求券列表数据
  fecthRequest() {
    const { type } = this.state;
    if (type === "good") {
      this.getshopList();
    } else {
      this.fetchCoupons();
    }
  }
  //判断外层传递参数查询商品详情还是券详情
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
  //筛选
  componentWillMount() {
    const { name, type } = this.state;
    setNavTitle(name + (type === "good" ? "·附近特惠" : "·附近优惠券"));
  }
  //判断外层标题
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
          defaultData={this.state.categoryIds}
          configUserLevelInfo={configUserLevelInfo}
          dataFormat="Object"
        ></FilterDropdown>
        {type === "good" ? (
          <Tags
            onChange={(val) => {
              this.changeSelect({ goodsTags: val });
            }}
            val={fatherId}
          ></Tags>
        ) : null}
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
      </View>
    );
  }
}

export default Index;
