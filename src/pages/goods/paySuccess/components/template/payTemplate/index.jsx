import React from "react";
import { View } from "@tarojs/components";
import PayTop from "./../../uiComponents/payTitle";
import PayCode from "./../../uiComponents/payCode";

export default (props) => {
  return (
    <View className="pay_details_payDetails">
      <PayTop {...props}></PayTop>
      <PayCode {...props}></PayCode>
    </View>
  );
};
