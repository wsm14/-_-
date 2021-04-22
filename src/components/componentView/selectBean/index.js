import React, { Component, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import {
  toast,
  backgroundObj,
  goBack,
  navigateTo,
  redirectTo,
  filterWeek,
} from "@/common/utils";
import Router from "@/common/router";
import classNames from "classnames";
import "./index.scss";
export default (props) => {
  const {
    data = {},
    configUserLevelInfo = {},
    fn,
    useBeanStatus,
    useBeanType,
    payType = "shop",
  } = props;
  const [selectType, setSelectType] = useState({
    status: useBeanStatus,
    type: useBeanType,
  });
  const nowal = () => {
    const { status } = selectType;
    if (status === "1") {
      setSelectType({ ...selectType, status: "0" });
      fn &&
        fn({
          useBeanStatus: "0",
        });
    } else {
      setSelectType({ ...selectType, status: "1" });
      fn &&
        fn({
          useBeanStatus: "1",
        });
    }
  };
  const kol = (type) => {
    const { status } = selectType;
    if (status === "1") {
      setSelectType({ ...selectType, status: "0" });
      fn &&
        fn({
          useBeanStatus: "0",
        });
    } else {
      setSelectType({ ...selectType, status: "1" });
      fn &&
        fn({
          useBeanStatus: "1",
          useBeanType: type,
        });
    }
  };
  const { level = "0", payBeanCommission = 50 } = configUserLevelInfo;
  const { userIncomeBean = "", userBean = "" } = data;
  const { status, type } = selectType;
  if (level === "0") {
    return userBean ? (
      <View
        style={payType === "scan" ? { marginTop: "0" } : {}}
        className="order_details_payType"
        onClick={() => nowal()}
      >
        <View className="order_payType_box">
          <View className="order_payType_top">
            卡豆优惠抵扣
            <View className="order_payType_six">{payBeanCommission}%</View>
            <View
              className="order_payType_question"
              onClick={(e) => {
                e.stopPropagation();
                Router({
                  routerName: "interests",
                });
              }}
            ></View>
          </View>
          <View className="order_pay_font">
            可用{userBean}卡豆抵扣卡豆{parseInt(userBean) / 100}元
          </View>
          <View
            className={classNames(
              "order_pay_iconBox",
              status === "1" ? "order_pay_icon2" : "order_pay_icon1"
            )}
          ></View>
        </View>
      </View>
    ) : null;
  } else {
    if (!userBean && !userIncomeBean) {
      return null;
    } else {
      return (
        <View
          style={payType === "scan" ? { marginTop: "0" } : {}}
          className="order_details_payType"
        >
          <View className="order_payType_box">
            <View className="order_payType_top">
              卡豆优惠抵扣
              <View className="order_payType_six">{payBeanCommission}%</View>
              <View
                className="order_payType_question"
                onClick={(e) => {
                  e.stopPropagation();
                  Router({
                    routerName: "interests",
                  });
                }}
              ></View>
            </View>
            <View
              onClick={() => {
                userBean && kol("reward");
              }}
              className="order_select_top1 public_auto"
            >
              <View className="order_select_left">
                <View className="order_select_title public_center">
                  奖励卡豆
                </View>
                {userBean ? (
                  <View className="public_center order_select_title2">
                    可用{userBean}卡豆优惠抵扣{(userBean / 100).toFixed(2)}元
                  </View>
                ) : (
                  <View className="public_center order_select_title3">
                    暂无可用卡豆
                  </View>
                )}
              </View>
              {userBean ? (
                <View
                  className={classNames(
                    "order_select_right",
                    type === "reward" && status === "1"
                      ? "order_pay_icon2"
                      : "order_pay_icon1"
                  )}
                ></View>
              ) : (
                <View className="order_select_right  order_pay_icon3"></View>
              )}
            </View>
            <View
              onClick={() => {
                userIncomeBean && kol("income");
              }}
              className="order_select_top2 public_auto"
            >
              <View className="order_select_left">
                <View className="order_select_title public_center">
                  收益卡豆
                </View>
                {userIncomeBean ? (
                  <View className="public_center order_select_title2">
                    可用{userIncomeBean}卡豆优惠抵扣
                    {(userIncomeBean / 100).toFixed(2)}元
                  </View>
                ) : (
                  <View className="public_center order_select_title3">
                    暂无可用卡豆
                  </View>
                )}
              </View>
              {userIncomeBean ? (
                <View
                  className={classNames(
                    "order_select_right",
                    type === "income" && status === "1"
                      ? "order_pay_icon2"
                      : "order_pay_icon1"
                  )}
                ></View>
              ) : (
                <View className="order_select_right  order_pay_icon3"></View>
              )}
            </View>
          </View>
        </View>
      );
    }
  }
};
