import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import * as dayjs from "dayjs";
import Poplayout from "@/relay/components/Poplayout";
import TimePicker from "./TimePicker";
import "./index.scss";

export default ({ value: defaultSearch = {}, onChange }) => {
  // 时间选择器打开
  const [showPop, setShowPop] = useState({
    show: false,
    title: "选择时间",
  });
  // 时间源数据保存 弹出层回显
  const [saveTime, setSaveTime] = useState("");
  // 时间数据展示
  const [showTime, setShowTime] = useState("");

  useEffect(() => {
    setShowTime(defaultSearch.certExpireDate);
    onChange && onChange(defaultSearch.certExpireDate);
  }, [defaultSearch.certExpireDate]);

  // 保存时间
  const handleSaveTime = (val) => setSaveTime(val);

  // 时间比较大小
  const handleTimeSome = () => {
    const endTime = saveTime || showTime;
    // 展示时间显示
    setShowTime(endTime);
    onChange && onChange(endTime);
    // 关闭浮层
    setShowPop(false);
  };

  return (
    <View className="cert_TimeRange">
      <View
        className="shwoTime"
        onClick={() => setShowPop({ show: true, title: "选择时间" })}
      >
        {showTime || <View className="color2">请选择时间</View>}
      </View>{" "}
      <Poplayout
        {...showPop}
        onSubmit={handleTimeSome}
        onClose={() => setShowPop(false)}
      >
        <TimePicker onSelect={handleSaveTime} inValue={showTime}></TimePicker>
      </Poplayout>
    </View>
  );
};
