import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";

import classNames from "classnames";
import ShopView from "@/components/public_ui/ownerView/ownerShop";
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
      <View className="bubble_liner_height"></View>
    </View>
  );
};
