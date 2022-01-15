import React, { useEffect, useRef, useState } from "react";
import Taro, { useRouter, useDidShow, useDidHide } from "@tarojs/taro";
import { View, Video, Text, Image } from "@tarojs/components";
import { navigatePostBack } from "@/utils/utils";
import AdverConfirm from "./components/AdverConfirm";
import NavigationBar from "@/components/NavigationBar";

import "./index.scss";

/**
 * 广告视频
 */
const AdvertisingVideo = () => {
  const refTimer = useRef();

  const [barHeight, setBarHeight] = useState(0); // 导航栏高度
  const [play, setPlay] = useState(false); // 播放状态
  const [step, setStep] = useState(0); // 计时器
  const [prizeStatus, setPrizeStatus] = useState(false); // 奖励是否已经被领取
  const [videoData, setVideoData] = useState({}); // 展示视频广告信息
  const [visible, setVisible] = useState(false); // 退出弹窗

  /**
   * 路由内进入存在参数
   */
  const routeParams = useRouter().params;
  const { hittingId, url, title, height = 0 } = videoData;

  useDidShow(() => {
    setPlay(true);
  });

  useDidHide(() => {
    setPlay(false);
  });

  useEffect(() => {
    setStep(routeParams.showlength || 15);
    setPlay(true);
  }, []);

  useEffect(() => {
    play && handleVideoPausePlay("play");
  }, [play]);

  // 监听倒计时
  useEffect(() => {
    if (play && !prizeStatus) {
      refTimer.current = setTimeout(() => {
        if (step > 0) {
          setStep((c) => c - 1);
        } else {
          // 视频播放完毕
          console.log("video end");
          clearTimeout(refTimer.current);
          setPrizeStatus(true);
        }
      }, 1000);
    } else {
      // 视频暂停停止计时
      clearTimeout(refTimer.current);
    }
    return () => clearTimeout(refTimer.current);
  }, [step, play]);

  // 控制视频播放停止
  const handleVideoPausePlay = (type) => {
    if (type == "play") Taro.createVideoContext("adVideo").play();
    if (type == "pause") Taro.createVideoContext("adVideo").pause();
  };

  return (
    <View className="AdvertisingVideo_page">
      {/* 导航栏 */}
      <NavigationBar
        theme="white"
        site={false}
        title={"视频广告"}
        getHeight={setBarHeight}
      ></NavigationBar>
      <View className="AdvertisingVideo_head" style={{ top: barHeight + 10 }}>
        <Image
          src="https://wechat-config.dakale.net/miniprogram/image/dakale_text.png"
          className="dakaleText"
        ></Image>
        <View className="step_time_box">
          <View className="step_time">
            <Text className="timeTitle">广告</Text>
            {/* 倒计时 */}
            {prizeStatus ? "您已获得奖励" : `${step || 0}s后获得折扣充值机会`}
          </View>
        </View>
        <View
          className="video_close"
          onClick={() => {
            // 已经获得奖励
            if (prizeStatus) {
              navigatePostBack({ type: "videoEnd" });
              return;
            }
            handleVideoPausePlay("pause");
            setVisible(true);
          }}
        >
          关闭
        </View>
      </View>
      {/* 视频背景 */}
      <Video
        id="adVideo"
        src={url || ""}
        loop
        autoplay
        objectFit={Number(height) > 900 ? "fill" : "contain"}
        controls={false}
        playBtnPosition="center"
        enableProgressGesture={false}
        className="AdvertisingVideo_bean_Video"
        onPlay={() => setPlay(true)}
        onPause={() => setPlay(false)}
      ></Video>
      {/* 内容 */}
      <View className="AdvertisingVideo_title">{title}</View>
      {/* 广告确认弹窗 */}
      <AdverConfirm
        visible={visible}
        onClose={() => {
          handleVideoPausePlay("play");
          setVisible(false);
        }}
      ></AdverConfirm>
    </View>
  );
};

export default AdvertisingVideo;
