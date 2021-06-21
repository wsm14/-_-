import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View, Canvas } from "@tarojs/components";
import classNames from "classnames";
import { setPeople, navigateTo, backgroundObj } from "@/common/utils";
import Router from "@/common/router";
import "./../../index.scss";
export default ({
  follow,
  collection,
  shareInfo,
  data,
  userInfo,
  time = 0,
  show,
  initBean,
}) => {
  const {
    merchantFollowStatus,
    shareAmount,
    collectionAmount,
    guideMomentFlag,
    userProfile,
    userIdString,
    merchantCollectionStatus,
    watchStatus,
    length,
  } = data;
  const { shareCommission = 0 } = userInfo;
  return (
    <View className="video_stem_layer">
      <View
        style={userProfile ? backgroundObj(userProfile) : {}}
        className="video_stem_userProfile dakale_profile"
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
            className={classNames("video_stem_fallStatus video_stem_status1")}
          ></View>
        )}
      </View>
      {guideMomentFlag === "0" && (
        <>
          <View
            onClick={() => collection()}
            className={classNames(
              "collected_box",
              merchantCollectionStatus === "0"
                ? "share_shoucang_icon1"
                : "share_shoucang_icon2"
            )}
          ></View>
          <View className="collected_font">{setPeople(collectionAmount)}</View>
        </>
      )}
      <View
        onClick={() => shareInfo()}
        className={classNames("video_share_wechat")}
      ></View>

      <View className="collected_font">{shareAmount}</View>

      {initBean && (
        <View
          onClick={() => {
            Router({
              routerName: "beanReward",
            });
          }}
          className={classNames(
            "bean_animate",
            watchStatus === "1" ? "bean_animate_bg2" : "bean_animate_bg1"
          )}
        >
          <View
            className={classNames(
              watchStatus === "1" ? "bean_animate_padding" : "bean_animate_time"
            )}
          >
            {watchStatus === "1"
              ? "已领"
              : show
              ? parseInt(length) - time
              : parseInt(length)}
          </View>
        </View>
      )}
    </View>
  );
};