import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import Taro from "@tarojs/taro";
import { toast } from "@/utils/utils";

export default (props) => {
  const { data = {} } = props;
  const {
    status,
    createTime,
    paySn,
    payType,
    payTime,
    orderSn,
    verificationTime,
    closeTime,
    closeReason,
    goodsName,
  } = data;
  const filterStyle = (str) => {
    switch (str) {
      case "wx_lite":
        return "微信支付";
      case "alipay":
        return "支付宝支付";
      case "beanPay":
        return "卡豆支付";
    }
  };
  const setClipboard = (str) => {
    Taro.setClipboardData({
      data: str,
      success: function (res) {
        toast("已复制");
      },
      fail: function (res) {
        toast("复制失败");
      },
    });
  };
  const templateList = {
    3: [
      {
        label: "订单号码",
        value: orderSn,
        fn: () => {
          setClipboard(orderSn);
        },
      },
      { label: "支付方式", value: filterStyle(payType), type: "pay" },
      { label: "创建时间", value: createTime },
      { label: "支付时间", value: payTime },
    ],
  }[status];

  return (
    <View className="kolGoods_card">
      <View className="kolGoods_cardBox">
        <View className="font32 color1 bold">订单信息</View>
        {templateList.map((item) => {
          const { label, value, fn, type } = item;
          if (type && value) {
            return (
              <View className="font24 public_auto kolGoods_payHeight">
                <View className="color2">{label}</View>
                <View className="color1 public_center">
                  {payType !== "beanPay" && (
                    <View
                      className={classNames(
                        "pay_icon_box",
                        payType === "wx_lite" && "wPay",
                        payType === "alipay" && "zPay"
                      )}
                    ></View>
                  )}
                  <View>{filterStyle(payType)}</View>
                </View>
              </View>
            );
          } else if (fn) {
            return (
              <View className="font24 public_auto kolGoods_cardHeight">
                <View className="color2">{label}</View>
                <View
                  className="font24 public_center"
                  onClick={() => setClipboard(value)}
                >
                  <Text className="color1">{value}</Text>
                  <Text className="kolGoods_cardliner"></Text>
                  <Text className="color4">复制</Text>
                </View>
              </View>
            );
          } else {
            return (
              <View className="font24 public_auto kolGoods_cardHeight">
                <View className="color2">{label}</View>
                <View className="color1"> {value}</View>
              </View>
            );
          }
        })}
      </View>
    </View>
  );
};
