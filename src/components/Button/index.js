/*按钮动画组件
  children 按钮内部携带的子元素
*/
import React, { useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
export default (props) => {
  const { children } = props;
  const [animate, setAnimated] = useState(null);
  const animated = () => {
    let animateTem = Taro.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    let animateTem1 = Taro.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    let animateTem2 = Taro.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem.opacity(0.2).step();
    setAnimated(animateTem);
    setAnimated(animateTem.export());
    setTimeout(() => {
      animateTem1.opacity(0.6).step();
      setAnimated(animateTem1.export());
      setTimeout(() => {
        animateTem2.opacity(1).step();
        setAnimated(animateTem2);
      }, 200);
    }, 200);
  };

  return (
    <View animation={animate} onClick={() => animated()}>
      {children}
    </View>
  );
};
