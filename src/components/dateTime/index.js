/*按天倒计时组件
  fn 时间停止的回调
  times 需要 对比当前时间 计算的时间
  type  外部控制样式
 */
import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { toast } from "../../common/utils";
import classNames from "classnames";
function getSeconds(s) {
  let second = parseInt(s); // 秒
  let minute = 0;
  let house = 0;
  let date = 0;

  if (second > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minute = parseInt(second / 60);
    //获取秒数，秒数取佘，得到整数秒数
    second = parseInt(second % 60);
    //秒数
    if (minute > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      house = parseInt(minute / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minute = parseInt(minute % 60);
    }
    if (house > 24) {
      //获取小时，获取分钟除以24，得到整数小时
      date = parseInt(house / 24);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      house = parseInt(house % 24);
    }
  }
  var result = "";
  if (second >= 0 && second < 10) {
    result = "0" + parseInt(second) + "";
  } else {
    result = "" + parseInt(second) + "";
  }
  if (minute >= 0 && minute < 10) {
    result = "0" + parseInt(minute) + ":" + result;
  } else {
    result = "" + parseInt(minute) + ":" + result;
  }
  if (house >= 0 && house < 10) {
    result = "0" + parseInt(house) + ":" + result;
  } else {
    result = "" + parseInt(house) + ":" + result;
  }
  if (date > 0) {
    result = parseInt(date) + "天" + result;
  }
  if (s > 0) {
    console.log(result);
    return result;
  } else return "";
}

export default (props) => {
  const { times, fn, mint, type } = props;
  let time =
    parseInt(new Date(times.replace(/-/g, "/")).getTime() / 1000)+86399 -
    parseInt(new Date().getTime() / 1000);

  const [interVal, setIntervals] = useState(0);
  const [font, showFont] = useState(false);

  let i = 0;
  useEffect(() => {
    if (time >= 259200 || !time) {
      showFont(true);
    } else {
      if (time) {
        let setTime = setInterval(() => {
          i++;
          setIntervals(time - i);
          if (time - i === 0) {
            clearInterval(setTime);
            fn && fn();
          }
        }, 1000);
      }
    }
  }, []);
  return (
    <>
      {font ? (
        <Text>{times + "截止"} </Text>
      ) : (
        <>
          <Text>抢购倒计时</Text>
          <Text className={classNames(!type ? "color3 bold" : "")}>
            {"  " + getSeconds(interVal)}
          </Text>
        </>
      )}
    </>
  );
};
