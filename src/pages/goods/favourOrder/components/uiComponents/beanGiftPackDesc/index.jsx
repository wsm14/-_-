import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

export default () => {
  return (
    <View className="commerOrder_pay_info">
      <View className="commerOrder_pay_title">购买须知</View>
      <View className="commerOrder_pay_desc">
        1.该礼包为平台创建，一经购买，不支持退款；
      </View>
      <View className="commerOrder_pay_desc">
        2.购买的券礼包具体规则在券包中查看；
      </View>
      <View className="commerOrder_pay_desc">
        3.有任何疑问联系哒卡乐客服400-800-5881。
      </View>
    </View>
  );
};
