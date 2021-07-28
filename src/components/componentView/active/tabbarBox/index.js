import React, { useState, useEffect, useMemo } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import classNames from "classnames";
import Router from "@/common/router";
import "./index.scss";
export default ({ store }) => {
  const { activityStatus, needCountDown, dayCount } = store;
  const memo = useMemo(() => {
    if (activityStatus === "1") {
      return (
        <View
          onClick={() => {
            Router({
              routerName: "mainScene",
            });
          }}
          className={classNames(
            "active_hish_box",
            needCountDown === "1" ? "active_hish_countInfo" : "active_hish_info"
          )}
        >
          {needCountDown === "1" ? (
            <View className="active_hish_cont">倒计时{dayCount}天</View>
          ) : null}
        </View>
      );
    } else return null;
  }, [activityStatus, needCountDown, dayCount]);
  return memo;
};
