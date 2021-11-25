import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import "./../index.scss";
import { filterPayStatus } from "@/common/utils";
export default (props) => {
  const { data } = props;
  console.log(data);
  const [kolData, setKolData] = useState({});
  useEffect(() => {
    if (data) {
      setKolData(data);
    }
  }, [data]);
  const filterImage = () => {
    if (kolData) {
      switch (kolData.status) {
        case "0":
          return "commerceTitle_iconBox commerceTitle_icon2";
        case "1":
          return "commerceTitle_iconBox commerceTitle_icon2";
        case "2":
          return "commerceTitle_iconBox commerceTitle_icon3";
        case "3":
          return "commerceTitle_iconBox commerceTitle_icon1";
        case "4":
          return "commerceTitle_iconBox commerceTitle_icon2";
        case "5":
          return "commerceTitle_iconBox commerceTitle_icon3";
        case "6":
          return "commerceTitle_iconBox commerceTitle_icon2";
      }
    }
    return null;
  };

  const filterDetails = () => {
    if (kolData) {
      switch (kolData.status) {
        case "0":
          return "请在5分钟内进行付款，超时订单将自动关闭";
        case "1":
          return "下单成功，等待发货（7个工作日内发货）";
        case "2":
          return kolData.closeReason;
        case "3":
          return "订单已完成";
        case "6":
          return "申请退款中，请等待平台处理";
      }
    }
    return null;
  };

  return (
    <View className="commerceTitle_top">
      <View className="commerceTitle_pad">
        <View className="commerceTitle_status">
          <View className={classNames(filterImage())}></View>
          <View className="commerceTitle_font">
            {filterPayStatus(kolData.status) === "待核销"
              ? "待发货"
              : filterPayStatus(kolData.status)}
          </View>
        </View>
        <View className="commerceTitle_dec">{filterDetails()}</View>
      </View>
    </View>
  );
};
