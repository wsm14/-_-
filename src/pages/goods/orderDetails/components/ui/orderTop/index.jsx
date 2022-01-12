import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import { filterPayStatus } from "@/utils/utils";
import Draw from "./components/drawback";
import { fakeUpdateOrder } from "@/server/goods";
import "./index.scss";
export default (props) => {
  const { data, reload } = props;
  const [visible, setVisible] = useState(false);
  const { status, closeReason, orderSn, allowRefund } = data;
  const updateOrder = (str) => {
    if (str) {
      setVisible(() => {
        fakeUpdateOrder({
          orderSn: orderSn,
          status: "6",
          refundReason: str,
        }).then((val) => {
          reload();
        });
        return false;
      });
    } else {
      toast("请选择退款原因");
    }
  };

  const filterImage = () => {
    if (data) {
      switch (status) {
        case "0":
          return "orderDetails_iconBox orderDetails_icon2";
        case "1":
          return "orderDetails_iconBox orderDetails_icon2";
        case "2":
          return "orderDetails_iconBox orderDetails_icon3";
        case "3":
          return "orderDetails_iconBox orderDetails_icon1";
        case "4":
          return "orderDetails_iconBox orderDetails_icon2";
        case "5":
          return "orderDetails_iconBox orderDetails_icon3";
        case "6":
          return "orderDetails_iconBox orderDetails_icon2";
      }
    }
    return null;
  };

  const filterDetails = () => {
    if (data) {
      switch (status) {
        case "0":
          return "请在5分钟内进行付款，超时订单将自动关闭";
        case "1":
          return "到店请出示核销码";
        case "2":
          return closeReason;
        case "3":
          return "商家已核销，订单已完成";
        case "6":
          return "申请退款中，请等待平台处理";
      }
    }
    return null;
  };

  return (
    <>
      <View className="orderDetails_top">
        <View className="orderDetails_pad">
          <View className="orderDetails_status">
            <View className={classNames(filterImage())}></View>
            <View className="orderDetails_font">{filterPayStatus(status)}</View>
          </View>
          <View className="orderDetails_dec">{filterDetails()}</View>
          {status === "1" && allowRefund === "1" ? (
            <View
              onClick={() => setVisible(true)}
              className="orderDetails_noPrice color6 font20"
            >
              申请退款
            </View>
          ) : null}
        </View>
      </View>
      {visible && (
        <Draw cancel={updateOrder} close={() => setVisible(false)}></Draw>
      )}
    </>
  );
};
