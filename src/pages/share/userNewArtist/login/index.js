import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./../index.scss";
export default (props) => {
  const { data, show } = props;
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
        className="login_Box_father"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <View className='login_Box_content'>
          <View className='login_Box_loginImg'></View>
          <View className='login_Box_loginBody'>
            <View className='login_Box_title'>哒卡乐</View>
            <View className='login_Box_message'>该小程序获得以下授权：</View>
            <View className='login_Box_phone'>获取您的手机号，以享受更多优惠</View>
            <View className='login_Box_btn'>授权登录</View>
          </View>
        </View>
      </View>
    );
  };

  if (show) {
    return template();
  }
  else {
    return null
  }

};
