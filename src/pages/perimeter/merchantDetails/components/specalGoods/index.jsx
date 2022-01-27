import React from "react";
import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import Waterfall from "@/components/waterfall";
import { goodsCard, shopDetails } from "@/components/public_ui/shopInfo";
import Router from "@/utils/router";

export default ({ data, list }) => {
  const { merchantId } = data;
  if (list.length > 0) {
    return (
      <>
        <View className="merchant_active">
          <View className="merchant_active_title">
            <View className="merchant_active_iconBox active_icon2"></View>
            <View className="merchant_active_biaoti">特价活动</View>
          </View>
          <View className="merchant_active_dec">
            店铺超限时特价活动 限时限量
          </View>
          {list.length === 6 && (
            <View
              className="active_go"
              onClick={() =>
                Router({
                  routerName: "special",
                  args: {
                    merchantId: merchantId,
                  },
                })
              }
            ></View>
          )}
        </View>
        <View className="merchant_newPrice">
          {list.length > 1 ? (
            <Waterfall
              list={list}
              createDom={shopDetails}
              setWidth={335}
              style={{ width: Taro.pxTransform(335) }}
            ></Waterfall>
          ) : (
            goodsCard(list[0])
          )}
        </View>
      </>
    );
  }
  return null;
};
