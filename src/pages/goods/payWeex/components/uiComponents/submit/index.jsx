import React from "react";
import { View, Text } from "@tarojs/components";
import Tarking from "@/components/tracking";
import "./index.scss";
export default (props) => {
  const { data, onChange } = props;
  const { payFee } = data;
  return (
    <View className="payWeex_submit_box public_center">
      <Tarking args={data} name={"payWeex"}>
        <View className="payWeex_submit public_center" onClick={onChange}>
          微信支付 ¥{payFee}
        </View>
      </Tarking>
    </View>
  );
};
