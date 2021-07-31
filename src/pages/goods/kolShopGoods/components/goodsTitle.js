import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import "./../index.scss";
import { filterPayStatus } from "@/common/utils";
export default (props) => {
  const { data, onOpen } = props;
  console.log(data);
  const [kolData, setKolData] = useState({});
  const { allowRefund } = kolData;
  useEffect(() => {
    if (data) {
      setKolData(data);
    }
  }, [data]);
  const filterImage = () => {
    if (kolData) {
      switch (kolData.status) {
        case "0":
          return "kolGoodsTitle_iconBox kolGoodsTitle_icon2";
        case "1":
          return "kolGoodsTitle_iconBox kolGoodsTitle_icon2";
        case "2":
          return "kolGoodsTitle_iconBox kolGoodsTitle_icon3";
        case "3":
          return "kolGoodsTitle_iconBox kolGoodsTitle_icon1";
        case "4":
          return "kolGoodsTitle_iconBox kolGoodsTitle_icon2";
        case "5":
          return "kolGoodsTitle_iconBox kolGoodsTitle_icon3";
        case "6":
          return "kolGoodsTitle_iconBox kolGoodsTitle_icon2";
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
          return "到店请出示核销码";
        case "2":
          return kolData.closeReason;
        case "3":
          return "商家已核销，订单已完成";
        case "6":
          return "申请退款中，请等待平台处理";
      }
    }
    return null;
  };

  return (
    <View className="kolGoodsTitle_top">
      <View className="kolGoodsTitle_pad">
        <View className="kolGoodsTitle_status">
          <View className={classNames(filterImage())}></View>
          <View className="kolGoodsTitle_font">
            {filterPayStatus(kolData.status)}
          </View>
        </View>
        <View className="kolGoodsTitle_dec">{filterDetails()}</View>
        {kolData.status === "1" && allowRefund === "1" ? (
          <View onClick={() => onOpen()} className="kol_noPrice color6 font20">
            申请退款
          </View>
        ) : null}
      </View>
    </View>
  );
};
