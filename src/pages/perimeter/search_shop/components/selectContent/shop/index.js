import React, { useEffect, useState } from "react";
import { Image, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import Waterfall from "@/components/waterfall";
import { fetchSearchGoods } from "@/server/perimeter";
import { selectShop } from "@/components/componentView/selectShop";
import { backgroundObj } from "@/common/utils";
import Router from "@/common/router";
import "./../../../index.scss";
const kolView = ({ keyword, current, configUserLevelInfo }) => {
  const [data, setData] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]);
  const [countStatus, setCountStatus] = useState(true);
  useEffect(() => {
    setData({
      page: 1,
      limit: 10,
      keyword: keyword,
    });
    setList([]);
  }, [keyword]);
  useEffect(() => {
    getSearchGoods();
  }, [data]);
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
      <View className="flex_auto">
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
