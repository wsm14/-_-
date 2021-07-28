import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { goodsView } from "@/components/componentView/active/activeView";
import "./index.scss";
export default ({
  list = [],
  userInfo = {},
  onChange,
  cityCode,
  type = "toast",
}) => {
  useEffect(() => {
    setPageDown({
      page: 1,
      limit: 4,
    });
  }, [cityCode]);
  const [pageDown, setPageDown] = useState({ page: 1, limit: 4 });
  const { page, limit } = pageDown;
  const filterBtn = () => {
    if (list.length > page * limit) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <View className="payScice_box">
      <View className="payScice_title"></View>
      <View className="payScice_shop_good"></View>
      <View className="payScice_goods_box">
        {list.map((item, index) => {
          if (index < page * limit)
            return goodsView(item, userInfo, onChange, type);
          else {
            return null;
          }
        })}
      </View>
      {filterBtn() && (
        <View
          className="payScice_goods_btn"
          onClick={() =>
            setPageDown({
              ...pageDown,
              page: page + 1,
            })
          }
        >
          加载更多
        </View>
      )}
      <View className="payScice_shop_logo"></View>
    </View>
  );
};
