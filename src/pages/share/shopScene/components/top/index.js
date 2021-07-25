import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { getLat, getLnt } from "@/common/utils";
import { View, Text, WebView, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import Barrage from "@/components/componentView/active/barrage";
import Time from "@/components/dateTime";
export default ({ configUserLevelInfo, onShare }) => {
  const [list, setList] = useState([1, 1, 1, 1, 1]);
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const [visible, setVisible] = useState(false);
  const getDate = () => {
    let timestamp = Date.parse(new Date());
    let date = new Date(timestamp);
    //获取年份
    let Y = date.getFullYear();
    //获取月份
    let M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    //获取当日日期
    var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return Y + "-" + M + "-" + D;
  };
  console.log(getDate());
  useEffect(() => {}, []);

  return (
    <View className="shopScene_top">
      <View className="shopScene_content_topHeight"></View>
      <View className="shopScene_card">
        <View className="shopScene_card_details">
          <View>
            <Text className="font24 color1">卡豆余额</Text>
            <Text className="font28 color3 textmargin">200</Text>
          </View>
        </View>
      </View>
      <View className="shopScene_btn_box public_auto">
        <View className="shopScene_btn shopScene_btn_left"></View>
        <View
          className="shopScene_btn shopScene_btn_right"
          onClick={() =>
            Taro.pageScrollTo({
              selector: ".importScice_box",
            })
          }
        ></View>
      </View>
      <Barrage></Barrage>
    </View>
  );
};
