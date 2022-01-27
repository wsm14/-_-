import React, { useEffect, useState, useMemo, useRef } from "react";
import { Video, Swiper, SwiperItem, View } from "@tarojs/components";
import BottomView from "@/components/videoComponents/videoBottom";
import { computedVideoSize } from "@/utils/utils";
import Task from "@/components/task";
import InterVal from "@/components/videoComponents";
import "./../index.scss";
export default ({
  data = [],
  onChange,
  current,
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
  dataInfo,
  changeComment,
}) => {
  const [scale, setScale] = useState(0);
  const [player, setPlayer] = useState(false);
  const [time, setTime] = useState(0);
  const [walk, setWalk] = useState(false);
  const cRef = useRef();
  useEffect(() => {
    setScale(0);
    setPlayer(false);
    setTime(0);
    setWalk(false);
  }, [current]);
  const expensive = useMemo(() => {
    const { shareCommission = 0 } = userInfo;
    if (data.length > 0) {
      return (
        <View
          className="home_video_box"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Swiper
            style={{ width: "100%", height: "100%" }}
            vertical
            onChange={onChange}
            duration={200}
            current={current}
            circular={circular}
            onTransition={onTransition}
          >
            {data.map((item, index) => {
              const {
                frontImage,
                frontImageHeight,
                frontImageWidth,
                videoContent,
                watchStatus,
                beanFlag,
              } = item;
              if (
                index === current ||
                index === current + 1 ||
                index === current - 1
              ) {
                return (
                  <SwiperItem>
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
                        data={item}
                        current={current}
                        beanLimitStatus={beanLimitStatus}
                        index={index}
                        id={`video${index}`}
                        play={player}
                        time={time}
                        show={index === current}
                        dataInfo={dataInfo}
                        changeComment={changeComment}
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
                          autoplay={index === current ? true : false}
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
                            if (index === current) {
                              const { currentTime, duration } = e.detail;
                              setWalk(false);
                              setTime(parseInt(currentTime));
                              setScale(
                                ((currentTime / duration) * 100).toFixed(2)
                              );
                            }
                          }}
                          onWaiting={(e) => {
                            setWalk(true);
                          }}
                          onPause={() => {
                            if (index === current) {
                              setPlayer(false);
                            }
                          }}
                          onPlay={() => {
                            if (index === current) {
                              setPlayer(true);
                            }
                          }}
                          onEnded={() => {
                            if (
                              index === current &&
                              watchStatus === "0" &&
                              beanFlag === "1"
                            ) {
                              saveBean();
                            }
                            cRef.current.updateTask();
                          }}
                          id={`nearVideo${index}`}
                          muted={false}
                        ></Video>
                        {index === current && (
                          <View className="video_liner">
                            <View
                              style={{
                                height: "100%",
                                width: `${scale}%`,
                                background: "rgba(255, 235, 165, 1)",
                              }}
                            ></View>
                          </View>
                        )}
                      </View>
                      <BottomView
                        userInfo={userInfo}
                        index={index}
                        server={item}
                        current={current}
                      >
                        {children}
                      </BottomView>
                    </View>
                  </SwiperItem>
                );
              } else {
                return <SwiperItem></SwiperItem>;
              }
            })}
          </Swiper>
          <Task useRef={cRef}></Task>
        </View>
      );
    } else {
      return null;
    }
  }, [data.length, current, scale, player, time, walk]);
  return expensive;
};
