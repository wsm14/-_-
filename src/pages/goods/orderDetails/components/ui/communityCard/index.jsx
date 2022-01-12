import React, { useEffect } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { toast, backgroundObj } from "@/utils/utils";
import "./index.scss";
export default (props) => {
  const { data = {} } = props;
  let {
    orderSn,
    payType,
    payTime,
    orderType,
    orderDesc = "",
    closeReason,
    closeTime,
    createTime,
    status = 0,
    communityOrganizationGoods = {},
  } = data;
  const { payUserProfile, payUsername } = communityOrganizationGoods;
  const templateList = {
    0: [
      { label: "创建时间", value: createTime },
      {
        label: "订单号码",
        value: orderSn,
        fn: () => {
          setClipboard(orderSn);
        },
      },
      { label: "创建时间", value: createTime },
    ],
    1: [
      {
        label: "订单号码",
        value: orderSn,
        fn: () => {
          setClipboard(orderSn);
        },
      },
      { label: "创建时间", value: createTime },
      { label: "支付时间", value: payTime },
    ],
    2: [
      {
        label: "订单号码",
        value: orderSn,
        fn: () => {
          setClipboard(orderSn);
        },
      },
      { label: "创建时间", value: createTime },
      { label: "支付时间", value: payTime },
      { label: "关闭时间", value: closeTime },
      { label: "关闭原因", value: closeReason },
    ],

    3: [
      {
        label: "订单号码",
        value: orderSn,
        fn: () => {
          setClipboard(orderSn);
        },
      },
      { label: "创建时间", value: createTime },
      { label: "支付时间", value: payTime },
    ],
  }[status];
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
  return (
    <View className="commerceCard_box">
      <View className="goods_card">
        <View className="goods_cardBox">
          <View className="font32 color1 bold">订单信息</View>
          <View className="font24 public_auto goods_cardHeight">
            <View className="color2">支付方式</View>
            <View className="font24 public_center">
              <View
                className="payProfile"
                style={backgroundObj(payUserProfile)}
              ></View>
              <View className="font24 color1">{payUsername}</View>
            </View>
          </View>
          {templateList.map((item) => {
            const { value, fn, label } = item;
            if (value) {
              if (fn) {
                return (
                  <View className="font24 public_auto goods_cardHeight">
                    <View className="color2">{label}</View>
                    <View
                      className="font24 public_center"
                      onClick={() => {
                        fn && fn();
                      }}
                    >
                      <Text className="color1">{value}</Text>
                      <Text className="goods_cardliner"></Text>
                      <Text className="color4">复制</Text>
                    </View>
                  </View>
                );
              } else {
                return (
                  <View className="font24 public_auto goods_cardHeight">
                    <View className="color2">{label}</View>
                    <View className="color1 font_hide goods_max"> {value}</View>
                  </View>
                );
              }
            }
            return null;
          })}
        </View>
      </View>
    </View>
  );
};
