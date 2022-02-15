import React from "react";
import { View } from "@tarojs/components";
import FooterFixed from "@/components/FooterFixed";
import Tarking from "@/components/tracking";
import "./index.scss";

export default (props) => {
  const { computedPrice, submit, payFlag = true, data } = props;
  return (
    <FooterFixed>
      <View className="order_details_btn">
        <View className="order_details_payLabel">
          <View className="color1 font28 bold">实付:</View>
          <View className="color3 font24">¥</View>
          <View className="color3 font48 bold">{computedPrice()}</View>
        </View>
        <Tarking name={"favourOrder"} args={data}>
          <View
            className={`order_details_button public_center`}
            style={{ opacity: payFlag ? 1 : 0.4 }}
            onClick={() => {
              payFlag && submit();
            }}
          >
            立即支付
          </View>
        </Tarking>
      </View>
    </FooterFixed>
  );
};
