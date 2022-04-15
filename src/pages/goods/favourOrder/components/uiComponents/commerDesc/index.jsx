import React from "react";
import { View, Input } from "@tarojs/components";
import "./index.scss";

export default ({ changeLabel }) => {
  return (
    <>
      <View className="commerOrder_pay_info">
        <View className="commerOrder_pay_title">购买须知</View>
        <View className="commerOrder_pay_desc">
          1.商品将在用户下单后的7天内发货
        </View>
        <View className="commerOrder_pay_desc">
          2.若该商品为“拼团”活动商品，则该商品不支持使用卡豆抵扣；可前往“拼好货”参与活动并购买商品；
        </View>
        <View className="commerOrder_pay_desc">
          3.拼团商品不支持退款退货，若因商品质量问题，可联系客服进行换货处理，若收货时间超过14天则需要自行支付邮费。
        </View>
        <View className="commerOrder_pay_desc">
          4. 请仔细填写收货信息，以防导致地址错误，快递丢失；
        </View>
        <View className="commerOrder_pay_desc">
          5. 如有其他疑问，请联系客服400-800-5881；
        </View>
        <View className="commerOrder_pay_desc">
          注：若因疫情等不可抗力原因导致发货延迟，发货时间将会顺延。可联系客服获取最新发货信息
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
