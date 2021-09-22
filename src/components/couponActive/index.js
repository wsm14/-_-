import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { getListMayLikeCoupon } from "@/server/perimeter";
import { couponTemplate } from "../specalTemplate";
import { toast } from "@/common/utils";
import "./index.scss";
export default (props) => {
  const { title, current = false, userInfo, page, defaultData = null } = props;
  const [data, setData] = useState([]);
  const [httpData, setHttpData] = useState(null);
  const [count, countType] = useState(true);
  useEffect(() => {
    if (!defaultData) {
      if (current) {
        setHttpData({
          page: 1,
          limit: 10,
        });
      } else {
        setHttpData({
          page: 1,
          limit: 2,
        });
      }
    }
  }, []);
  useEffect(() => {
    if (count && httpData) {
      getLovely();
    }
  }, [httpData]);
  useEffect(() => {
    if (defaultData) {
      const { categoryId = "" } = defaultData;
      setData([]);
      setHttpData({
        page: 1,
        limit: 10,
        categoryIds: categoryId,
      });
    }
  }, [defaultData]);
  useReachBottom(() => {
    getDown();
  });
  const getLovely = () => {
    getListMayLikeCoupon(httpData, (res) => {
      const { couponList } = res;
      if (couponList && couponList.length > 0) {
        setData([...data, ...couponList]);
      } else {
        countType(false);
      }
    });
  };
  const getDown = () => {
    if (count && current) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
    }
  };
  if (data.length > 0) {
    return (
      <View className="specalActive_box">
        <View className="specalActive_title">为您推荐</View>
        <View className="specalActive_liner"></View>
        <View className="specalActive_goods">
          {data.map((item) => {
            return couponTemplate(item, userInfo);
          })}
        </View>
      </View>
    );
  }
  return null;
};
