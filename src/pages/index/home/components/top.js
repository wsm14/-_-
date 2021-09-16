import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import Router from "@/common/router";
import { scanCode } from "@/common/authority";
import "./../index.scss";
export default (props) => {
  const { onChange, data = "", session } = props;
  const [type, setType] = useState("commend");
  useEffect(() => {
    setType(data);
  }, [data]);
  const [select, setSelect] = useState([
    {
      label: "推荐",
      val: "commend",
    },
    {
      label: "捡豆",
      val: "pickUp",
    },
    {
      label: "附近",
      val: "near",
    },
  ]);
  const selectTamplate = () => {
    return (
      <View className="home_Select">
        {select.map((item) => {
          return (
            <View
              onClick={() => {
                if (setType !== type) {
                  onChange && onChange(item);
                }
              }}
              className={classNames(
                "home_select_right",
                type === item.val && "home_select_checked"
              )}
            >
              {item.label}
              {type === item.val && (
                <View className="hode_select_line  animated fadeIn"></View>
              )}
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <View className="home_top">
      <View className="home_right">
        <View
          className="home_right_up"
          onClick={() => {
            scanCode();
          }}
        ></View>
        <View
          className="home_right_search"
          onClick={() => {
            Router({
              routerName: "search_shop",
            });
          }}
        ></View>
      </View>
      {selectTamplate()}
      <View className="home_city">
        <View className="home_cityIcon"></View>
        <View className="home_cityName">杭州</View>
        <View className="home_citySelect"></View>
      </View>
    </View>
  );
};
