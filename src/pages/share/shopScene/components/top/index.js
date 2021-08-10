import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { getLat, getLnt } from "@/common/utils";
import { View, Text, WebView, ScrollView } from "@tarojs/components";
import classNames from "classnames";
import Barrage from "@/components/componentView/active/barrage";
import Router from "@/common/router";
export default ({ configUserLevelInfo, onShare, orderInfo, userInfo }) => {
  const { statisticOrderCount } = orderInfo;
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const [visible, setVisible] = useState(false);
  const { bean = 0, level = "0" } = userInfo;
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
  return (
    <View className="shopScene_top">
      <View className="shopScene_content_topHeight"></View>
      <View className="shopScene_card">
        <View className="shopScene_card_details">
          <View>
            <Text className="font24 color1">卡豆余额</Text>
            <Text className="font28 color3 textmargin">{bean}</Text>
          </View>
        </View>
      </View>
      <View className="shopScene_btn_box public_auto">
        <View
          className={classNames(
            "shopScene_btn",
            level === "0" ? "shopScene_btn_left" : "shopScene_btn_left1"
          )}
          onClick={() => {
            if (level === "0") {
              Router({
                routerName: "webView",
                args: {
                  link: "https://dakale-wx-hutxs-1302395972.tcloudbaseapp.com/dakale-web-page/wechant/page/interface.html",
                  title: "关注公众号",
                },
              });
            } else {
              Router({
                routerName: "download",
              });
            }
          }}
        ></View>
        <View
          className="shopScene_btn shopScene_btn_right"
          onClick={() =>
            Taro.pageScrollTo({
              selector: ".importScice_box",
            })
          }
        ></View>
      </View>
      <View
        className={classNames(
          "shopScene_step",
          parseInt(statisticOrderCount) > 5
            ? "shopScene_step5"
            : `shopScene_step${statisticOrderCount}`
        )}
      ></View>
      <Barrage></Barrage>
    </View>
  );
};
