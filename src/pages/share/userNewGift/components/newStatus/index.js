import React, { useState } from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import LoginInit from "./../login";
export default (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <View className="userNewGift_box">
      <LoginInit
        show={visible}
        stopVideo={() => {}}
        close={() => setVisible(false)}
      ></LoginInit>
      <View className="userNewGift_status_box1">
        <View
          className="userNewGift_btn public_center"
          onClick={() => {
            setVisible(true);
          }}
        >
          立即领取
        </View>
      </View>
    </View>
  );
};
