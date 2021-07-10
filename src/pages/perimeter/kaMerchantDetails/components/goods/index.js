import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { goodsCard, shopDetails } from "@/components/publicShopStyle";
import { navigateTo } from "@/common/utils";
import Waterfall from "@/components/waterfall";
export default ({ list, merchantGroupId }) => {
  if (list.length === 0) {
    return null;
  } else {
    return (
      <>
        <View className="kaMerchantDetails_active">
          <View className="kaMerchantDetails_active_title">
            <View className="kaMerchantDetails_active_iconBox active_icon2"></View>
            <View className="kaMerchantDetails_active_biaoti">品牌特价</View>
          </View>
          <View className="kaMerchantDetails_active_dec">
            店铺超限时特价活动 限时限量
          </View>
          {list.length === 6 && (
            <View
              className="active_go"
              onClick={() =>
                navigateTo(
                  `/pages/perimeter/special/index?merchantGroupId=${merchantGroupId}`
                )
              }
            ></View>
          )}
        </View>
        <View className="kaMerchantDetails_newPrice">
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
};
