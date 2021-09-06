import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View, Canvas } from "@tarojs/components";
import classNames from "classnames";
import { setPeople, navigateTo, backgroundObj } from "@/common/utils";
import Router from "@/common/router";
import "./../../index.scss";
export default ({ data, userInfo, time = 0, show, initBean }) => {
  const { watchStatus, length } = data;
  const { shareCommission = 0 } = userInfo;
  return (
    <View className="video_stem_layer">
      {initBean && (
        <View
          onClick={() => {}}
          className={classNames(
            "bean_animate",
            watchStatus === "1" ? "bean_animate_bg2" : "bean_animate_bg1"
          )}
        >
          <View
            className={classNames(
              watchStatus === "1" ? "bean_animate_padding" : "bean_animate_time"
            )}
          >
            {watchStatus === "1"
              ? "已领"
              : show
              ? parseInt(length) - time
              : parseInt(length)}
          </View>
        </View>
      )}
    </View>
  );
};
