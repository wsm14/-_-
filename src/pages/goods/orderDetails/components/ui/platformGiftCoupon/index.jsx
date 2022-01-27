import React, { useEffect } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { toast, backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default (props) => {
  const { data = {} } = props;
  let { platformGift = {} } = data;
  const { platformGiftPackRelateList } = platformGift;
  console.log(data);
  return (
    <View className="platformGiftCoupon_box">
      <View className="platformGiftCoupon_title">
        <View className="platformGiftCoupon_title_left">券信息</View>
        <View
          className="platformGiftCoupon_title_right"
          onClick={() =>
            Router({
              routerName: "wraparound",
            })
          }
        >
          查看券包
        </View>
      </View>
      <View className="platformGiftCoupon_content">
        {platformGiftPackRelateList.map((item) => {
          return (
            <View className="platformGiftCoupon_list">
              {item.relateName},满{item.thresholdPrice}可用
            </View>
          );
        })}
      </View>
    </View>
  );
};
