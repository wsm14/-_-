import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { filterStrList, format } from "@/utils/utils";
import Banner from "@/components/banner";
import Date from "@/components/dateTime";
import "./index.scss";

export default (props) => {
  const { data } = props;
  const {
    activityGoodsImg,
    rightFlag = "0",
    paymentModeObject = {},
    activityType,
    activityStartTime,
    activityTimeRule,
    activityEndTime,
  } = data;
  const { bean = 0, cash = 0, type = "defaultMode" } = paymentModeObject;
  const template = () => {
    if (!format(activityStartTime) && activityTimeRule === "fixed") {
      return <View className="shopDetails_avtiveTime_tag">即将开始</View>;
    } else {
      return (
        <View className="shopdetails_pay_status">
          {activityTimeRule !== "infinite" ? (
            <Date
              onlyTime
              type={true}
              times={activityEndTime}
              fn={() => {}}
            ></Date>
          ) : (
            <View className="shopDetails_avtiveTime_tag">长期有效</View>
          )}
        </View>
      );
    }
  };
  return (
    <>
      <View className="shopDetails_banner dakale_nullImage">
        <Banner
          autoplay={filterStrList(activityGoodsImg).length > 1 ? true : false}
          imgStyle
          showNear
          data={filterStrList(activityGoodsImg) || []}
          style={{ width: "100%", height: "100%" }}
          boxStyle={{ width: "100%", height: "100%" }}
        ></Banner>
      </View>
      {!(
        (rightFlag === "1" && type === "defaultMode") ||
        activityType === "commerceGoods"
      ) && (
        <View className="shopDetails_activeStatus">
          <View className="shopDetails_avtiveLogo"></View>
          <View className="shopDetails_avtiveTime">{template()}</View>
        </View>
      )}
      {/* //普通特惠商品展示 商品状态 */}
    </>
  );
};
