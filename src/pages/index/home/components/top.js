import React, { useEffect, useState, useMemo } from "react";
import { View, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import Router from "@/utils/router";
import { fetchTabTag } from "@/server/common";
import { scanCode } from "@/common/authority";
import "./../index.scss";
import { fetchStorage } from "@/utils/utils";
export default (props) => {
  const { onChange, data = {}, session, store } = props;
  const { cityName } = fetchStorage("relCity");
  const [select, setSelect] = useState([
    {
      label: "同城",
      val: "sameCity",
    },
    {
      label: "捡豆",
      val: "pickUp",
    },
    {
      label: "哒人秀",
      val: "daRenShow",
    },
  ]);
  const { browseType, momentTags } = data;
  useEffect(() => {
    if (store) {
      fetchTabTag().then((val) => {
        const { configMomentTagList = [] } = val;
        if (configMomentTagList.length > 0) {
          setSelect([
            {
              label: cityName ? cityName : "同城",
              val: "sameCity",
            },
            {
              label: "捡豆",
              val: "pickUp",
            },
            {
              label: "哒人秀",
              val: "daRenShow",
            },
            ...configMomentTagList.map((val) => {
              const { name, type, configMomentTagId } = val;
              return {
                label: name,
                val: type,
                configMomentTagId,
              };
            }),
          ]);
        }
      });
    }
  }, [store]);
  return useMemo(
    () => (
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
        <ScrollView scrollX className="home_Select_scroll font_hide">
          <View className="home_Select">
            {select.map((item, index) => {
              return (
                <View
                  onClick={() => {
                    onChange && onChange(item);
                  }}
                  className={classNames(
                    "home_select_right font_hide",
                    item.configMomentTagId
                      ? momentTags === item.configMomentTagId
                      : data.browseType === item.val && "home_select_checked"
                  )}
                >
                  {item.label}
                  {(item.configMomentTagId
                    ? momentTags === item.configMomentTagId
                    : data.browseType === item.val) && (
                    <View className="hode_select_line  animated fadeIn"></View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    ),
    [browseType, select, momentTags]
  );
};
