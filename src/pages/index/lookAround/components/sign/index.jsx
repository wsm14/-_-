/*签到引导*/
import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Router from "@/utils/router";
import "./index.scss";
export default ({}) => {
  return (
    <View className="lookAround_sign_box">
      <View className="lookAround_sign_content">
        <View className="lookAround_sign_name">签到领卡豆</View>
        <View
          className="lookAround_sign_desc"
          onClick={() =>
            Router({
              routerName: "sign",
            })
          }
        >
          卡豆天天领，坚持有惊喜
        </View>
      </View>
    </View>
  );
};
