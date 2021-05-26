import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View, Canvas } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
import Router from "@/common/router";

const scale = () => {
  return Taro.getSystemInfoSync().windowWidth / 375;
};
export default (props) => {
  const {
    data,
    interval,
    length,
    current,
    beanLimitStatus,
    show = true,
  } = props;
  const [time, setTime] = useState(null);
  const [toast, setToast] = useState(1);
  const [moment, setMoment] = useState({});
  const [timeOut, setTimeOut] = useState(null);
  const { watchStatus, beanAmount, couponTitlesJson = [] } = moment;
  useEffect(() => {
    setTime(interval);
  }, [interval]);
  useEffect(() => {
    setMoment(data);
    setToast(1);
  }, [data]);
  useEffect(() => {
    if (!timeOut) {
      let val = setTimeout(() => setToast(0), 5000);
      setTimeOut(val);
    } else {
      clearTimeout(timeOut);
      let val = setTimeout(() => setToast(0), 5000);
      setTimeOut(val);
    }
  }, [current]);
  useEffect(() => {
    drawProgressbg(scale());
    if (watchStatus === "0" && beanLimitStatus === "0" && time === 0) {
      setToast(1);
    }
  }, [time]);
  const drawProgressbg = (size) => {
    var ctx = Taro.createCanvasContext("animateCanvas");
    var ring = ctx.createLinearGradient(0, 60, 60, 0);
    ring.addColorStop(0, "#FFC95B");
    ring.addColorStop(1, "#EF476F");
    ctx.setLineWidth(5 * size); // 设置圆环的宽度
    ctx.strokeStyle = ring;
    ctx.setLineCap("round"); // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(
      30 * size,
      30 * size,
      27 * size,
      30,
      2 * ((length - time) * (1 / length)) * Math.PI + 30,
      false
    );
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  };
  console.log(show);
  return (
    <View
      className="canvas_box"
      onClick={() => Router({ routerName: "beanReward" })}
    >
      <View
        className={classNames(
          "canvas_img",
          watchStatus !== "1" ? "beanTime" : "beanTime1"
        )}
      >
        {watchStatus !== "1" && (
          <Canvas
            onTouchEnd={() => Router({ routerName: "beanReward" })}
            id="animateCanvas"
            canvasId="animateCanvas"
            className={classNames('animateCanvas', !show && 'animateCanvas_opacity')}
          ></Canvas>
        )}
        {watchStatus !== "1" && <View className="getBean_toast">{time}</View>}
      </View>
      {(watchStatus === "0" && time != 0) ||
      (watchStatus === "0" && toast === 1) ? (
        <View
          className={classNames(
            "canvas_tag",
            toast === 0 && "animated fadeOut"
          )}
        >
          <View className="canvas_tag_box"></View>
          {beanLimitStatus === "1"
            ? ` 看完可捡${beanAmount + "卡豆"}${
                couponTitlesJson.length > 0
                  ? `和${couponTitlesJson[0].couponPrice}元抵扣券`
                  : ``
              }`
            : "今日卡豆领取已达上限"}
        </View>
      ) : null}
    </View>
  );
};
