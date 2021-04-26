// 'linear'	动画从头到尾的速度是相同的
// 'ease'	动画以低速开始，然后加快，在结束前变慢
// 'ease-in'	动画以低速开始
// 'ease-in-out'	动画以低速开始和结束
// 'ease-out'	动画以低速结束
// 'step-start'	动画第一帧就跳至结束状态直到结束
// 'step-end'	动画一直保持开始状态，最后一帧跳到结束状态

import Taro from "@tarojs/taro";
const animates = (obj) => {
  const {
    duration = 300,
    timingFunction = "linear",
    delay = 0,
    transformOrigin = "50% 50% 0",
  } = obj;

  const animate = Taro.createAnimation({
    duration,
    timingFunction,
    delay,
    transformOrigin,
    ...obj,
  });
  return animate;
};

export const Animates1 = (obj) => {
  return animates(obj).scale(1, 1).scale(2, 2).step().export();
};
export const Animates2 = (obj) => {
  return animates(obj).scale(1, 1).scale(0, 0).step().export();
};
export const Animates3 = (obj) => {
  let test1 = animates(obj);
  test1.translateX(Taro.pxTransform(12)).step();
  test1.translateX(0).step();
  return test1;
};
