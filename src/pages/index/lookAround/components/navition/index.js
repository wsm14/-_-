import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { backgroundObj } from "@/utils/utils";
import { computedClient } from "@/utils/utils";
import { observer, MobXProviderContext } from "mobx-react";
import "./index.scss";
import Router from "@/utils/router";
//逛逛顶部导航栏
export default (props) => {
  const { city, val } = props;
  const { store } = React.useContext(MobXProviderContext);
  const { commonStore } = store;
  const { festivalConfigs = [] } = commonStore;
  const [data, setData] = useState({});
  useEffect(() => {
    setData(
      festivalConfigs.reduce(
        (item, val) => {
          if (val.topType === "wanderAround") {
            return {
              ...item,
              ...val,
            };
          }
        },
        {
          height: 400,
        }
      )
    );
  }, [festivalConfigs]);

  const { height, image } = data;
  const { bean, todayTotalIncome } = val;
  return (
    <View className="lookAround_navition_box">
      <View
        style={backgroundObj(image)}
        className={classNames(
          height === 500
            ? "lookAround_navition_bigImage"
            : "lookAround_navition_image"
        )}
      ></View>
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
        className="lookAround_navition_beanLink"
        onClick={() => Router({ routerName: "wallet" })}
      ></View>
      <View className="lookAround_navition_beanNum">{bean}</View>
      <View className="lookAround_navition_money">
        <View className="lookAround_navition_moneyBean">
          {todayTotalIncome}
        </View>
        <View className="lookAround_navition_moneyDesc">今日赚豆</View>
      </View>
    </View>
  );
};
