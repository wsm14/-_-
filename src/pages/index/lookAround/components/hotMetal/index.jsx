import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { renterCouponDesc } from "@/common/constant";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  const [listObj, setListObj] = useState({});
  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "timeLimitedCoupon") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);

  const {
    platformCouponObjectList = [],
    identification,
    resourceTemplateContentId,
  } = listObj;
  return (
    <View
      className="hotMetal_box"
      onClick={() =>
        Router({
          routerName: "wanderAround",
          args: {
            type: "hotMetal",
            identification: identification,
            resourceTemplateContentId,
            title: "限时神券",
          },
        })
      }
    >
      <View className="hotMetal_title">
        <View className="hotMetal_link">领取更多</View>
      </View>
      <View className="hotMetal_content">
        {platformCouponObjectList.map((item) => {
          const { couponValue, useScenesType, thresholdPrice } = item;
          const templateCoupon = {
            goodsBuy: "hotMetal_coupon_icon1",
            commerce: "hotMetal_coupon_icon2",
            virtual: "hotMetal_coupon_icon3",
          }[useScenesType];
          return (
            <View className="hotMetal_coupon_info">
              <View className={`hotMetal_coupon_box ${templateCoupon}`}>
                <View className="hotMetal_coupon_desc">
                  {renterCouponDesc(item)}
                </View>
              </View>
              <View className="hotMetal_coupon_price">价值{couponValue}元</View>
              <View className="hotMetal_coupon_priceDesc">
                满{thresholdPrice}元可用
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
