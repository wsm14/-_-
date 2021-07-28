import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import "./index.scss";
export default (props) => {
  const { proxy, store, showNewsInfo, setPlayer } = props;
  const { setCount, activityStatus, needCountDown, dayCount } = store;
  const [animate, setAnimated] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showToastCount, setShowToastCount] = useState(0);
  useEffect(() => {
    if (setCount === 1 && proxy && showToastCount === 0) {
      if (activityStatus === "1") {
        animated();
      } else {
        showNewsInfo && showNewsInfo();
      }
    }
  }, [proxy, setCount]);

  /* 显示隐藏动画  */
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
      setVisible(false);
      setShowToastCount(1);
      showNewsInfo && showNewsInfo();
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
    setVisible(true);
    setTimeout(() => {
      animateTem1.scale(1, 1).step();
      setAnimated(animateTem1);
      setPlayer(false);
    }, 300);
  };
  const template = () => {
    return (
      <View
        animation={animate}
        className="activeToast_Box_father"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <View
          className="activeToast_Box"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View
            onClick={(e) => {
              e.stopPropagation();
              Router({
                routerName: "mainScene",
              });
            }}
            className="activeToast_image"
          >
            {needCountDown === "1" ? (
              <View className="activeToast_numInfo">
                <Text className="activeToast_numfont1">活动倒计时</Text>
                <Text className="activeToast_numfont2">{dayCount}</Text>
                <Text className="activeToast_numfont1">天</Text>
              </View>
            ) : (
              <View className="activeToast_info"></View>
            )}
          </View>
          <View
            className="activeToast_Box_close"
            onClick={() => onClose()}
          ></View>
        </View>
      </View>
    );
  };
  if (showToastCount === 0 && activityStatus === "1" && visible) {
    return template();
  } else {
    return null;
  }
};
