import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View, Canvas } from "@tarojs/components";
import classNames from "classnames";

import { fakeMomentReward } from "@/server/user";
import Router from "@/common/router";
import "./index.scss";
const scale = Taro.getSystemInfoSync().windowWidth / 375;

export default ({ data, time, current, platformRewardBeanRules }) => {
  const { bean, second } = platformRewardBeanRules;
  const [watch, setWatch] = useState(0);
  //视频当前播放时长
  const [addWatch, setAddWatch] = useState(0);
  //当前视频增加时长
  const [requestStatus, setRequestStatus] = useState(true);
  //当前视频增加时长状态
  const [request, setRequest] = useState(false);
  const [toast, setToast] = useState(false);
  const [layer, setLayer] = useState({ visible: false, count: 0 });
  const [overStatus, setOverStatus] = useState(false);
  const { momentType, beanFlag } = data;
  useEffect(() => {
    if (momentType === "ugc" && beanFlag === "0" && !overStatus) {
      computedTimes(time);
    }
  }, [time]);
  useEffect(() => {
    setWatch(0);
    setRequestStatus(true);
  }, [current]);
  useEffect(() => {
    if (momentType === "ugc" && beanFlag === "0") {
      drawProgressbg();
    }
  }, [addWatch]);
  useEffect(() => {
    if (request) {
      fakeReward();
    }
  }, [request]);
  const fakeReward = () => {
    fakeMomentReward()
      .then((val) => {
        setToast(() => {
          let timeOut = setTimeout(() => {
            setRequest(() => {
              setAddWatch(0);
              setToast(false);
              return false;
            });
            clearTimeout(timeOut);
          }, 2000);
          return true;
        });
      })
      .catch((val) => {
        const { resultCode } = val;
        if (resultCode === "5038") {
          setOverStatus(true);
        } else if (resultCode === "5036") {
          setRequest(() => {
            setAddWatch(0);
            return false;
          });
        } else {
          setRequest(() => {
            setAddWatch(0);
            return false;
          });
        }
      });
  };
  const drawProgressbg = () => {
    var ctx = Taro.createCanvasContext("animateCanvas");
    ctx.setLineWidth(2); // 设置圆环的宽度
    ctx.strokeStyle = "#FFEBA5";
    ctx.setLineCap("round"); // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(
      22 * scale,
      22 * scale,
      20 * scale,
      -Math.PI / 2,
      (addWatch / second) * 2 * Math.PI - Math.PI / 2,
      false
    );
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  };
  const computedTimes = (time) => {
    const { currentTime, duration } = time;
    if (momentType === "ugc" && beanFlag === "0") {
      if (addWatch >= second && !request) {
        setRequest(() => {
          return true;
        });
      } else {
        if (requestStatus && parseInt(currentTime) > parseInt(watch)) {
          setWatch(() => {
            setAddWatch(addWatch + 1);
            return parseInt(currentTime);
          });
        }
      }
    }
  };
  if (momentType === "ugc" && beanFlag === "0" && !overStatus) {
    return toast ? (
      <View className="ugcTimeOver_box ugcTimeOver_transtation">
        <View className="ugcTimeOver_toast_box public_center">
          <View>
            +<Text className="font36">{bean}</Text>
          </View>
        </View>
      </View>
    ) : (
      <View className="ugcTimeOver_box ugcTimeOver_boxBean">
        {layer.visible && layer.count === 0 && (
          <View className="ugcTimeOver_tag_toast ugcTimeOver_tag_transtation">
            观看视频可以得卡豆奖励啦！
          </View>
        )}
        <Canvas
          onTouchEnd={() => Router({ routerName: "beanReward" })}
          id="animateCanvas"
          canvasId="animateCanvas"
          className="animateCanvas"
        ></Canvas>
      </View>
    );
  } else return null;
};
