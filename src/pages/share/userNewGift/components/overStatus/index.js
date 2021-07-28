import React from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import { scanCode } from "@/common/authority";
export default (props) => {
  return (
    <View className="userNewGift_box">
      <View className="userNewGift_status_box">
        <View
          className="userNewGift_btn public_center"
          onClick={() => scanCode()}
        >
          去扫码
        </View>
      </View>
    </View>
  );
};
