import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import FilterDropdown from "@/components/componentView/filterDropdown";
import {
  getCategory,
  getConfigWindVaneBySize,
  getBusinessHub,
} from "@/server/common";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        merchantId: getCurrentInstance().router.params.merchantId,
        page: 1,
        limit: 10,
      },
      selectList: [],
    };
  }
  initSelect() {
    Promise.all([
      getCategory({ parentId: "0" }, () => {}),
      getConfigWindVaneBySize({ size: 10 }, () => {}),
      getBusinessHub({}),
    ])
      .then((val = []) => {
        const { businessHubList = [] } = val[2];
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
                  const { categoryName, categoryIdString, childList } = item;
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
                { value: "markFlag", description: "按距离排序" },
                { value: "special", description: "按价格排序" },
                { value: "reduce", description: "按佣金排序" },
              ],
            },
          ],
        });
      })
      .catch((val) => {
        toast("获取品类失败");
      });
  }
  componentDidMount() {
    this.initSelect();
  }
  onReachBottom() {
    const { httpData, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: {
            ...httpData,
            page: httpData.page + 1,
          },
        },
        (res) => {
          this.getUserCoupon();
        }
      );
    } else {
      return toast("暂无数据");
    }
  } //上拉加载
  render() {
    const { selectList } = this.state;
    return (
      <View className="evenGoods_box">
        <FilterDropdown
          filterData={selectList}
          confirm={(e) => {
            console.log(e);
          }}
          dataFormat="Object"
        ></FilterDropdown>
      </View>
    );
  }
}

export default Index;
