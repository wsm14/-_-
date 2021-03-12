import React, { useEffect, useState } from "react";
import { Video, Swiper, SwiperItem, View, Image } from "@tarojs/components";
import Taro, { pxTransform, useReady } from "@tarojs/taro";
import BottomView from "./bottom";
import { backgroundObj, navigateTo, setPeople } from "@/common/utils";
import classNames from "classnames";
import "./../index.scss";
export default ({
  data = [],
  onChange,
  current,
  circular,
  children,
  follow,
  collection,
  
}) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    setList(data);
  }, [data]);
  if (list.length > 0) {
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
          circular={circular}
        
        >
          {list.map((item, index) => {
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
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Video
                      src={JSON.parse(videoContent || "{}").url}
                      poster={frontImage}
                      style={{
                        height: Taro.pxTransform(frontImageHeight),
                        width: "100%",
                      }}
                      controls={false}
                      // custom-cache={false}
                      enableProgressGesture={false}
                      autoplay={index === current ? true : false}
                      showFullscreenBtn={false}
                      enablePlayGesture={true}
                      loop={true}
                      showPlayBtn={false}
                      showCenterPlayBtn={false}
                      objectFit="cover"
                      initialTime="0"
                      id={`video${index}`}
                      // onPause={onPause}
                      // onPlay={onPlay}
                      muted={false}
                    ></Video>
                    <BottomView server={item}>{children}</BottomView>
                    <View className="home_stem_layer">
                      <View
                        style={userProfile ? backgroundObj(userProfile) : {}}
                        className="home_stem_userProfile dakale_profile"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo(
                            `/pages/newUser/merchantDetails/index?userId=${userIdString}`
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
                      <View className="home_share_wechat"></View>
                      <View className="collected_font">{shareAmount}</View>
                    </View>
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
};
