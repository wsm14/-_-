import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { toast } from "../../common/utils";

function getSeconds(s) {
  var sTime = parseInt(s); // 秒
  var mTime = 0; // 分
  var hTime = 0; // 时
  var hDate = 0; // 天
  if (sTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    mTime = parseInt(sTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    sTime = parseInt(sTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if (mTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hTime = parseInt(mTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      mTime = parseInt(mTime % 60);
    }
    if (hTime > 24) {
      //获取小时，获取分钟除以60，得到整数小时
      hDate = parseInt(mTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      hTime = parseInt(mTime % 60);
    }
  }
  var result = "";
  if (sTime >= 0 && sTime < 10) {
    result = "0" + parseInt(sTime) + "";
  } else {
    result = "" + parseInt(sTime) + "";
  }
  if (mTime >= 0 && mTime < 10) {
    result = "0" + parseInt(mTime) + ":" + result;
  } else {
    result = "" + parseInt(mTime) + ":" + result;
  }
  if (hTime >= 0 && hTime < 10) {
    result = "0" + parseInt(hTime) + ":" + result;
  } else {
    result = "" + parseInt(hTime) + ":" + result;
  }
  if (hDate > 0) {
    result = parseInt(hDate) + "天" + result;
  }
  if (s > 0) {
    console.log(result);
    return result;
  } else return "";
}

export default (props) => {
  const { times, fn, mint } = props;
  let time =
    parseInt(new Date(times.replace(/-/g, "/")).getTime() / 1000) -
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
          <Text className="color3  bold">{"  " + getSeconds(interVal)}</Text>
        </>
      )}
    </>
  );
};
