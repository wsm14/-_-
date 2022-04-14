import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { backgroundObj } from "@/utils/utils";
import { computedClient } from "@/utils/utils";
import "./index.scss";
import Router from "@/utils/router";
//逛逛顶部导航栏
export default (props) => {
  const { city, val, data = [] } = props;
  const [listObj, setListObj] = useState({});
  useEffect(() => {
    setListObj(
      data.filter((item) => {
        return item.moduleName === "topBackground";
      })[0] || {}
    );
  }, [data]);
  const { height, topBackgroundImg = "" } = listObj;
  return (
    <View className="lookAround_navition_box">
      <View
        style={{ top: computedClient().top }}
        className="lookAround_navition_title"
      >
        <View
          className="lookAround_navition_left"
          onClick={(e) => {
            e.stopPropagation();
            Router({
              routerName: "city",
            });
          }}
        >
          <View className="lookAround_nation_cityIcon"></View>
          <View className="lookAround_nation_city font_hide">{city}</View>
          <View className="lookAround_nation_citySelect"></View>
        </View>
        <View className="lookAround_navition_cover"></View>
        <View className="lookAround_navition_rightVover"></View>
      </View>
      <View
        style={{
          ...backgroundObj(topBackgroundImg),
          height: Taro.pxTransform(height || 400),
          position: "absolute",
        }}
        className={classNames(
          height === 500
            ? "lookAround_navition_bigImage"
            : "lookAround_navition_image"
        )}
      ></View>
    </View>
  );
};
