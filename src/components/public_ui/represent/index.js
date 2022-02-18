import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import Tarking from "@/components/tracking";
import Router from "@/utils/router";
import classNames from "classnames";
import "./index.scss";

export default (props) => {
  const { data, configUserLevelInfo } = props;
  const { allowExpireRefund, allowRefund, needOrder, activityType } = data;
  const {
    payBeanCommission = 50,

    levelKey = "normal",
    level = 0,
  } = configUserLevelInfo;
  const filterPeople = () => {
    if (levelKey === "normal") {
      return "哒人";
    } else if (levelKey === "daren") {
      return "哒人";
    } else if (levelKey === "douzhang") {
      return "豆长";
    }
  };
  return (
    <View className="represent_box">
      {activityType !== "commerceGoods" && (
        <View className="represent_buy_rules">
          <View className="represent_buy_rulesName">保障</View>

          {needOrder === "0" && (
            <>
              <View className="shopDetails_tab_icon"></View>
              <View className="shopDetails_tab_font">免预约</View>
            </>
          )}

          {allowRefund === "1" && (
            <>
              <View className="shopDetails_tab_icon"></View>
              <View className="shopDetails_tab_font">随时退</View>
            </>
          )}
          {allowExpireRefund === "1" && (
            <>
              <View className="shopDetails_tab_icon"></View>
              <View className="shopDetails_tab_font">过期退</View>
            </>
          )}
          <>
            <View className="shopDetails_tab_icon"></View>
            <View className="shopDetails_tab_questionRight color2 font24">
              卡豆抵扣
              <Text className="color11 font24">{payBeanCommission + "%"}</Text>
            </View>
          </>
          <View
            onClick={() => Router({ routerName: "interests" })}
            className="shop_question question_icon"
          ></View>
        </View>
      )}
      <Tarking args={data} name={"represent"}>
        <View className="represent_buy_kefu">
          <View className="represent_buy_logo"></View>
          <View className="represent_buy_font">
            哒卡乐微信助手，专属福利｜活动信息
          </View>
          <View className="represent_buy_btn public_center">添加</View>
          <Button
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              border: "none",
              background: "none",
            }}
            openType={"contact"}
          ></Button>
        </View>
      </Tarking>
    </View>
  );
};
