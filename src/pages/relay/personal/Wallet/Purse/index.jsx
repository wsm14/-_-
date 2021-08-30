import React from "react";
import { useRouter } from "@tarojs/taro";
import Router from "@/common/router";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * 我的钱包
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  const { liftingCabinets = "" } = routeParams;

  return <View className="SelfCommission_Form"></View>;
};
