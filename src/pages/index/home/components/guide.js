import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./../index.scss";
export default (props) => {
  const { data, current, interval, videoPlayer, videoStop, init } = props;
  const [showStatus, setShowStatus] = useState(0);
  const [animate, setAnimated] = useState(null);
  const { beanAmount } = data;
  useEffect(() => {
    if (!Taro.getStorageSync("login") && showStatus !== null) {
      videoStop();
      if (interval) {
        animated();
      }
    }
  }, [interval]);
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
      videoPlayer();
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
      videoPlayer();
      Router({
        routerName: "login",
      });
    }, 300);
  };

  /* 显示隐藏动画  */

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
            <View className="guide_font2 public_center">
              <View className="guide_bean_icon"></View>
              <View className="guide_num_icon"></View>
              <View className="guide_num">{beanAmount}</View>
            </View>
            <View className="guide_font3">等你领取</View>
            <View
              className="guide_font4 public_center"
              onClick={() => {
                login();
              }}
            >
              授权手机号领取
            </View>
          </View>
          <View className="guide_Box_close"></View>
        </View>
      </View>
    );
  };
  if (Taro.getStorageSync("login") || showStatus === null || animate === null) {
    return null;
  } else {
    return template();
  }
};
