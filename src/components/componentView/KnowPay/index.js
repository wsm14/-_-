/*
店铺详情优惠券公共样式

*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { filterWeek } from "@/common/utils";
import "./index.scss";
export const knowPay = (data, type = "good") => {
  const {
    activeDays,
    useStartTime,
    useEndTime,
    delayDays,
    useWeek = "",
    useTime = "",
    buyDesc = "",
    couponDesc = "",
    activeDate,
    thresholdPrice,
    endDate,
    activeBeginDate,
    activeEndDate,
  } = data;
  const templateTime = () => {
    if (activeDays) {
      return `购买后${
        delayDays === 0 ? "立刻" : delayDays + "天"
      }生效，有效期${activeDays}天`;
    } else if (activeDate) {
      return `${activeDate}至${endDate}`;
    } else if (activeBeginDate) {
      return `${activeBeginDate}至${activeEndDate}`;
    } else {
      return `${useStartTime}至${useEndTime}`;
    }
  };
  const templateDesc = (val) => {
    let str = "";
    if (val && val.length && JSON.parse(val)) {
      str = JSON.parse(val);
      return str.map((item) => {
        return <View>{item}</View>;
      });
    }
    return [];
  };
  return (
    <View className="shopdetails_shop_toast">
      <View className="shop_toastTitle">购买须知</View>
      <View className="shop_toastDec shop_toastDate">有效期：</View>
      <View className="shop_toastText">
        <Text className="shop_toastTextColor">{templateTime()}</Text>
        <Text className="color1">，请在有效期内使用;</Text>
      </View>
      <View className="shop_toastDec shop_getDate">使用时间：</View>
      <View className="shop_toastText">
        <Text className="shop_toastTextColor">
          {filterWeek(useWeek) + " " + useTime}
        </Text>
        ，具体以门店供应时段为准；
      </View>
      {type === "coupon" && thresholdPrice !== "0" && thresholdPrice !== "" && (
        <>
          <View className="shop_toastDec shop_getDate">使用门槛：</View>
          <View className="shop_toastText">满{thresholdPrice}元可用；</View>
        </>
      )}
      <View className="shop_toastDec shop_showNow">使用规则：</View>
      {templateDesc(buyDesc || couponDesc).length > 0 && (
        <>
          <View
            style={{ lineHeight: Taro.pxTransform(36) }}
            className="shop_toastText"
          >
            {templateDesc(buyDesc || couponDesc)}
          </View>
        </>
      )}
      <View
        style={{ lineHeight: Taro.pxTransform(36) }}
        className="shop_toastText"
      >
        {" "}
        本券不可拆分使用，不支持外卖点餐、电商订购等；不可转让、转售、转发、截图，也不能兑换现金；不可伪造，伪造无效。{" "}
      </View>
      <View
        style={{ lineHeight: Taro.pxTransform(36) }}
        className="shop_toastText"
      >
        {" "}
        本券一经核销即为使用，卡券详情可查看存根信息；
      </View>
      <View
        style={{ lineHeight: Taro.pxTransform(36) }}
        className="shop_toastText"
      >
        如对订单有疑问，请到商家咨询，或者拨打哒卡乐官方客服电话：400-800-5881进行咨询。
      </View>
      <View
        style={{ lineHeight: Taro.pxTransform(36) }}
        className="shop_toastText"
      >
        *最终解释权归杭州哒卡乐智能科技有限公司所有
      </View>
    </View>
  );
};
