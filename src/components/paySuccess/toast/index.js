import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { backgroundObj, switchTab } from "@/common/utils";
import Router from "@/common/router";
import ButtonView from "@/components/Button";
import "./index.scss";
export default (props) => {
  const { visible, show = false } = props;
  const [animate, setAnimated] = useState(null);

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
      visible();
    }, 300);
  };

  /* 关闭弹框  */
  const linkToGuang = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      visible();
      switchTab("/pages/index/home/index");
    }, 300);
  };
  /* 跳转主页捡豆页面  */

  useEffect(() => {
    if (show) {
      animated();
    }
  }, [show]);

  return (
    <View
      style={show ? { display: "flex" } : { display: "none" }}
      className="date_bean public_center"
      catchMove
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <View>
        <View className="pay_bean_box" animation={animate}>
          <View className="pay_bean_btn public_center">
            <View
              className="pay_bean_btnBox public_center pay_bean_btnRight"
              onClick={() => linkToGuang()}
            >
              立即去领
            </View>
          </View>
        </View>
        <View className="pay_bean_close" onClick={() => onClose()}></View>
      </View>
    </View>
  );
};
