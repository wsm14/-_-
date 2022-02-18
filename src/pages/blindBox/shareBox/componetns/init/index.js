import React, { Component, useEffect } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";

export default (props) => {
  const { initFn, auth } = props;
  useEffect(() => {
    if (auth !== 0) {
      initFn && initFn();
    }
  }, [auth]);
  return null;
};
