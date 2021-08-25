import React from "react";
import { View } from "@tarojs/components";
import { fetchStorage } from "@/common/utils";
import "./index.scss";

/**
 * 一键开团 头部
 */
export default () => {
  const userInfo = fetchStorage("userInfo") || {};

  return (
    <View className="user_content">
      <View
        onClick={() => goUser()}
        className="user_avatar dakale_profile"
        style={{
          background: userInfo.profile
            ? `url(${userInfo.profile}) no-repeat center/cover`
            : "",
        }}
      ></View>
      <View className="user_name">{`${userInfo.username || ""}团购`}</View>
    </View>
  );
};
