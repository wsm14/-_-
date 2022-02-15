/*
  children 要记录埋点事件的按钮 note
  type 埋点类型 String
  args 携带埋点参数 object
  name 按钮映射的标注  
*/
import React from "react";
import Taro, { getCurrentPages } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { loginStatus, fetchStorage, fakeStorage } from "@/utils/utils";
export default ({ children, type = "click", args = {}, name, style }) => {
  const handleOpen = () => {
    const pageName = getCurrentPages()[getCurrentPages().length - 1].route;
    const { userIdString } = loginStatus() || {};
    const userData = {
      userId: userIdString,
      channel: "wechat",
      actionType: type,
      time: Date.parse(new Date()),
      extraParams: JSON.stringify(args),
      actionName: name,
      pageName: pageName,
    };
    const list = fetchStorage("operatingLog") || [];
    list.push(userData);
    fakeStorage("operatingLog", list);
  };
  //埋点执行函数
  return (
    <View
      style={style}
      onClick={() => {
        handleOpen();
      }}
    >
      {children}
    </View>
  );
};
