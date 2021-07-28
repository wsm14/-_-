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
    <View className="friendScice_box">
      <View className="friendScice_title"></View>
      <View className="friendScice_shop_good"></View>
      <View className="friendScice_goods_box">
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
          className="friendScice_goods_btn"
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
    </View>
  );
};
