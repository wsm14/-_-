import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./../index.scss";
export default (props) => {
  const { data, videoStop, proxy } = props;
  const [animate, setAnimated] = useState(null);
  const { beanAmount, guideMomentFlag } = data;
  useEffect(() => {

  }, [proxy]);
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
        className="noviceGuide_Box_father"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <View className="noviceGuide_Box">
          <View className="noviceGuide_image">
            <View className="noviceGuide_font1"></View>
            <View className="noviceGuide_font2 public_center">
              <View className="noviceGuide_bean_icon"></View>
              <View className="noviceGuide_num_icon"></View>
              <View className="noviceGuide_num">{beanAmount}</View>
            </View>
            <View className="noviceGuide_font3">等你领取</View>
            <View
              className="noviceGuide_font4 public_center"
              onClick={() => {
                login();
              }}
            >
              授权登录领取
            </View>
          </View>
          <View className="noviceGuide_Box_close"></View>
        </View>
      </View>
    );
  };

  return template();

};
