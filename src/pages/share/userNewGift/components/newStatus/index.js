import React from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
export default (props) => {
  return (
    <View className="userNewGift_box">
      <View className="userNewGift_status_box">
        <View
          className="userNewGift_btn public_center"
          onClick={() => {
            Router({
              routerName: "login",
            });
          }}
        >
          立即领取
        </View>
      </View>
    </View>
  );
};
