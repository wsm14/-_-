import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

// 显示内容区域样式
const GetPrizeTip = ({
  title = "刷视频·捡卡豆·当钱花",
  tip = "100卡豆可抵扣1元",
}) => {
  return (
    <View className="GetPrizeTip_box">
      <View className="GetPrizeTip_ImgBag">
        <View className="punchTransition_text">{title}</View>
        <View className="punchTransition_tip">{tip}</View>
      </View>
    </View>
  );
};

export default GetPrizeTip;
