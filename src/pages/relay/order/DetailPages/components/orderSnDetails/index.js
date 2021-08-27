import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { ScrollView, Text, View } from "@tarojs/components";
import Router from "@/common/router";
import { backgroundObj } from "@/common/utils";

export default (props) => {
  const { data = {} } = props;
  const {
    orderSn,
    communityOrganizationGoods = {},
    payTime,
    createTime,
  } = data;
  const { payUserProfile, payUsername } = communityOrganizationGoods;
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
    <View className="detailPges_order_snBox">
      <View className="detailPges_order_snTitle public_auto">
        <View className="font32 color1 bold">订单信息</View>
        <View className="detailPges_order_snType2 color2 font24">
          生成核销码
        </View>
      </View>
      <View className="detailPges_order_content">
        <View className="detailPges_order_details">
          <View className="detailPges_order_snLeft color2">下单人</View>
          <View className="detailPges_order_snRight">
            <View
              className="detailPges_order_profile"
              style={backgroundObj(payUserProfile)}
            ></View>
            <View className="price_margin8 font24 color1">{payUsername}</View>
          </View>
        </View>
        <View className="detailPges_order_details">
          <View className="detailPges_order_snLeft color2">订单编号</View>
          <View
            className="detailPges_order_snRight font24 color1"
            onClick={() => setClipboard(orderSn)}
          >
            {orderSn}
            <Text className="detailPges_cardliner"></Text>
            <Text className="color4">复制</Text>
          </View>
        </View>
        {createTime && (
          <View className="detailPges_order_details">
            <View className="detailPges_order_snLeft color2">下单时间 </View>
            <View className="detailPges_order_snRight font24  color1">
              {createTime}
            </View>
          </View>
        )}
        {payTime && (
          <View className="detailPges_order_details">
            <View className="detailPges_order_snLeft color2">支付时间 </View>
            <View className="detailPges_order_snRight font24  color1">
              {payTime}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
