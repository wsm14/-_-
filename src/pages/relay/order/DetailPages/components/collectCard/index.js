import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { ScrollView, Text, View } from "@tarojs/components";
import { GOODS_BY_TYPE } from "@/relay/common/constant";
import { backgroundObj, toast } from "@/common/utils";
import Router from "@/common/router";
export default (props) => {
  const { data = {}, shareInfo, fetchOrderQcode } = props;
  const { communityOrganizationGoods = {} } = data;
  const { communityOrganizationId, relateOwnerId } = communityOrganizationGoods;
  const list = [
    {
      name: "申请退款",
      fn: () => {
        Taro.makePhoneCall({
          phoneNumber: "4008005881",
          fail: (res) => {
            toast("拨打失败，请手动联系400-800-5881");
          },
          complete: (res) => {},
        });
      },
      icon: "detailPges_order_collecIconStyle1",
    },
    {
      name: "联系团长",
      fn: () => {
        Taro.makePhoneCall({
          phoneNumber: "4008005881",
          fail: (res) => {
            toast("拨打失败，请手动联系400-800-5881");
          },
          complete: (res) => {},
        });
      },
      icon: "detailPges_order_collecIconStyle2",
    },
    {
      name: "分享",
      fn: () => {
        shareInfo({
          communityOrganizationId,
          ownerId: relateOwnerId,
        });
      },
      icon: "detailPges_order_collecIconStyle3",
    },
    {
      name: "再来1单",
      fn: () => {
        Router({
          routerName: "communityGoods",
          args: {
            ownerId: relateOwnerId,
            communityOrganizationId,
          },
        });
      },
      icon: "detailPges_order_collecIconStyle4",
    },
  ];

  return (
    <View className="detailPges_order_collect">
      {list.map((item) => {
        return (
          <View
            className="detailPges_order_collectList"
            onClick={() => {
              item.fn && item.fn();
            }}
          >
            <View
              className={`detailPges_order_collecIconBox ${item.icon}`}
            ></View>
            <View className="detailPges_order_collectText">{item.name}</View>
          </View>
        );
      })}
    </View>
  );
};
