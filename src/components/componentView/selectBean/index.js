import React, { Component, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import classNames from "classnames";
import Toast from "@/components/dakale_toast";
import "./index.scss";
export default (props) => {
  const {
    data = {},
    configUserLevelInfo = {},
    fn,
    useBeanStatus,
    payType = "shop",
  } = props;
  const [selectType, setSelectType] = useState({
    status: useBeanStatus,
  });
  const [show, setShow] = useState(false);
  const { payBeanCommission = "50", level = "0" } = configUserLevelInfo;
  const { userIncomeBean = "", userBean = "", rightFlag = "1" } = data;
  const { status } = selectType;
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
  return userBean ? (
    <>
      <View
        style={payType === "scan" ? { marginTop: "0" } : {}}
        className="order_details_payType"
        onClick={(e) => {
          e.stopPropagation();
          nowal();
        }}
      >
        <View className="order_payType_box">
          <View className="order_payType_top">
            卡豆优惠抵扣
            <View
              style={{ border: "1px solid #ef476f" }}
              className="order_payType_six"
            >
              {rightFlag === "1" ? `专区优惠` : `${payBeanCommission}%`}
            </View>
            {rightFlag !== "1" && (
              <View
                className="order_payType_question"
                onClick={(e) => {
                  e.stopPropagation();
                  setShow(true);
                }}
              ></View>
            )}
          </View>
          <View className="order_pay_font">
            可用{parseInt(userBean)}卡豆抵扣卡豆{parseInt(userBean) / 100}元
          </View>
          <View
            className={classNames(
              "order_pay_iconBox",
              status === "1" ? "order_pay_icon2" : "order_pay_icon1"
            )}
          ></View>
        </View>
      </View>
      {show && (
        <Toast title={"卡豆抵扣说明"} close={() => setShow(false)}>
          <View className="dakale_layer_content font28 color10">
            <View className="dakale_layer_top">
              1、普通用户每笔可使用卡豆余额的50%进行抵扣；
            </View>
            <View className="dakale_layer_top">
              2、升级到哒人或者豆长可最高使用卡豆余额的90%抵扣；
            </View>
            <View className="dakale_layer_top">
              3、最终解释权归哒卡乐平台所有;
            </View>
          </View>
        </Toast>
      )}
    </>
  ) : null;
};
