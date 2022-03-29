import React, { useState, useMemo, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import SelectSpecal from "./../selectSpecal";
import classNames from "classnames";
import Router from "@/utils/router";
export default ({
  list = [],
  flagDom,
  data,
  specialFilterType,
  saveRouter,
  categoryList,
  templateSelect,
  tabGoods,
  categoryIds,
}) => {
  const [listObj, setListObj] = useState({});
  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "specialRecommend") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);
  const memo = useMemo(() => {
    return (
      <View>
        <View className="lookAround_selectSpecal_Fliner"></View>
        <View
          style={!flagDom ? { display: "none" } : {}}
          className="lookAround_category_fixed"
        ></View>
        <View className="lookAround_categorys_box lookAround_categorys_box1">
          <View
            className="lookAround_categorys_orderBtn"
            onClick={() =>
              Router({
                routerName: "goodList",
              })
            }
          ></View>
          <ScrollView
            scrollWithAnimation={true}
            scrollX
            className="lookAround_categorys_parent"
          >
            {templateSelect && templateSelect()}
            {categoryList.map((item) => {
              const { categoryName, subtitle, categoryIdString } = item;
              return (
                <View
                  onClick={() => tabGoods && tabGoods(item)}
                  className={classNames(
                    "lookAround_categorys",
                    categoryIds === categoryIdString
                      ? "lookAround_categorys_true bold"
                      : "lookAround_categorys_flag"
                  )}
                >
                  <View className="lookAround_topText">{categoryName}</View>
                  <View
                    className={classNames(
                      "lookAround_categorys_iconText",
                      categoryIds === categoryIdString
                        ? "lookAround_iconText_color1"
                        : "lookAround_iconText_color2"
                    )}
                  >
                    {categoryIds === categoryIdString && (
                      <View className="lookAround_categorys_icon"></View>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <SelectSpecal
          data={list}
          listObj={listObj}
          linkTo={saveRouter}
          type={specialFilterType}
        ></SelectSpecal>
      </View>
    );
  }, [list, flagDom, specialFilterType, categoryList, categoryIds, listObj]);
  return memo;
};
