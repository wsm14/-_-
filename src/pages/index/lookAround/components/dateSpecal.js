import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj } from "@/common/utils";
import Taro from "@tarojs/taro";
import { template } from "@/components/specalTemplate";
import Router from "@/common/router";
import "./../index.scss";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const memo = useMemo(() => {
    return (
      <View className="lookAround_active_box">
        <View
          className="lookAround_active_title"
          onClick={() =>
            Router({
              routerName: "speciaMaterial",
              args: {
                type: "today",
              },
            })
          }
        >
          <View className="lookAround_active_left">
            <View className="lookAround_active_date"></View>
          </View>
          <View className="lookAround_active_right">
            <View className="lookAround_active_date1">爆款好物，福利来袭</View>
          </View>
        </View>
        <View style={{ paddingTop: Taro.pxTransform(32) }}>
          {data.map((item) => {
            return template(item, userInfo);
          })}
        </View>
      </View>
    );
  }, [data, payBeanCommission, shareCommission]);
  return memo;
};
