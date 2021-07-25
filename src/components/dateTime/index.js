/*按天倒计时组件
  fn 时间停止的回调
  times 需要 对比当前时间 计算的时间
  type  外部控制样式
 */
import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { toast } from "../../common/utils";
import classNames from "classnames";
import "./index.scss";
function getSeconds(s, val = false) {
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
    if (!val) {
      return result;
    } else {
      let list = result.split("天");
      if (list.length === 2) {
        list = [...list[0], ...list[1].toString().split(":")];
        return (
          <View className="time_box">
            {list.map((item, index) => {
              if (index === 0) {
                return (
                  <View className="time_box">
                    <View className="time_color_box public_center">{item}</View>
                    <View className="time_color_font">天</View>
                  </View>
                );
              } else if (index === list.length - 1) {
                return (
                  <View className="time_box">
                    <View className="time_color_box public_center">{item}</View>
                  </View>
                );
              } else {
                return (
                  <View className="time_box">
                    <View className="time_color_box public_center">{item}</View>
                    <View className="time_color_font">:</View>
                  </View>
                );
              }
            })}
          </View>
        );
      } else {
        list = [...list.toString().split(":")];
        return (
          <View className="time_box">
            {list.map((item, index) => {
              if (index === list.length - 1) {
                return (
                  <View className="time_box">
                    <View className="time_color_box public_center">{item}</View>
                  </View>
                );
              } else {
                return (
                  <View className="time_box">
                    <View className="time_color_box public_center">{item}</View>
                    <View className="time_color_font">:</View>
                  </View>
                );
              }
            })}
          </View>
        );
      }
    }
  } else return "";
}
export default (props) => {
  const {
    times,
    fn,
    mint,
    type,
    onlyTime = false,
    styles = false,
    showTimeInfo = false,
  } = props;
  let time =
    parseInt(new Date(times.replace(/-/g, "/")).getTime() / 1000) +
    86399 -
    parseInt(new Date().getTime() / 1000);

  const [interVal, setIntervals] = useState(0);
  const [font, showFont] = useState(false);
  let i = 0;
  useEffect(() => {
    let collection = true;
    if (time >= 259200 || !time) {
      showFont(true);
    } else {
      if (time) {
        let setTime = setInterval(() => {
          i++;
          setIntervals(time - i);
          if (time - i === 0 || collection === false) {
            clearInterval(setTime);
            fn && fn();
          }
        }, 1000);
      }
    }
    return () => {
      collection = false;
    };
  }, []);
  if (showTimeInfo) {
    return getSeconds(interVal, styles);
  } else {
    if (onlyTime) {
      if (font) {
        return (
          <View className="shopDetails_avtiveTime_jz">{times + "截止"} </View>
        );
      } else {
        return (
          <View className="shopDetails_avtiveTime_flex">
            <View className="shopDetails_avtiveTime_tag">抢购倒计时</View>
            <View className="shopDetails_avtiveTime_left">
              {"  " + getSeconds(interVal)}
            </View>
          </View>
        );
      }
    } else {
      return (
        <>
          {font ? (
            <Text>{times + "截止"} </Text>
          ) : (
            <View className="time_box">
              <View className="time_box">抢购倒计时</View>
              <View className={classNames("time_box  time_margin")}>
                {getSeconds(interVal, styles)}
              </View>
            </View>
          )}
        </>
      );
    }
  }
};
