/*签到引导*/
import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import Taro from "@tarojs/taro";
import Tarking from "@/components/tracking";
import Banner from "@/components/banner";
import { fetchBanner } from "@/server/common";
import "./index.scss";
export default ({ val }) => {
  const { bean, todayTotalIncome } = val;
  return (
    <View className="lookAround_beanInfo_box public_auto">
      <View className="lookAround_beanInfo_left">
        <View
          className="lookAround_navition_beanLink"
          onClick={() => Router({ routerName: "wallet" })}
        ></View>
        <View className="lookAround_navition_beanNum">{bean}</View>
      </View>
      <View className="lookAround_navition_money">
        <View className="lookAround_navition_moneyBean">
          {todayTotalIncome}
        </View>
        <View className="lookAround_navition_moneyDesc">今日赚豆</View>
      </View>
    </View>
  );
};
