import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import {
  toast,
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  computedPrice,
} from "@/common/utils";
import classNames from "classnames";
import ShopView from "@/components/componentView/ownerView/ownerShop";
import Router from "@/common/router";
export default ({ list, userInfo, height, flag = false }) => {
  return (
    <View
      className={classNames("bubble_merchant_listBox")}
      style={{ height: height }}
    >
      {list.length === 0 && (
        <>
          <View className="nullStatus_init"></View>
          <View className="nullStatus_init_font">暂无商家</View>
        </>
      )}
      {list.map((item) => {
        return <ShopView userInfo={userInfo} data={item}></ShopView>;
      })}
    </View>
  );
};
