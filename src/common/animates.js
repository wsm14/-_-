// 'linear'	动画从头到尾的速度是相同的
// 'ease'	动画以低速开始，然后加快，在结束前变慢
// 'ease-in'	动画以低速开始
// 'ease-in-out'	动画以低速开始和结束
// 'ease-out'	动画以低速结束
// 'step-start'	动画第一帧就跳至结束状态直到结束
// 'step-end'	动画一直保持开始状态，最后一帧跳到结束状态

import Taro from "@tarojs/taro";
const animates = (val = {}) => {
  let obj = {
    duration: 300,
    timingFunction: "linear",
    delay: 0,
    transformOrigin: "50% 50% 0",
    ...val,
  };
  return Taro.createAnimation(obj);
};

export const animateBean = (top) => {
  let animate = animates({ transformOrigin: "-100% 50% 0", duration: 1000 });
  animate.translateX(Taro.pxTransform(12)).step(0);
  return animate.export();
};
export const animateOrderBean = (top) => {
  let animate = animates({ transformOrigin: "0 0 0", duration: 1000 });
  animate.translateY(1000).opacity(0).step(0);
  return animate.export();
};
