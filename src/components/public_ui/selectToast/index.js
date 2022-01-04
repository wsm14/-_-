import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
export default (props) => {
  const {
    cancel,
    canfirm,
    content,
    cancelText,
    canfirmText,
    children,
    visible = false,
  } = props;
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
      cancel();
    }, 300);
  };
  useEffect(() => {
    if (visible) {
      animated();
    }
  }, [visible]);
  return (
    <View className="share">
      <View animation={animate} className="stopBean_prompts">
        <View className="prompts_title">温馨提示</View>
        <View className="prompts_context">{children ? children : content}</View>
        <View className="prompts_btn">
          <View className="prompts_btn_out" onClick={() => onClose()}>
            {canfirmText || "确定"}
          </View>

          <View className="prompts_btn_now" onClick={() => canfirm()}>
            {cancelText || "取消"}
          </View>
        </View>
      </View>
    </View>
  );
};
