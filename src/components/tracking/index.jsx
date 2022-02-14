import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { loginStatus, fetchStorage, fakeStorage } from "@/utils/utils";
export default ({ children, type = "click", args = {}, name }) => {
  const handleOpen = () => {
    const prePageName =
      getCurrentPages()[getCurrentPages.length - 2] &&
      getCurrentPages()[getCurrentPages.length - 2].route;
    const pageName = getCurrentPages()[0].route || "";
    const { userIdString } = loginStatus() || {};
    const userData = {
      userId: userIdString,
      channel: "wechat",
      actionType: type,
      time: Date.parse(new Date()),
      extraPrams: JSON.stringify(args),
      actionName: name,
      prePageName: prePageName,
      pageName: pageName,
    };
    const list = fetchStorage("operatingLog") || [];
    list.push(userData);
    fakeStorage("operatingLog", list);
  };

  return (
    <View
      onClick={() => {
        handleOpen();
      }}
    >
      {children}
    </View>
  );
};
