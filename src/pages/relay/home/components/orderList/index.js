import React, { Component } from "react";
import Taro, { useReachBottom, usePullDownRefresh } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { index } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import { toast, filterGoodsStatus, loginStatus } from "@/common/utils";
import Tabs from "@/components/tabs";
import { fetchOrderStatus } from "@/server/relay";
import { goodsNullStatus } from "@/components/publicShopStyle";
import Template from "./components/goods";
import Router from "@/common/router";
import "./index.scss";
import { useState } from "react";
import { useEffect } from "react";
export default (props) => {
  const { index, navHeight } = props;
  const [list, setList] = useState([]);
  const [setting, setSetting] = useState({
    tabList: ["全部订单", "待付款", "可使用", "退款/售后"],
    current: 0,
  });
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
    orderStatus: "",
    orderType: "communityGoods",
    closeType: "",
  });
  const { current } = setting;
  const setIndex = (val) => {
    if (val != current) {
      setList([]);
      let closeType = "";
      if (val === 3) {
        closeType = "expiredRefund,manualRefund";
      }
      setHttpData({
        ...httpData,
        page: 1,
        orderStatus: filterGoodsStatus(val),
        closeType,
      });
      setSetting({
        ...setting,
        current: val,
      });
    }
    return;
  };
  useEffect(() => {
    if (index == 2) {
      getOrderList();
    }
  }, [httpData]);
  useEffect(() => {
    if (index == 2 && list.length === 0) {
      getOrderList();
    }
  }, [index]);
  const getOrderList = () => {
    fetchOrderStatus({ ...httpData }).then((val) => {
      const { orderList = [] } = val;
      setList([...list, ...orderList]);
    });
  };
  const updateStatus = (val) => {
    const { orderSn } = val;
    setList(
      list.map((item) => {
        if (orderSn === item.orderSn) {
          return {
            ...item,
            status: "2",
          };
        } else {
          return { ...item };
        }
      })
    );
  };
  usePullDownRefresh(() => {
    if (index == 2) {
      setList([]);
      setHttpData({
        ...httpData,
        page: 1,
        limit: 10,
      });
    }
  });
  useReachBottom(() => {
    if (index == 2) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
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
    top: navHeight,
    zIndex: 100,
  };

  return (
    <View style={{ display: index === 2 ? "block" : "none" }}>
      <Tabs fn={setIndex} style={tabStyle} {...setting}></Tabs>
      {/* Tabs高度占位 */}
      <View
        style={{ height: Taro.pxTransform(88), position: "relative" }}
      ></View>
      {list.length === 0 ? (
        goodsNullStatus()
      ) : (
        <View className="goodsView relay_order_box">
          {list.map((item) => {
            return (
              <Template updateStatus={updateStatus} data={item}></Template>
            );
          })}
        </View>
      )}
    </View>
  );
};
