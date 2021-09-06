import React, { useState, useEffect } from "react";
import { View, PickerView, PickerViewColumn } from "@tarojs/components";
import * as dayjs from "dayjs";
import "./index.scss";

// const date = new Date();

// // 当前年份
// const nowYear = date.getFullYear();
// // 当前月
// const nowMon = date.getMonth();
// // 当前日
// const nowDay = date.getDate();
// // 当前时
// const nowHoure = date.getHours();
// // 当前分
// const nowMin = date.getMinutes();

// const nowDayValue = {
//   value: [nowYear - 2020, nowMon, nowDay - 1, nowHoure, nowMin], // 时间数据的index 回显用
//   text: dayjs().format("YYYY-MM-DD"), // 时间数据的text 回显用
// };

const addZero = (num, start = 0) => {
  const arr = [];
  for (let i = start; i <= num; i++) {
    arr.push(i < 10 ? `0${i}` : i);
  }
  return arr;
};

const PickerViewBlock = (props) => {
  const { onSelect = () => {}, inValue } = props;

  // 选择后的时间数据
  const [dayIndex, setDayIndex] = useState([]);

  // 年
  const [years] = useState(() => addZero(2121, 1958));

  // 月
  const [months] = useState(() => addZero(12, 1));

  // 日
  const [days, setDays] = useState(() => addZero(31, 1));

  useEffect(() => {
    // 2021 7 26 15 36
    const dateTime = dayjs(inValue);
    // 当前年份
    const nowYear = dateTime.year();
    // 当前月
    const nowMon = dateTime.month();
    // 当前日
    const nowDay = dateTime.date();
    const nowDayValue = [nowYear - 1958, nowMon, nowDay - 1];
    // 初始赋值
    !inValue && onSelect(dayjs().format("YYYYMMDD"));
    setDayIndex(nowDayValue);
  }, [inValue]);

  // 时间变化选择器变化
  const saveDataTime = (val) => {
    // 判断瑞年
    const selctYear = years[val[0]];
    const selctMonths = months[val[1]];
    const selctDays = days[val[2]];

    let day = [];
    let inNum = 31;
    // 判断2月
    if (selctMonths == 2) {
      if (
        (selctYear % 4 == 0 && selctYear % 100 != 0) ||
        selctYear % 400 == 0
      ) {
        // 瑞年
        inNum = 29;
      } else {
        // 平年
        inNum = 28;
      }
    } else {
      // 判断大月小月
      if ([4, 6, 9, 11].indexOf(selctMonths) > -1) inNum = 30;
    }
    // 不满十位加0
    for (let i = 1; i <= inNum; i++) {
      day.push(i < 10 ? `0${i}` : i);
    }
    setDays(day);

    // 选择时间储存
    setDayIndex(val);
    onSelect(`${selctYear}${selctMonths}${selctDays}`);
  };

  const propsArr = [
    {
      type: "年",
      data: years,
    },
    {
      type: "月",
      data: months,
    },
    {
      type: "日",
      data: days,
    },
  ];

  return (
    <View className="PickerView_Block">
      <PickerView
        value={dayIndex}
        indicatorClass="PickerView_indicator"
        className="PickerView_tool"
        onChange={(e) => saveDataTime(e.detail.value)}
      >
        {propsArr.map((item, index) => (
          <PickerViewColumn>
            {item?.data?.map((citem, i) => {
              return (
                <View
                  className={
                    "PickerView_Item" + (dayIndex[index] == i ? " select" : "")
                  }
                >
                  {citem}
                  {item.type}
                </View>
              );
            })}
          </PickerViewColumn>
        ))}
      </PickerView>
    </View>
  );
};

export default PickerViewBlock;
