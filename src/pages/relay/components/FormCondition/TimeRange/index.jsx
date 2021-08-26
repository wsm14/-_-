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
    title: "11",
    type: "",
  });
  // 时间源数据保存 弹出层回显
  const [saveTime, setSaveTime] = useState({});
  // 时间数据展示
  const [showTime, setShowTime] = useState({});

  useEffect(() => {
    setShowTime({
      start: defaultSearch.beginTime || dayjs().format("YYYY-MM-DD HH:mm"),
      end:
        defaultSearch.endTime ||
        dayjs().add(7, "day").format("YYYY-MM-DD HH:mm"),
    });
    onChange &&
      onChange({
        beginTime:
          defaultSearch.beginTime || dayjs().format("YYYY-MM-DD HH:mm"),
        endTime:
          defaultSearch.endTime ||
          dayjs().add(7, "day").format("YYYY-MM-DD HH:mm"),
      });
  }, [defaultSearch.beginTime]);

  // 保存时间
  const handleSaveTime = (val) => {
    if (showPop.type == "start" || showPop.type == "end") {
      setSaveTime({ ...saveTime, [showPop.type]: val });
    }
  };

  // 时间比较大小
  const handleTimeSome = () => {
    const { start = "", end = "" } = saveTime;
    // 判断开始结束时间是否倒转，反转填充
    let timeObj = {};
    const endTime = end || showTime.end;
    const startTime = start || showTime.start;
    // 时间都存在时进入判断
    if (dayjs(endTime).isBefore(startTime)) {
      // 倒转赋值
      timeObj = { start: endTime, end: startTime };
    }
    const timeData = {
      ...showTime,
      ...saveTime,
      ...timeObj,
    };
    // 展示时间显示
    setShowTime(timeData);
    onChange &&
      onChange({
        beginTime: timeData.start,
        endTime: timeData.end,
      });
    // 关闭浮层
    setShowPop(false);
  };

  return (
    <View className="TimeRange">
      <View
        className="shwoTime"
        onClick={() =>
          setShowPop({ show: true, title: "开始时间", type: "start" })
        }
      >
        开始 {showTime.start}
      </View>
      <View
        className="shwoTime"
        onClick={() =>
          setShowPop({ show: true, title: "结束时间", type: "end" })
        }
      >
        结束 {showTime.end}
      </View>
      <Poplayout
        {...showPop}
        onSubmit={handleTimeSome}
        onClose={() => setShowPop(false)}
      >
        <TimePicker
          type={showPop.type}
          onSelect={handleSaveTime}
          inValue={showTime[showPop.type] || false}
        ></TimePicker>
      </Poplayout>
    </View>
  );
};
