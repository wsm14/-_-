/*到店打卡领豆视频领豆组件
 * show 显示或隐藏组件
 * data 外部导入数据
 * visible 外部关闭方法
 */
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import ButtonView from "@/components/Button";
import Time from "@/components/dateTime";
import "./index.scss";
export default (props) => {
  const { visible, show = false } = props;
  const [animate, setAnimated] = useState(null);
  const animated = () => {
    let animateTem = Taro.createAnimation({
      duration: 10,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    let animateTem1 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem.scale(0, 0).step();
    setAnimated(animateTem.export());
    setTimeout(() => {
      animateTem1.scale(1, 1).step();
      setAnimated(animateTem1);
    }, 300);
  };

  /* 显示隐藏动画  */
  const onClose = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      visible();
    }, 300);
  };

  /* 关闭弹框  */
  const linkToDown = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      visible();
      Router({
        routerName: "nearVideo",
        args: {
          type: "goods",
        },
      });
    }, 300);
  };
  /* 跳转下载页面  */

  useEffect(() => {
    if (show) {
      animated();
    }
  }, [show]);
  const getDate = () => {
    let timestamp = Date.parse(new Date());
    let date = new Date(timestamp);
    //获取年份
    let Y = date.getFullYear();
    //获取月份
    let M =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    //获取当日日期
    var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return Y + "-" + M + "-" + D;
  };
  return (
    <View
      style={show ? { display: "flex" } : { display: "none" }}
      className="video_success_toast public_center"
      catchMove
      animation={animate}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <View>
        <View
          catchMove
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="video_toast_box"
        >
          <View className="video_toast_timesAuto">
            剩余领取时间{" "}
            <Time showTimeInfo times={getDate()} fn={() => {}}></Time>
          </View>
          <View
            className="video_toast_btn public_center"
            onClick={() => linkToDown()}
          >
            立即去领豆
          </View>
        </View>
        <View className="video_toast_close" onClick={() => onClose()}></View>
      </View>
    </View>
  );
};
