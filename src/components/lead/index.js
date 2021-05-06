import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { backgroundObj, switchTab } from "@/common/utils";
import Router from "@/common/router";
import ButtonView from "@/components/Button";
import "./index.scss";
export default (props) => {
  const { beanLimitStatus } = props;
  const [animate, setAnimated] = useState(null);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(0);

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
    }, 300);
  };
  const linkToDown = () => {
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
      Router({
        routerName: "download",
      });
    }, 300);
  };

  useEffect(() => {
    if (visible) {
      animated();
    }
  }, [visible]);
  useEffect(() => {
    if (type === 0 && beanLimitStatus === "0") {
      setVisible(true);
      setType(1);
    }
  }, [beanLimitStatus]);
  return (
    <View
      style={visible ? { display: "flex" } : { display: "none" }}
      className="lead_bean public_center"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <View
        className="lead_bean_box"
        catchMove
        animation={animate}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <View className="lead_bean_title  public_auto">
          <View className="lead_bean_left">哒卡乐</View>
          <View className="lead_bean_right" onClick={() => onClose()}></View>
        </View>
        <View className="lead_bean_content">
          小豆提醒你，你今天的卡豆已经达到领取上限，打开哒卡乐APP捡更多卡豆哦
        </View>
        <ButtonView>
          <View className="lead_bean_btn" onClick={() => linkToDown()}>
            打开哒卡乐APP
          </View>
        </ButtonView>
      </View>
    </View>
  );
};
