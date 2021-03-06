import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/utils/router";
import "./../index.scss";
export default (props) => {
  const { data, proxy, player, setPlayer, initVideo, auth } = props;
  const [showStatus, setShowStatus] = useState(0);
  const [animate, setAnimated] = useState(null);
  const { beanAmount, guideMomentFlag } = data;
  useEffect(() => {
    if (proxy && auth !== 0) {
      if (
        ((!Taro.getStorageSync("login") || guideMomentFlag === "1") &&
          showStatus !== null &&
          !Taro.getStorageSync("userInfo")) ||
        guideMomentFlag === "1"
      ) {
        animated();
      }
    }
  }, [proxy, auth]);
  const onClose = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      setShowStatus(null);
      Taro.setStorageSync("login", true);
      setPlayer(true);
    }, 300);
  };
  const animated = () => {
    let animateTem = Taro.createAnimation({
      duration: 10,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    let animateTem1 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem.scale(0, 0).step();
    setAnimated(animateTem.export());
    setTimeout(() => {
      animateTem1.scale(1, 1).step();
      setAnimated(animateTem1);
      setPlayer(false);
    }, 300);
  };
  const login = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      setShowStatus(null);
      Taro.setStorageSync("login", true);
      setPlayer(true);
      Router({
        routerName: "login",
      });
    }, 300);
  };

  /* ??????????????????  */

  const template = () => {
    return (
      <View
        animation={animate}
        className="guide_Box_father"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <View className="guide_Box">
          <View className="guide_image">
            <View className="guide_font1"></View>
            <View className="guide_font1_1">?????????</View>
            <View className="guide_font2 public_center">
              <View className="guide_bean_icon"></View>
              <View className="guide_num_icon"></View>
              <View className="guide_num">{beanAmount}</View>
            </View>
            <View className="guide_font3">????????????</View>
            <View
              className="guide_font4 public_center"
              onClick={() => {
                login();
              }}
            >
              ??????????????????
            </View>
          </View>
          <View className="guide_Box_close"></View>
        </View>
      </View>
    );
  };
  if (
    (Taro.getStorageSync("login") && guideMomentFlag !== "1") ||
    showStatus === null ||
    animate === null ||
    (Taro.getStorageSync("userInfo") && guideMomentFlag !== "1")
  ) {
    return null;
  } else {
    return template();
  }
};
