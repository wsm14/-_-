import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { getLat, getLnt, loginStatus, toast } from "@/common/utils";
import Router from "@/common/router";
import { getUserMomentcheckNew, saveNewUserBean } from "@/server/share";
import { View, Text, Image } from "@tarojs/components";
export default ({
  auth,
  shareInfo,
  onRouterInit,
  locationStatus,
  setLocation,
}) => {
  console.log(locationStatus);
  const [beanInfo, setBeanInfo] = useState({
    newUserFlag: "0",
  });
  useEffect(() => {
    if (auth !== 0) {
      getUserMomentcheckNew({
        newDeviceFlag: Taro.getStorageSync("newDeviceFlag") || "1",
      }).then((val) => {
        const { newUserFlag = "1" } = val;
        setBeanInfo({
          newUserFlag,
        });
      });
    }
  }, [auth]);
  useEffect(() => {
    if (locationStatus) {
      setLocation();
    }
  }, [locationStatus]);
  const { newUserFlag } = beanInfo;
  const fakeNewUserBean = () => {
    if (loginStatus()) {
      saveNewUserBean({}).then((val) => {
        setBeanInfo({
          newUserFlag: "0",
        });
        toast("领取成功，已自动存入卡豆余额");
        fakeStorage("deviceFlag", "0");
      });
    } else {
      Router({
        routerName: "login",
      });
    }
  };
  return (
    <View className="mainScene_top">
      <View className="mainScene_bg_box">
        <Image
          className="mainScene_image"
          lazyLoad
          mode={"aspectFill"}
          src={
            "https://wechat-config.dakale.net/miniprogram/active/midautumn/midautumn_1.png"
          }
        ></Image>
        <View
          className="mainScene_bg_rule public_center"
          onClick={onRouterInit}
        >
          活动规则
        </View>
        <View className="mainScene_bg_share public_center" onClick={shareInfo}>
          分享
        </View>
      </View>
      <View className="mainScene_btn_box">
        {newUserFlag !== "0" ? (
          <View className="mainScene_btn_box" onClick={fakeNewUserBean}>
            <Image
              className="mainScene_image"
              lazyLoad
              mode={"aspectFill"}
              src={
                "https://wechat-config.dakale.net/miniprogram/active/midautumn/midautumn_2.png"
              }
            ></Image>
            <Image
              className="mainScene_btn"
              lazyLoad
              mode={"aspectFill"}
              src={
                "https://wechat-config.dakale.net/miniprogram/active/midautumn/midautumn_btn.gif"
              }
            ></Image>
          </View>
        ) : (
          <View className="mainScene_btn_box">
            {" "}
            <Image
              className="mainScene_image"
              lazyLoad
              mode={"aspectFill"}
              src={
                "https://wechat-config.dakale.net/miniprogram/active/midautumn/midautumn_btnNo.png"
              }
            ></Image>
          </View>
        )}
      </View>
    </View>
  );
};
