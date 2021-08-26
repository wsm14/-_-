import React, { Component } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { index } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import { toast, filterGoodsStatus, loginStatus } from "@/common/utils";
import Tabs from "@/components/tabs";
import Goods from "./components/goods";
import { goodsNullStatus } from "@/components/publicShopStyle";
import Template from "./components/goods";
import { inject, observer } from "mobx-react";
import Router from "@/common/router";
import "./index.scss";
import { useState } from "react";
export default (props) => {
  const { index } = props;
  const [list, setList] = useState([{}, {}, {}]);
  const [setting, setSetting] = useState({
    tabList: ["全部订单", "待付款", "可使用", "退款/售后"],
    current: 0,
  });
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
  });
  const { current } = setting;
  const setIndex = (index) => {
    if (index != current) {
      setList([]);
      let closeType = "";
      if (index === 3) {
        closeType = "expiredRefund,manualRefund";
      }
      setSetting({
        ...setting,
        current: index,
      });
    }
    return;
  };
  useReachBottom(() => {
    if (index == 2) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
      toast("翻页");
    }
  });
  const tabStyle = {
    height: Taro.pxTransform(88),
    borderRadius: "0px 0px 20px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    padding: `0 ${Taro.pxTransform(83)} 0 ${Taro.pxTransform(52)}`,
    position: "fixed",
    left: 0,
    right: 0,
    top: Taro.pxTransform(98),
    zIndex: 100,
  };

  return (
    <View
      style={{ display: index === 2 ? "block" : "none" }}
      className="relay_orderList_box"
    >
      <Tabs fn={setIndex} style={tabStyle} {...setting}></Tabs>
      {list.length === 0 ? (
        goodsNullStatus()
      ) : (
        <View className="goodsView relay_order_box">
          {list.map((item) => {
            return <Template data={item}></Template>;
          })}
        </View>
      )}
    </View>
  );
};
