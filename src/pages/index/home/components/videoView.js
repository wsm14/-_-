import React, { useEffect, useState, useMemo } from "react";
import { Video, Swiper, SwiperItem, View } from "@tarojs/components";
import BottomView from "@/components/videoComponents/videoBottom";
import AdCustom from "@/components/AdCustom";
import { computedVideoSize } from "@/utils/utils";
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
  initVideo,
  changeComment,
  ugcBeanCount,
  saveUgcBean,
  onTimeUpdate,
}) => {
  const [scale, setScale] = useState(0);
  const [time, setTime] = useState(0);
  const [walk, setWalk] = useState(false);
  //进度条缓冲状态
  useEffect(() => {
    setScale(0);
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
                imper = false,
              } = item;
              if (
                index === current ||
                index === current + 1 ||
                index === current - 1
              ) {
                if (imper) {
                  return (
                    <SwiperItem style={{ width: "100%", height: "100%" }}>
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
                        <View
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                        >
                          <AdCustom></AdCustom>
                        </View>
                      </View>
                    </SwiperItem>
                  );
                }
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
                        time={time}
                        show={index === current}
                        dataInfo={dataInfo}
                        saveUgcBean={saveUgcBean}
                        changeComment={changeComment}
                        ugcBeanCount={ugcBeanCount}
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
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                          controls={false}
                          custom-cache={false}
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
                          onWaiting={(e) => {
                            setWalk(true);
                          }}
                          onTimeUpdate={(e) => {
                            if (index === current) {
                              const { currentTime, duration } = e.detail;
                              initVideo();
                              setWalk(false);
                              setTime(parseInt(currentTime));
                              setScale(
                                ((currentTime / duration) * 100).toFixed(2)
                              );
                              onTimeUpdate && onTimeUpdate(e);
                            }
                          }}
                          onPause={() => {
                            if (index === current) {
                            }
                          }}
                          onPlay={() => {
                            if (index === current) {
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
                          }}
                          id={`video${index}`}
                          muted={false}
                        ></Video>
                        {index === current && (
                          <View className="video_liner">
                            {walk ? (
                              <View className="video_loadding"></View>
                            ) : (
                              <View
                                style={{
                                  height: "100%",
                                  width: `${scale}%`,
                                  background: "rgba(255, 235, 165, 1)",
                                }}
                              ></View>
                            )}
                          </View>
                        )}
                      </View>
                      <BottomView
                        userInfo={userInfo}
                        index={index}
                        server={item}
                        current={current}
                      >
                        {current === index && children}
                      </BottomView>
                    </View>
                  </SwiperItem>
                );
              } else {
                return <SwiperItem></SwiperItem>;
              }
            })}
          </Swiper>
        </View>
      );
    } else {
      return null;
    }
  }, [data, current, scale, time, walk]);
  return expensive;
};
