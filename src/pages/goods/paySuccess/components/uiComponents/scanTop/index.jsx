/*不待核销码的订单成功样式 如电商，扫码*/
import React from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Coupon from "./../coupon";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  const {
    payFee,
    totalFee,
    beanFee,
    deductFeeObject = [],
    orderType,
    orderDesc,
    orderSn,
  } = data;
  const formatTime = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return (
      month +
      "月" +
      day +
      "日  " +
      [hour, minute, second].map(formatNumber).join(":")
    );
  };
  const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : "0" + n;
  };
  return (
    <View className="code_scanPay_box">
      <View className="code_scanPay_top">
        <View className="code_scanPay_bg"></View>
        <View className="code_scanPay_payStatus font36">
          {formatTime(new Date())}
        </View>
        <View className="code_scanPay_payNum">
          <Text className="code_scanPay_icon  font36 bold color1">¥ </Text>
          <Text className="code_scanPay_font bold  color1">
            {" " + totalFee}
          </Text>
        </View>
        {orderType === "commerceGoods" && typeof orderDesc === "string" && (
          <View className="code_scanPay_decBox  code_scanPay_decMargin public_auto font24">
            <View className="color2">商品</View>
            <View className="color1 font_hide code_scanPay_Max">
              {JSON.parse(orderDesc).commerceGoods.goodsName}
            </View>
          </View>
        )}
        {orderType === "virtualProduct" && typeof orderDesc === "string" && (
          <View className="code_scanPay_decBox  code_scanPay_decMargin public_auto font24">
            <View className="color2">商品</View>
            <View className="color1">
              {totalFee}元手机话费-
              {JSON.parse(orderDesc).virtualProductAccount}
            </View>
          </View>
        )}
        <View className="code_scanPay_decBox  code_scanPay_decMargin1 public_auto font24">
          <View className="color2">实付金额</View>
          <View className="color1">{"¥  " + payFee}</View>
        </View>
        {beanFee ? (
          <View className="code_scanPay_decBox  code_scanPay_decMargin1 public_auto  font24">
            <View className="color2">卡豆优惠抵扣</View>
            <View className="color3">
              - {beanFee + `(¥ ${(Number(beanFee) / 100).toFixed(2)})`}
            </View>
          </View>
        ) : null}

        {deductFeeObject.length > 0 ? (
          <View className="code_scanPay_decBox  code_scanPay_decMargin1 public_auto  font24">
            <View className="color2">优惠券</View>
            <View className="color3">- {deductFeeObject[0].reduceFee}</View>
          </View>
        ) : null}
        <View className="code_scanPay_liner"></View>

        <View className="code_scanPay_btnBox">
          <View
            className="code_scanPay_btn btn_style1"
            onClick={() => {
              Router({
                routerName: "orderDetails",
                args: {
                  orderSn,
                },
              });
            }}
          >
            查看订单
          </View>
          <View
            className="code_scanPay_btn btn_style2"
            onClick={() =>
              Router({
                routerName: "nearVideo",
                args: {
                  type: "goods",
                },
              })
            }
          >
            天天捡卡豆
            <View className="btn_logo"></View>
          </View>
        </View>
        {beanFee ? (
          <View className="bean_order color1">
            <View className="bean_order_logo"></View>
            <View className="bean_order_bean">
              本单卡豆帮您节省
              <Text className="color3">
                ¥{(Number(beanFee) / 100).toFixed(2)}元
              </Text>
            </View>
            <View
              className="bean_order_link color3"
              onClick={() =>
                Router({
                  routerName: "nearVideo",
                  args: {
                    type: "goods",
                  },
                })
              }
            >
              继续捡豆
            </View>
          </View>
        ) : null}
        <Coupon data={data}></Coupon>
      </View>
    </View>
  );
};
