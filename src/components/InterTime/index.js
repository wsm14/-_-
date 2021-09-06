import React, { useEffect, useState } from "react";
import Taro, { useDidHide } from "@tarojs/taro";
import { toast } from "../../common/utils";

function getSeconds(s) {
  var sTime = parseInt(s); // 秒
  var mTime = 0; // 分
  var hTime = 0; // 时
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
  // if(hTime >= 0 && hTime < 10) {
  //   result = "0" + parseInt(hTime) + ":" + result;
  // }else{
  //   result = "" + parseInt(hTime) + ":" + result;
  // }
  if (sTime > 0) {
    return result;
  } else return "";
}

export default (props) => {
  const { times, fn, mint } = props;
  let time =
    parseInt(new Date().getTime() / 1000) -
    parseInt(new Date(times.replace(/-/g, "/")).getTime() / 1000);
  const [interVal, setIntervals] = useState(0);
  let i = 0;
  useEffect(() => {
    let controller = true;
    let setTime = setInterval(() => {
      i++;
      setIntervals((mint ? parseInt(mint) * 60 : 300) - time - i);
      if (300 - time === i || controller === false) {
        clearInterval(setTime);
        if (300 - time === i) {
          fn && fn();
        }
      }
    }, 1000);
    return () => {
      controller = false;
      clearInterval(setTime);
    };
  }, []);
  return <>{getSeconds(interVal)}</>;
};
