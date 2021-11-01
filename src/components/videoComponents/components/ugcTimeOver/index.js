import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View, Canvas } from "@tarojs/components";
import classNames from "classnames";
import {} from "@/common/utils";
import { fakeMomentReward } from "@/server/user";
import Router from "@/common/router";
import "./index.scss";
const scale = Taro.getSystemInfoSync().windowWidth / 375;

export default ({ data, time, current, platformRewardBeanRules }) => {
  const { second = 30, bean } = platformRewardBeanRules;
  const [watch, setWatch] = useState(0);
  //视频当前播放时长
  const [timeType, setTimeType] = useState(true);
  const [computedTime, setComputedTime] = useState(0);
  const [requestTime, setRequestTime] = useState(0);
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
    if (!request) {
      setWatch(() => {
        setComputedTime(computedTime + watch);
        setTimeType(true);
        setRequestTime(0);
        return 0;
      });
    } else {
      setTimeType(true);
    }
  }, [current]);
  useEffect(() => {
    if (!request) {
      setWatch(() => {
        setComputedTime(computedTime + watch);
        setTimeType(true);
        setRequestTime(0);
        return 0;
      });
    } else {
      setTimeType(true);
    }
  }, [data]);
  useEffect(() => {
    if (momentType === "ugc" && beanFlag === "0") {
      drawProgressbg();
    }
  }, [watch]);
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
              setRequestTime(requestTime + watch);
              setComputedTime(0);
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
        } else {
          setRequest(() => {
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
      ((watch - requestTime + computedTime) / second) * 2 * Math.PI -
        Math.PI / 2,
      false
    );
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  };
  const computedTimes = (time) => {
    const { currentTime, duration } = time;
    if (momentType === "ugc" && beanFlag === "0") {
      if (watch - requestTime + computedTime >= second && !request) {
        setRequest(() => {
          return true;
        });
      } else {
        if (parseInt(currentTime) && !request) {
          if (currentTime >= watch && timeType) {
            if (currentTime >= 3 && !layer.visible) {
              setLayer({ visible: true, count: 0 });
              let timeInfo = setTimeout(() => {
                setLayer({ visible: true, count: 1 });
                clearTimeout(timeInfo);
              }, 2000);
            }
            setWatch(parseInt(currentTime));
          } else {
            setTimeType(false);
            return;
          }
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
