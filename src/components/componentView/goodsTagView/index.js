import React, { useState, useEffect, Fragment } from "react";
import Taro from "@tarojs/taro";
import { View, Text, ScrollView, Input } from "@tarojs/components";
import classNames from "classnames";
import { fetchGoodsTag } from "@/server/common";
import "./index.scss";

export default ({ confirm, onChange, val }) => {
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    if (val) {
      fetchGoodsTag({
        categoryId: val,
      }).then((res) => {
        const { configGoodsTagList = [] } = res;
        setList(configGoodsTagList);
        setData([]);
      });
    } else {
      setList([]);
      setData([]);
    }
  }, [val]);
  const setChangeData = (id) => {
    if (data.includes(id)) {
      let val = data.filter((item) => {
        return item !== id;
      });
      setData(val);
      return val;
    } else {
      let val = [...data, id];
      setData([...data, id]);
      return val;
    }
  };
  if (list.length > 0) {
    return (
      <View className="tag_view_box">
        <ScrollView scrollX className="tag_view_scroll">
          {list.map((item) => {
            const { configGoodsTagId, tagName } = item;
            return (
              <View
                onClick={() => {
                  onChange(setChangeData(configGoodsTagId).toString());
                }}
                className={classNames(
                  "tag_box",
                  data.includes(configGoodsTagId) ? "tag_color2" : "tag_color1"
                )}
              >
                {tagName}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  } else {
    return null;
  }
};
