import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { coupon } from "@/components/public_ui/CouponView";
export default ({ data, list }) => {
  const { merchantId } = data;
  if (list.length > 0) {
    return (
      <>
        {list.length > 0 && (
          <React.Fragment>
            <View
              onClick={() =>
                Router({
                  routerName: "payCouponList",
                  args: {
                    merchantId: merchantId,
                  },
                })
              }
              className="merchant_active"
            >
              <View className="merchant_active_title">
                <View className="merchant_active_iconBox active_icon1"></View>
                <View className="merchant_active_biaoti">到店优惠</View>
              </View>
              <View className="merchant_active_dec">
                店铺超级优惠权益 到店消费直接抵扣
              </View>
              <View className="active_go"></View>
            </View>

            {list.map((item) => {
              return coupon(item);
            })}
          </React.Fragment>
        )}
      </>
    );
  }
  return null;
};
