import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import { filterPayStatus } from "@/common/utils";
import InterTime from "@/components/InterTime";
export default (props) => {
  const { data, upDateStatus } = props;
  const { status, closeReason, createTime } = data;
  const filterImage = () => {
    if (status) {
      switch (status) {
        case "0":
          return "order_detailsPage_iconBox order_detailsPage_icon2";
        case "1":
          return "order_detailsPage_iconBox order_detailsPage_icon2";
        case "2":
          return "order_detailsPage_iconBox order_detailsPage_icon3";
        case "3":
          return "order_detailsPage_iconBox order_detailsPage_icon1";
        case "4":
          return "order_detailsPage_iconBox order_detailsPage_icon2";
        case "5":
          return "order_detailsPage_iconBox order_detailsPage_icon3";
        case "6":
          return "order_detailsPage_iconBox order_detailsPage_icon2";
      }
    }
    return null;
  };

  const filterDetails = () => {
    if (data) {
      switch (status) {
        case "0":
          return (
            <View>
              请在{" "}
              <InterTime
                fn={() => {
                  upDateStatus();
                }}
                times={createTime}
              ></InterTime>
              内进行付款，超时订单将自动关闭
            </View>
          );
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
    <View className="order_detailsPage_top">
      <View className="order_detailsPage_pad">
        <View className="order_detailsPage_status">
          <View className={classNames(filterImage())}></View>
          <View className="order_detailsPage_font">
            {filterPayStatus(status)}
          </View>
        </View>
        <View className="order_detailsPage_dec">{filterDetails()}</View>
      </View>
    </View>
  );
};
