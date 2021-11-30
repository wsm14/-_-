import React, { useEffect, useState, useMemo } from "react";
import { Video, Swiper, SwiperItem, View } from "@tarojs/components";
import Taro, { pxTransform, useReady } from "@tarojs/taro";
import BottomView from "@/components/videoComponents/videoBottom";
import { computedVideoSize } from "@/common/utils";
import InterVal from "@/components/videoComponents";
import "./../index.scss";
export default ({
  data = {},
  onChange,
  circular,
  children,
  follow,
  collection,
  onTransition,
  stop,
  userInfo,
  shareInfo,
  beanLimitStatus,
  saveBean,
  changeComment,
  play,
}) => {
  const [scale, setScale] = useState(0);
  const [player, setPlayer] = useState(false);
  const [time, setTime] = useState(0);
  const [walk, setWalk] = useState(false);
  useEffect(() => {
    setScale(0);
    setPlayer(false);
    setTime(0);
    setWalk(false);
  }, [data]);
  const expensive = useMemo(() => {
    const { shareCommission = 0 } = userInfo;
    const {
      frontImage,
      frontImageHeight,
      frontImageWidth,
      videoContent,
      watchStatus,
      beanFlag,
    } = data;
    return (
      <View
        className="home_video_box"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: "100%",
          }}
        >
          <InterVal
            userInfo={userInfo}
            shareInfo={shareInfo}
            follow={follow}
            collection={collection}
            index={Object.keys(data).length}
            data={data}
            dataInfo={data}
            current={Object.keys(data).length}
            beanLimitStatus={beanLimitStatus}
            id={`details1`}
            play={player}
            changeComment={changeComment}
            time={time}
            show={true}
          ></InterVal>
          <View
            style={{
              height: "100%",
              width: "100%",
            }}
            onClick={(e) => {
              e.stopPropagation();
              stop();
            }}
          >
            <Video
              src={
                JSON.parse(videoContent || "{}").m3u8Url ||
                JSON.parse(videoContent || "{}").url
              }
              poster={frontImage}
              style={{
                height: "100%",
                width: "100%",
              }}
              controls={false}
              // custom-cache={false}
              enableProgressGesture={false}
              autoplay={true}
              showFullscreenBtn={false}
              // enablePlayGesture={true}
              loop={true}
              showPlayBtn={false}
              objectFit={
                computedVideoSize(frontImageWidth, frontImageHeight)
                  ? "fill"
                  : "cover"
              }
              showCenterPlayBtn={false}
              initialTime="0"
              onTimeUpdate={(e) => {
                const { currentTime, duration } = e.detail;
                if (!play) {
                  setWalk(false);
                  setTime(parseInt(currentTime));
                  setScale(((currentTime / duration) * 100).toFixed(2));
                  Taro.createVideoContext(`details1`).pause();
                } else {
                  setWalk(false);
                  setTime(parseInt(currentTime));
                  setScale(((currentTime / duration) * 100).toFixed(2));
                }
              }}
              onPause={() => {
                setPlayer(false);
              }}
              onWaiting={(e) => {
                setWalk(true);
              }}
              onPlay={() => {
                setPlayer(true);
              }}
              onEnded={() => {
                if (watchStatus === "0" && beanFlag === "1") {
                  saveBean();
                }
              }}
              id={"details1"}
              muted={false}
            ></Video>
            <View className="video_liner">
              <View
                style={{
                  height: "100%",
                  width: `${scale}%`,
                  background: "rgba(255, 235, 165, 1)",
                }}
              ></View>
            </View>
          </View>
          <BottomView userInfo={userInfo} index={0} server={data} current={0}>
            {children}
          </BottomView>
        </View>
      </View>
    );
  }, [Object.keys(data).length, scale, player, time, walk]);
  return expensive;
};
