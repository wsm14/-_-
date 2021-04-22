import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { couponLovely } from "@/components/componentView/CouponView";
import { getListMayLikeCoupon } from "@/server/perimeter";
import { toast } from "@/common/utils";
import "./index.scss";
export default (props) => {
  const { title } = props;
  const [data, setData] = useState([]);
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
  });
  const [count, countType] = useState(true);
  useEffect(() => {
    if (count) {
      getLovely();
    } else {
      toast("暂无数据");
    }
  }, [httpData]);
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
    if (count) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
    } else return toast("暂无数据");
  };
  if (data.length > 0) {
    return (
      <View className="lovely_box">
        <View className="color1 font28 lovely_title">
          - {title || "你可能还喜欢"} -
        </View>
        <View className="love_shop">
          {data.map((item) => {
            return couponLovely(item);
          })}
        </View>
      </View>
    );
  }
  return null;
};
