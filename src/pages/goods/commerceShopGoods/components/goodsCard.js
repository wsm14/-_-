import React, { useEffect } from "react";
import { Text, View } from "@tarojs/components";
import "./../index.scss";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { toast } from "@/common/utils";
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
    orderLogistics,
  } = data;
  orderDesc = JSON.parse(orderDesc);
  const { commerceGoods = {} } = orderDesc;
  const { goodsName, remake = "" } = commerceGoods;
  const { deliveryTime = "", logisticsCode, logisticsCompany } = orderLogistics;
  const templateList = {
    0: [
      { label: "商品", value: goodsName },
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
      { label: "商品", value: goodsName },
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
      { label: "商品", value: goodsName },
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
      { label: "关闭原因", closeReason },
    ],

    3: [
      { label: "商品", value: goodsName },
      {
        label: "订单号码",
        value: orderSn,
        fn: () => {
          setClipboard(orderSn);
        },
      },
      { label: "创建时间", value: createTime },
      { label: "支付时间", value: payTime },
      { label: "完成时间", value: deliveryTime },
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
    <View>
      <View className="goods_card">
        <View className="goods_cardBox">
          <View className="font32 color1 bold">订单信息</View>
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
                    <View className="color1"> {value}</View>
                  </View>
                );
              }
            }
            return null;
          })}
        </View>
      </View>
      <View className="goods_card">
        <View className="goods_cardBox">
          <View className="font32 color1 bold">订单备注</View>
          <View className="goods_remark">
            <Text className="color2">备注信息</Text>
            {" " + remake}
          </View>
        </View>
      </View>
      <View className="goods_card">
        <View className="goods_cardBox">
          <View className="font32 color1 bold">物流信息</View>
          <View className="font24 public_auto goods_cardHeight">
            <View className="color2">物流公司</View>
            <View className="color1"> {logisticsCompany || "--"}</View>
          </View>
          <View className="font24 public_auto goods_cardHeight">
            <View className="color2">物流编号</View>
            <View
              className="font24 public_center"
              onClick={() => {
                logisticsCode && setClipboard(logisticsCode);
              }}
            >
              <Text className="color1"> {logisticsCode || "--"}</Text>
              {logisticsCode && (
                <React.Fragment>
                  <Text className="goods_cardliner"></Text>
                  <Text className="color4">复制</Text>
                </React.Fragment>
              )}
            </View>
          </View>
        </View>
      </View>
      <View className="commerOrder_pay_info">
        <View className="commerOrder_pay_title">购买须知</View>
        <View className="commerOrder_pay_desc">
          1. 商品将在用户下单后的7天内发货，具体发货物流以订单中的信息为准；
        </View>
        <View className="commerOrder_pay_desc">
          2. 请仔细填写收货信息，以防导致地址错误，快递丢失；
        </View>
        <View className="commerOrder_pay_desc">
          3. 如有其他疑问，请联系客服400-800-5881。
        </View>
      </View>
    </View>
  );
};
