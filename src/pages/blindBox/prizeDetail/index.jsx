import React, { useState, useEffect } from "react";
import { useDidShow, useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { fetchGetPrizeDetail } from "@/server/share";
import UserInfo from "./components/UserInfo";
import OrderInfo from "./components/OrderInfo";
import evens from "@/common/evens";
import "./index.scss";

/**
 * 奖品详情
 */
export default () => {
  // 路由获取参数 blindBoxRewardId
  const routeParams = useRouter().params;
  const { blindBoxRewardId } = routeParams;

  const [detail, setDetail] = useState({}); // 商品详情
  useEffect(() => {}, []);
  useDidShow(() => {
    getDetail();
  });

  const getDetail = () => {
    fetchGetPrizeDetail({ blindBoxRewardId }).then((val) => {
      const { blindBoxRewardInfo = {} } = val;
      const { contentParam = "{}", createTime } = blindBoxRewardInfo;
      setDetail({ ...JSON.parse(contentParam), createTime });
    });
  };

  return (
    <View className="prize_detail">
      {/* 用户联系地址商品信息 */}
      <UserInfo detail={detail}></UserInfo>
      {/* 订单信息 */}
      <OrderInfo detail={detail}></OrderInfo>
      {/* 兑奖须知 */}
      <View className="cash_deatil">
        <View className="cash_deatil_tile">兑奖须知</View>
        <View className="cash_deatil_content"></View>
      </View>
    </View>
  );
};
