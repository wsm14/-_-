import React, { useEffect, useState, useMemo } from "react";
import {
  Video,
  Swiper,
  SwiperItem,
  View,
  Image,
  Button,
} from "@tarojs/components";
import Taro, { pxTransform, useReady } from "@tarojs/taro";
import BottomView from "./bottom";
import {
  backgroundObj,
  navigateTo,
  setPeople,
  computedVideoSize,
} from "@/common/utils";
import classNames from "classnames";
import "./../index.scss";
export default ({
  data = {},
  children,
  follow,
  collection,
  stop,
  userInfo,
}) => {
  const [scale, setScale] = useState(0);
  const expensive = useMemo(() => {
    const { shareCommission = 0 } = userInfo;
    const {
      frontImage,
      frontImageHeight,
      videoContent,
      userProfile,
      merchantFollowStatus,
      userIdString,
      merchantCollectionStatus,
      collectionAmount,
      shareAmount,
      frontImageWidth,
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
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
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
              src={JSON.parse(videoContent || "{}").url}
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
              showCenterPlayBtn={false}
              objectFit={
                computedVideoSize(frontImageWidth, frontImageHeight)
                  ? "fill"
                  : "cover"
              }
              initialTime="0"
              onTimeUpdate={(e) => {
                const { currentTime, duration } = e.detail;
                setScale(((currentTime / duration) * 100).toFixed(2));
              }}
              // onPause={onPause}
              // onPlay={onPlay}
              id="details1"
              muted={false}
            ></Video>

            <View className="video_liner">
              <View
                style={{
                  height: "100%",
                  width: `${scale}%`,
                  background: "rgba(239, 71, 111, 1)",
                }}
              ></View>
            </View>
          </View>
          <BottomView userInfo={userInfo} server={data}>
            {children}
          </BottomView>
          <View className="home_stem_layer">
            <View
              style={userProfile ? backgroundObj(userProfile) : {}}
              className="home_stem_userProfile dakale_profile"
              onClick={(e) => {
                e.stopPropagation();
                navigateTo(
                  `/pages/perimeter/merchantDetails/index?merchantId=${userIdString}`
                );
              }}
            >
              {merchantFollowStatus === "0" && (
                <View
                  onClick={(e) => follow(e)}
                  className={classNames(
                    "home_stem_fallStatus home_stem_status1"
                  )}
                ></View>
              )}
            </View>
            <View
              onClick={() => collection()}
              className={classNames(
                "collected_box",
                merchantCollectionStatus === "0"
                  ? "share_shoucang_icon1"
                  : "share_shoucang_icon2"
              )}
            ></View>
            <View className="collected_font">
              {setPeople(collectionAmount)}
            </View>

            <View
              className={classNames(
                shareCommission > 0 ? "home_share_animate" : "home_share_wechat"
              )}
            >
              <Button
                open-type="share"
                style={{
                  border: "0px soild white",
                  background: (0, 0, 0, 0),
                  width: "100%",
                  height: "100%",
                }}
              ></Button>
            </View>

            <View className="collected_font">{shareAmount}</View>
          </View>
        </View>
        );
      </View>
    );
  }, [data, scale]);
  return expensive;
};
