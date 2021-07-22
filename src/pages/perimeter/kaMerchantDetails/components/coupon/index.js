import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { coupon } from "@/components/componentView/CouponView";
import Router from "@/common/router";
export default ({ list, merchantGroupId }) => {
  if (list.length === 0) {
    return null;
  } else {
    return (
      <React.Fragment>
        <View className="kaMerchantDetails_active">
          <View className="kaMerchantDetails_active_title">
            <View className="kaMerchantDetails_active_iconBox active_icon1"></View>
            <View className="kaMerchantDetails_active_biaoti">品牌优惠</View>
          </View>
          <View className="kaMerchantDetails_active_dec">
            品牌超级优惠权益 到店消费直接抵扣
          </View>
          {list.length === 3 && (
            <View
              className="active_go"
              onClick={() =>
                Router({
                  routerName: "payCouponList",
                  args: {
                    merchantGroupId: merchantGroupId,
                  },
                })
              }
            ></View>
          )}
        </View>
        <View className="kaMerchantDetails_coupon_list">
          {list.map((item) => {
            return coupon(item);
          })}
        </View>
      </React.Fragment>
    );
  }
};
