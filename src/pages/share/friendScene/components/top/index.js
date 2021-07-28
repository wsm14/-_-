import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { backgroundObj, getLat, getLnt } from "@/common/utils";
import { View, Text, WebView, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import Barrage from "@/components/componentView/active/barrage";
import Time from "@/components/dateTime";
export default ({
  configUserLevelInfo,
  onShare,
  userInfo,
  data = [],
  beanDetailList = [],
}) => {
  const [list, setList] = useState([
    { count: 500 },
    { count: 1000 },
    { count: 1500 },
    { count: 2000 },
    { count: 3000 },
  ]);
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const { bean = 0, level = "0" } = userInfo;
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState(false);
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
  const beanBox = (item) => {
    const { beanAmount, beanTime } = item;
    return (
      <View className="friendScene_layer_child">
        <View className="friendScene_content_top">
          <View className="color3 font32">+{beanAmount}卡豆</View>
          <View className="color1 font28">已入账</View>
        </View>
        <View className="friendScene_time">{beanTime}</View>
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
            <Text className="font28 color3 textmargin">{bean}</Text>
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
        onClick={() => {
          if (level === "0" && data.length === 5) {
            setToast(true);
          } else {
            onShare();
          }
        }}
        className={classNames(
          level === "0" && data.length === 5
            ? "shareInfo_btn1"
            : "shareInfo_btn"
        )}
      ></View>
      <View className="friendScene_timesAuto">
        <Time showTimeInfo times={getDate()} fn={() => getDate()}></Time>
        后今日活动结束
      </View>
      <View className="friendScene_shareCount_box">
        {list.map((item, index) => {
          const { count } = item;
          if (data[index]) {
            const { profile } = data[index];
            return (
              <View className="friendScene_bean_box">
                <View
                  className={classNames(
                    "friendScene_bean_iconBox",
                    "friendScene_bean_iconBox2"
                  )}
                >
                  {count}卡豆
                </View>
                <View
                  style={backgroundObj(profile)}
                  className={classNames(
                    "friendScene_bean_profile",
                    "friendScene_bean_profile2"
                  )}
                ></View>
                {data.length > 0 && index + 1 === data.length ? (
                  <View className="friendScene_bean_index"></View>
                ) : null}
              </View>
            );
          } else {
            return (
              <View className="friendScene_bean_box">
                <View
                  className={classNames(
                    "friendScene_bean_iconBox",
                    "friendScene_bean_iconBox1"
                  )}
                >
                  {count}卡豆
                </View>
                <View
                  className={classNames(
                    "friendScene_bean_profile",
                    "friendScene_bean_profile1"
                  )}
                ></View>
                {data.length > 0 && index + 1 === data.length ? (
                  <View className="friendScene_bean_index"></View>
                ) : null}
              </View>
            );
          }
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
              {beanDetailList.map((item) => {
                return beanBox(item);
              })}
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
      {toast && (
        <View
          onClick={() => {
            setToast(false);
          }}
          className="friendScene_layer public_center"
          catchMove
        >
          <View
            className="friendScene_layer_toast"
            onClick={(e) => e.stopPropagation()}
          >
            <View
              className="friendScene_layer_toastBtn"
              onClick={() => setToast(false)}
            >
              好的
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
