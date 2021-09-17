import React, { useEffect, useState } from "react";
import { Image, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import Waterfall from "@/components/waterfall";
import { fetchSearchGoods } from "@/server/perimeter";
import { selectShop } from "@/components/componentView/selectShop";
import Tags from "@/components/componentView/goodsTagView";
import {
  getCategory,
  getConfigWindVaneBySize,
  getBusinessHub,
} from "@/server/common";
import FilterDropdown from "@/components/componentView/filterDropdown";
import Router from "@/common/router";
const kolView = ({ keyword, current, configUserLevelInfo }) => {
  const [data, setData] = useState({
    page: 1,
    limit: 10,
  });
  const [fatherId, setFatherId] = useState("");
  const [list, setList] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const [countStatus, setCountStatus] = useState(true);
  const { categoryIds, goodsTags } = data;
  useEffect(() => {
    setData({
      ...data,
      page: 1,
      limit: 10,
      keyword: keyword,
    });
    setList([]);
  }, [keyword]);
  useEffect(() => {
    getSearchGoods();
  }, [data]);
  useEffect(() => {
    initSelect();
  }, []);
  const getSearchGoods = () => {
    const { keyword } = data;
    if (keyword) {
      fetchSearchGoods(data, (res) => {
        const { specialGoodsList } = res;
        if (specialGoodsList && specialGoodsList.length > 0) {
          setList([...list, ...specialGoodsList]);
        } else {
          setCountStatus(false);
        }
      });
    }
  };
  const initSelect = () => {
    Promise.all([
      getCategory({ parentId: "0" }, () => {}),
      getBusinessHub({}),
    ]).then((val = []) => {
      const { businessHubList = [] } = val[1];
      const { categoryList } = val[0];
      setSelectList([
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
      ]);
    });
  };
  const createView = (item) => {
    return selectShop(item, configUserLevelInfo, (activityId, merchantId) =>
      Router({
        routerName: "favourableDetails",
        args: {
          specialActivityId: activityId,
          merchantId: merchantId,
        },
      })
    );
  };
  useReachBottom(() => {
    if (countStatus && current == 0) {
      setData({
        ...data,
        page: data.page + 1,
      });
    }
  });
  return (
    <View style={current == 0 ? { display: "block" } : { display: "none" }}>
      <View className="flex_auto_select">
        <FilterDropdown
          filterData={selectList}
          confirm={(e) => {
            const { fatherIds } = e;
            setFatherId(fatherIds);
            setData(() => {
              setList([]);
              return {
                ...data,
                ...e,
                goodsTags: "",
                page: 1,
              };
            });
          }}
          configUserLevelInfo={configUserLevelInfo}
          dataFormat="Object"
        ></FilterDropdown>
        <Tags
          onChange={(val) => {
            setData(() => {
              setList([]);
              return {
                ...data,
                page: 1,
                goodsTags: val,
              };
            });
          }}
          val={fatherId}
        ></Tags>
      </View>
      <View className="flex_auto_fav">
        {list.length > 0 ? (
          <View className="search_shopPubu">
            {
              <Waterfall
                list={list}
                noMargin={{ margin: 0 }}
                createDom={createView}
                style={{ width: Taro.pxTransform(335) }}
              ></Waterfall>
            }
          </View>
        ) : (
          <View className="search_shopNO">
            <View className="search_shopImg"></View>
            <View className="search_shopImgfont color2 font28">
              暂无找到想要的结果，换个关键词试试吧
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
export default kolView;
