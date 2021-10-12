import React from "react";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import { View } from "@tarojs/components";
import { toast } from "@/common/utils";
import { fetchOrderClose } from "@/server/relay";
import "./index.scss";

export default ({ data }) => {
  const {
    orderSn,
    payFee,
    organizationGoodsOrderDescObject: { communityOrganizationId, ownerId },
    status,
  } = data;
  const toolsArr = [
    {
      name: "关闭订单",
      show: status == 0,
      onClick: (e) => {
        e.stopPropagation();
        Taro.showModal({
          confirmText: "确定",
          confirmColor: "#07c0c2",
          content: `确认关闭订单？`,
          success: function (res) {
            if (res.confirm) {
              fetchOrderClose({ orderSn, status: "2" }, () => {
                toast("关闭订单成功");
              });
            }
          },
        });
      },
    },
    {
      name: `去支付 ￥${payFee}`,
      class: "sumbit_tools",
      show: status == 0,
      onClick: (e) => {
        e.stopPropagation();
        Router({
          routerName: "orderDetails",
          args: { orderSn },
        });
      },
    },
    {
      name: "在来一单",
      show: status != 0 && communityOrganizationId && ownerId,
      class: "sumbit_tools",
      onClick: (e) => {
        e.stopPropagation();
        Router({
          routerName: "communityGoods",
          args: { communityOrganizationId, ownerId },
        });
      },
    },
  ];
  return (
    <View className="order_footer">
      {toolsArr.map(
        (i) =>
          i.show && (
            <View className={`order_tools ${i.class}`} onClick={i.onClick}>
              {i.name}
            </View>
          )
      )}
    </View>
  );
};