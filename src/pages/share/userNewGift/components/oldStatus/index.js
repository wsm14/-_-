import React from "react";
import { View } from "@tarojs/components";
import { scanCode } from "@/common/authority";
import Router from "@/common/router";
export default (props) => {
  return (
    <View className="userNewGift_box">
      <View className="userNewGift_status_box2">
        <View className="userNewGift_info_btnBox public_auto">
          <View
            className="userNewGift_info_btn public_center"
            onClick={() => {
              Router({
                routerName: "home",
                type: "switchTab",
              });
            }}
          >
            去领5元
          </View>
          <View
            className="userNewGift_info_btn public_center"
            onClick={() => scanCode()}
          >
            去扫码
          </View>
        </View>
      </View>
    </View>
  );
};
