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
  const beanBox = (item) => {
    return (
      <View className="friendScene_layer_child">
        <View className="friendScene_content_top">
          <View className="color3 font32">+500卡豆</View>
          <View className="color1 font28">已入账</View>
        </View>
        <View className="friendScene_time">刚刚</View>
      </View>
    );
  };
  return (
    <View className="friendScene_top">
      <View className="friendScene_content_topHeight"></View>
      <View className="friendScene_card">
        <View className="friendScene_card_details">
          <View>
            <Text className="font24 color1">卡豆余额</Text>
            <Text className="font28 color3 textmargin">200</Text>
          </View>
          <View
            className="friendScene_card_btn public_center"
            onClick={() => setVisible(true)}
          >
            获奖记录
          </View>
        </View>
      </View>
      <View
        onClick={() => onShare()}
        className={classNames(
          shareCommission > 0 ? "shareInfo_btn" : "shareInfo_btn1"
        )}
      ></View>
      <View className="friendScene_timesAuto">
        <Time showTimeInfo times={getDate()} fn={() => getDate()}></Time>
        后今日活动结束
      </View>
      <View className="friendScene_shareCount_box">
        {list.map((item) => {
          return (
            <View className="friendScene_bean_box">
              <View
                className={classNames(
                  "friendScene_bean_iconBox",
                  "friendScene_bean_iconBox1"
                )}
              >
                500卡豆
              </View>
              <View
                className={classNames(
                  "friendScene_bean_profile",
                  "friendScene_bean_profile1"
                )}
              ></View>
              <View className="friendScene_bean_index"></View>
            </View>
          );
        })}
      </View>
      <Barrage></Barrage>
      {visible && (
        <View
          onClick={() => {
            setVisible(false);
          }}
          className="friendScene_layer public_center"
          catchMove
        >
          <View
            className="friendScene_layer_content"
            onClick={(e) => e.stopPropagation()}
          >
            <View className="friendScene_layer_top"></View>
            <ScrollView scrollY className="friendScene_layer_content">
              {beanBox()}
              {beanBox()} {beanBox()}
              {beanBox()} {beanBox()} {beanBox()} {beanBox()}
            </ScrollView>
            <View className="friendScene_layer_btn">
              <View
                className="friendScene_layer_btnBox"
                onClick={() => {
                  setVisible(false);
                }}
              >
                知道了
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
