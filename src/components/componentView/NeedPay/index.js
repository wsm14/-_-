/*
店铺详情优惠券公共样式

*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Router from "@/common/router";
import "./index.scss";
export const payNeed = () => {
  return (
    <View className="componentdetails_component_toast">
      <View className="component_toastTitle">购买须知</View>

      <View className="component_toastText component_toastTextHeight">
        本券不可拆分使用，不支持外卖点餐、电商订购等；不可转让、转售、转发、截图，也不能兑换现金；不可伪造，伪造无效。
      </View>
      <View className="component_toastText component_toastTextHeight">
        本券一经核销即为使用，卡券详情可查看存根信息；
      </View>
      <View className="component_toastText component_toastTextHeight">
        如对订单有疑问，请到商家咨询，或者拨打哒卡乐官方客服电话：400-800-5881进行咨询。
      </View>
      <View className="component_toastText component_toastTextHeight">
        *最终解释权归杭州哒卡乐智能科技有限公司所有
      </View>
    </View>
  );
};
