import React from "react";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import { View } from "@tarojs/components";
import { toast } from "@/common/utils";
import { fetchOrderClose } from "@/server/relay";
import "./index.scss";

export default ({ data = {} }) => {
  const { orderSn } = data;

  const toolsArr = [
    {
      name: "订单详情",
      show: true,
      onClick: (e) => {
        e.stopPropagation();
        Router({
          routerName: "orderDetails",
          args: { orderSn },
        });
      },
    },
    {
      name: "退款",
      show: false,
      onClick: (e) => {
        e.stopPropagation();
        Taro.showModal({
          confirmText: "确定",
          confirmColor: "#07c0c2",
          content: `确认退款该订单？`,
          success: function (res) {
            if (res.confirm) {
              // fetchOrderClose({ orderSn, status: "2" }, () => {
              //   toast("退款成功");
              // });
            }
          },
        });
      },
    },
  ];
  return (
    <View className="order_mag_footer">
      {toolsArr.map(
        (i) =>
          i.show && (
            <View className={`order_mag_tools`} onClick={i.onClick}>
              {i.name}
            </View>
          )
      )}
    </View>
  );
};
