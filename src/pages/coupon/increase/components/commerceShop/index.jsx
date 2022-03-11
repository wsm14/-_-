/*券的为你推荐*/
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { commerGoodsTemplate } from "@/components/public_ui/specalTemplate";
import {
  fetchCouponAvailableSpecial,
  fetchAvailableOwnerCoupon,
  fetchCouponAvailableCommerce,
} from "@/server/coupon";
import "./index.scss";
export default (props) => {
  const { data } = props;
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]);

  useReachBottom(() => {
    getDown();
  });
  const getData = () => {
    fetchCouponAvailableCommerce({
      ...httpData,
      ...data,
    }).then((val) => {
      const { commerceGoodsList = [] } = val;
      setList([...list, ...commerceGoodsList]);
    });
  };
  useEffect(() => {
    getData();
  }, [httpData.page]);

  const getDown = () => {
    setHttpData({
      ...httpData,
      page: httpData.page + 1,
    });
  };
  if (list.length > 0) {
    return (
      <View className="commerceShop_box">
        <View className="commerceShop_content">
          {list.map((item) => {
            return commerGoodsTemplate(item);
          })}
        </View>
      </View>
    );
  }
  return null;
};
