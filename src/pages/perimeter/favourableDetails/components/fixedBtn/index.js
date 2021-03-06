import React, { Component, useEffect } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import { format, computedPrice, computedBeanPrice } from "@/utils/utils";
import Tarking from "@/components/tracking";
import Router from "@/utils/router";
import "./index.scss";

export default (props) => {
  const {
    data,
    beanLimit = 500,
    shareInfo,
    configUserLevelInfo,
    saveInfo,
    httpData,
  } = props;
  const {
    paymentModeObject = {},
    rightFlag,
    remain,
    activityStartTime,
    activityTimeRule,
    userBean,
    realPrice,
    userCouponObjects = [],
  } = data;
  const { shareUserId } = httpData;
  const { bean = 0, cash = 0, type = "defaultMode" } = paymentModeObject;
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const computedBeanInfo = (price) => {
    if (userBean >= computedPrice(price, payBeanCommission) * 100) {
      return Number(computedPrice(price, payBeanCommission) * 100).toFixed(2);
    } else {
      return userBean;
    }
  };
  const computedRel = () => {
    return userCouponObjects.length > 0
      ? Number(realPrice) - Number(userCouponObjects[0].couponValue)
      : realPrice;
  };
  const computedRelprice = () => {
    if (type === "defaultMode") {
      let price = computedRel();
      if (price > 0) {
        return (price - computedBeanInfo(price) / 100).toFixed(2);
      } else {
        return 0;
      }
    } else {
      return cash;
    }
  };
  if (rightFlag === "1" && type === "defaultMode") {
    return null;
  } else {
    const payBtn = () => {
      if (!format(activityStartTime) && activityTimeRule === "fixed") {
        return (
          <View className="fixedBtn_payBtn public_center fixedBtn_payStyle3">
            即将开始
          </View>
        );
      } else if (remain === 0) {
        return (
          <View className="fixedBtn_payBtn public_center fixedBtn_payStyle2">
            已售罄
          </View>
        );
      } else if (rightFlag === "1") {
        return (
          <View
            onClick={saveInfo}
            className="fixedBtn_payBtn public_center fixedBtn_payStyle1"
          >
            <Tarking args={data} name={"favourableDetails"}>
              ¥{cash} 立即购买
            </Tarking>
          </View>
        );
      } else {
        return (
          <View
            className="fixedBtn_payBtn public_center fixedBtn_payStyle1"
            onClick={saveInfo}
          >
            <Tarking args={data} name={"favourableDetails"}>
              ¥{computedRelprice() + " "} 立即购买
            </Tarking>
          </View>
        );
      }
    };
    return (
      <View className="fixedBtn_box">
        {type === "defaultMode" ? (
          <View className="fixedBtn_computedBean">
            {userCouponObjects.length > 0 && (
              <>
                <View className="font24 color1">平台优惠券 </View>
                <View className="font24 color3">
                  {userCouponObjects[0].couponValue}元
                </View>
              </>
            )}
            {userCouponObjects.length > 0 && (
              <View className="font24 colo1">，</View>
            )}

            <>
              <View className="font24 color1">
                {computedBeanInfo(computedRel())}
                卡豆抵扣{" "}
              </View>
              <View className="font24 color3">
                {(computedBeanInfo(computedRel()) / 100).toFixed(2)}元
              </View>
            </>
          </View>
        ) : (
          <View className="fixedBtn_computedBean  font24">
            需用 <View className="color3">{bean}</View>卡豆抵扣
            {(bean / 100).toFixed(2)}元
          </View>
        )}

        <View className="fixedBtn_button">
          <View
            className="fixedBtn_getBean"
            onClick={() =>
              Router({
                routerName: "home",
                type: "switchTab",
              })
            }
          >
            <View className="fixedBtn_bean public_center">
              天天领{(beanLimit / 100).toFixed(0)}元
            </View>
            {shareUserId ? "首页捡豆" : "去捡豆"}
          </View>
          <Tarking args={data} name={"share_goods"}>
            <View className="fixedBtn_getShare" onClick={shareInfo}>
              推荐给好友
            </View>
          </Tarking>

          {payBtn()}
        </View>
      </View>
    );
  }
};
