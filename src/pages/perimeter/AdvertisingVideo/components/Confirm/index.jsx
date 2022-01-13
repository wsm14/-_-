import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import close from "./close.png";
import "./index.scss";

/**
 * 弹框
 * @param  {String} okText - 按钮名称
 * @param  {Function} onClose - 外面传入的关闭方法
 * @param  {Boolean} mask - 点击蒙版关闭是否
 * @param  {ReactNode} children - 子组件
 */
export default ({ visible, onClose, mask = false, children }) => {
  const [animate, setAnimated] = useState(null);
  const [show, setShow] = useState(null); // 内容显示隐藏

  useEffect(() => {
    if (visible) {
      animated();
    } else {
      show === true && hidden();
    }
  }, [visible]);

  // 关闭事件
  const handleClose = (e) => {
    e && e.stopPropagation();
    onClose();
  };

  const animated = () => {
    setShow(true); // 设置显示
    let animateTem = Taro.createAnimation({
      duration: 10,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    })
      .scale(0, 0)
      .step()
      .export();
    let animateTem1 = Taro.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    })
      .scale(1, 1)
      .step();
    setAnimated(animateTem);
    setTimeout(() => {
      animateTem1;
      setAnimated(animateTem1);
    }, 200);
  };

  const hidden = (e) => {
    e && e.stopPropagation();
    let animateTem2 = Taro.createAnimation({
      duration: 150,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    })
      .scale(0, 0)
      .step()
      .export();
    setAnimated(animateTem2);
    setTimeout(() => {
      setShow(false);
    }, 150);
  };

  return show ? (
    <View className="Confirm_layer" catchMove onClick={mask && handleClose}>
      <View
        animation={animate}
        className={`dakale_layer_toast`}
        onClick={(e) => e.stopPropagation()}
      >
        <View className="dakale_Confirm_content">{children}</View>
        <Image
          src={close}
          onClick={handleClose}
          className="dakale_modal_close"
        ></Image>
      </View>
    </View>
  ) : null;
};
