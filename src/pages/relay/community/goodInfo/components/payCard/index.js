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

  // 路由获取参数
  const routeParams = useRouter().params;
  const { mode = "buy", settleAmount, viewCount } = routeParams;

  const toolsArr = [
    {
      name: "订单管理",
      icon: <View className="community_manage_i_order"></View>,
      onClick: (e) => {
        e.stopPropagation();
        Router({
          routerName: "groupOrderManage",
          args: {
            communityOrganizationId: data.communityOrganizationId,
          },
        });
      },
    },
    {
      name: "团管理",
      icon: <View className="community_manage_i_order"></View>,
      onClick: (e) => {
        e.stopPropagation();
        handleOrdertools(data, getDetail);
      },
    },
    {
      name: `${viewCount || 0}人来过`,
      icon: <View className="community_manage_price">{settleAmount || 0}</View>,
    },
  ];

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
              {toolsArr.map((item) => (
                <View className="community_manage_cell" onClick={item.onClick}>
                  {item.icon}
                  <View className="community_manage_name"> {item.name}</View>
                </View>
              ))}
            </View>
            <View className="community_manage_share"></View>
          </View>
        </FooterFixed>
      )}
    </>
  );
};
