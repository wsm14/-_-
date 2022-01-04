import React from "react";
import { View, Text, Input } from "@tarojs/components";
import { filterWeek } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default ({ changeLabel }) => {
  return (
    <>
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
      <View className="order_input">
        <View className="order_input_label">备注</View>
        <View className="order_input_body">
          <Input
            onBlur={(e) => {
              changeLabel(e.detail.value);
            }}
            placeholder="填写购买的商品备注信息，如尺码规格等（选填）"
          ></Input>
        </View>
      </View>
    </>
  );
};
