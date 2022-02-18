import React from "react";
import { View } from "@tarojs/components";
import ScanTop from "./../../uiComponents/scanTop";

export default (props) => {
  return (
    <View className="pay_details_payDetails">
      <ScanTop {...props}></ScanTop>
    </View>
  );
};
