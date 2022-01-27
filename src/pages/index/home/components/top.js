import React, { useEffect, useState, useMemo } from "react";
import { View, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import Router from "@/utils/router";
import { fetchTabTag } from "@/server/common";
import { scanCode } from "@/common/authority";
import "./../index.scss";
export default (props) => {
  const { onChange, data = "", session, store } = props;
  const [type, setType] = useState(null);
  const [select, setSelect] = useState([
    {
      label: "发现",
      val: "pickUp",
    },
  ]);
  useEffect(() => {
    setType(data);
  }, [data]);
  useEffect(() => {
    if (store) {
      fetchTabTag().then((val) => {
        const { configMomentTagList = [] } = val;
        if (configMomentTagList.length > 0) {
          setSelect(
            configMomentTagList.map((val) => {
              const { name, type, configMomentTagId } = val;
              if (type === "pickUp") {
                return {
                  label: "发现",
                  val: type,
                  configMomentTagId,
                };
              }
              return {
                label: name,
                val: type,
                configMomentTagId,
              };
            })
          );
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
                    "home_select_right",
                    type
                      ? type === item.configMomentTagId && "home_select_checked"
                      : item.val === "pickUp" && "home_select_checked"
                  )}
                >
                  {item.label}
                  {((!type && item.val === "pickUp") ||
                    type === item.configMomentTagId) && (
                    <View className="hode_select_line  animated fadeIn"></View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    ),
    [type, select]
  );
};
