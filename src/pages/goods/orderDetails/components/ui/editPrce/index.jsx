import React, { useEffect } from "react";
import { Text, View } from "@tarojs/components";
import "./index.scss";
export default (props) => {
  const { data } = props;
  const { status } = data;
  if (status === "6") {
    return (
      <View className="kolGoods_details_refund">
        <View className="refund_top">
          <View className="refund_top_box">
            <View className="refund_icon_box public_center refund_icon_margin1">
              <View className="refund_icon refund_icon1"></View>
            </View>
            <View className="refund_icon_liner1 refund_icon_margin2"></View>
            <View className="refund_icon_box public_center refund_icon_margin3">
              <View className="refund_icon refund_icon2"></View>
            </View>
            <View className="refund_icon_liner2 refund_icon_margin4"></View>
            <View className="refund_icon_box refund_icon_bgColor public_center refund_icon_margin5">
              <View className="refund_icon refund_icon3"></View>
            </View>
          </View>
          <View className="refund_top_font public_auto">
            <View className="color4 font24">退款申请</View>
            <View className="color4 font24">退款处理中</View>
            <View className="color1 font24">退款完成</View>
          </View>
          <View className="refund_top_liner"></View>
        </View>
        <View className="refund_text color2 font24">
          若超过7日内未处理，默认同意退款
        </View>
      </View>
    );
  } else {
    return null;
  }
};
