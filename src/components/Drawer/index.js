import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getShareInfo } from "@/server/user";
import { getUserMomentcheckNew } from "@/server/share";
import Router from "@/common/router";
import "./index.scss";
export default ({ show, children, close, closeBtn = true }) => {
  const [animate, setAnimated] = useState(null);
  useEffect(() => {
    if (show) {
      animated();
    } else {
    }
  }, [show]);
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
      close();
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
  /* 显示隐藏动画  */

  return (
    <View
      animation={animate}
      className="Drawer_box"
      catchMove
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <View
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
        {closeBtn && (
          <View className="Drawer_close_box" onClick={() => onClose()}></View>
        )}
      </View>
    </View>
  );
};
