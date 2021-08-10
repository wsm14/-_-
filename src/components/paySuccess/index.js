/*到店打卡领豆视频领豆组件
 * show 显示或隐藏组件
 * data 外部导入数据
 * visible 外部关闭方法
 */
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import ThreeGoods from "./threeToast";
import VideoGoods from "./videoToast";
export default (props) => {
  const { data = {}, visible, show = false, beanLimitStatus } = props;
  const { taskStatus } = data;
  if (taskStatus === "0") {
    return <ThreeGoods {...props}></ThreeGoods>;
  } else if (beanLimitStatus === "1") {
    return <VideoGoods {...props}></VideoGoods>;
  } else {
    return null;
  }
};
