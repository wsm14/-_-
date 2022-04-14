import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  computedBeanPrice,
} from "@/utils/utils";
import Taro from "@tarojs/taro";
import days from "dayjs";
import "./index.scss";
export default ({ data, reload }) => {
  const { status, createTime } = data;
  console.log(status, data);
  let interval = null;
  let collection = true;
  const [time, setTime] = useState(null);
  const [showTimeList, setShowTimeList] = useState([]);
  const filterLimit = (s) => {
    if (s && s > 0) {
      let collageTime = parseInt(s); // 秒
      let minute = 0;
      let house = 0;
      if (collageTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minute = parseInt(collageTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        collageTime = parseInt(collageTime % 60);
        //秒数
        if (minute > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          house = parseInt(minute / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minute = parseInt(minute % 60);
        }
      }
      return [
        house ? (house < 10 ? "0" + parseInt(house) : house) : "00",
        minute ? (minute < 10 ? "0" + parseInt(minute) : minute) : "00",
        collageTime
          ? collageTime < 10
            ? "0" + parseInt(collageTime)
            : collageTime
          : "00",
      ];
    } else return null;
  };
  const reloadInfo = () => {
    let min = days(createTime).valueOf() + 86400000;
    const now = days().valueOf();
    setTime(min - now);
  };
  useEffect(() => {
    if (status === "0") {
      reloadInfo();
    }
  }, [status]);
  useEffect(() => {
    return () => {
      collection = false;
    };
  }, []);
  useEffect(() => {
    if (time) {
      let computed = 0;
      interval = setInterval(() => {
        computed = computed + 1000;
        if (time - computed >= 0 && collection) {
          setShowTimeList(filterLimit((time - computed) / 1000));
        } else {
          reload && reload();
          clearInterval(interval);
        }
      }, 1000);
    }
  }, [time]);
  if (status === "0") {
    return (
      <View className="collageTime_box">
        <View className="collageTime_body">
          {showTimeList.map((item, index) => {
            return (
              <View className={`collageTime_end_djs${index + 1}`}>{item}</View>
            );
          })}
        </View>
      </View>
    );
  } else {
    return null;
  }
};
