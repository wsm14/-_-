import React, { useMemo, useState } from "react";
import { useRouter } from "@tarojs/taro";
import Router from "@/common/router";
import { handleOrdertools } from "@/relay/common/hooks";
import { View } from "@tarojs/components";
import FooterFixed from "@/relay/components/FooterFixed";

export default (props) => {
  const { submit, data, count, getDetail } = props;
  const { communityOrganizationGoodsList = [{}] } = data;
  const { price = 0 } = communityOrganizationGoodsList[0];
  console.log(data);
  // 路由获取参数
  const routeParams = useRouter().params;
  const { mode = "buy", settleAmount, viewCount } = routeParams;

  return (
    <>
      {mode === "buy" ? (
        <View className="community_payCard_box" onClick={() => submit()}>
          <View className="community_payCard_goods">
            <View className="community_payCard_goodsIcon"></View>
            <View className="community_payCard_goodsText">订单</View>
          </View>
          <View className="community_payCard_btn public_center">
            跟团购买 ￥{((price || 0) * count).toFixed(2)}
          </View>
        </View>
      ) : (
        <FooterFixed>
          <View className="community_manage_tools">
            <View className="community_manage_group">
              <View
                className="community_manage_cell"
                onClick={(e) => {
                  e.stopPropagation();
                  Router({
                    routerName: "groupOrderManage",
                    args: {
                      communityOrganizationId: data.communityOrganizationId,
                    },
                  });
                }}
              >
                <View className="community_manage_i_order"></View>
                <View className="community_manage_name">订单管理</View>
              </View>
              <View
                className="community_manage_cell"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrdertools(data, getDetail);
                }}
              >
                <View className="community_manage_i_order"></View>
                <View className="community_manage_name">团管理</View>
              </View>
              <View className="community_manage_cell">
                <View className="community_manage_price">
                  {settleAmount || 0}
                </View>
                <View className="community_manage_name">
                  {viewCount || 0}人来过
                </View>
              </View>
            </View>
            <View className="community_manage_share"></View>
          </View>
        </FooterFixed>
      )}
    </>
  );
};
