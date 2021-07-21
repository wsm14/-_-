import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import OldView from "./../oldStatus";
import NewView from "./../newStatus";
import OverStatus from "./../overStatus";
import SkeletonView from "./../SkeletonView";
export default ({ auth, userInfo = {} }) => {
  const [authInfo, setAuthInfo] = useState(null);
  useEffect(() => {
    if (auth === 1) {
      let userInfo = Taro.getStorageSync("userInfo");
      if (userInfo) {
        setAuthInfo("oldStatus");
      } else {
        setAuthInfo("newStatus");
      }
    }
  }, [auth]);
  useDidShow(() => {
    if (authInfo === "newStatus" && Taro.getStorageSync("userInfo")) {
      setAuthInfo("overStatus");
    }
  });
  const viewTemplate = {
    oldStatus: <OldView></OldView>,
    newStatus: <NewView></NewView>,
    overStatus: <OverStatus></OverStatus>,
  }[authInfo];
  if (viewTemplate) {
    return viewTemplate;
  } else {
    return <SkeletonView loading={authInfo === null}></SkeletonView>;
  }
};
