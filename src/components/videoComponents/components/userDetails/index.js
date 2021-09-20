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
  changeComment,
}) => {
  const {
    collectionStatus,
    shareAmount,
    collectionAmount,
    guideMomentFlag,
    userProfile,
    relateId,
    watchStatus,
    length,
    followStatus,
    commentAmount = 0,
    momentType,
    relateType,
  } = data;
  return (
    <View className="video_stem_layer">
      <View
        style={userProfile ? backgroundObj(userProfile) : {}}
        className="video_stem_userProfile merchant_dakale_logo"
        onClick={(e) => {
          e.stopPropagation();
          navigateTo(
            `/pages/perimeter/merchantDetails/index?merchantId=${relateId}`
          );
        }}
      >
        {followStatus === "0" &&
          (relateType === "user" || relateType === "merchant") && (
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
              collectionStatus === "0" ? "video_stem_sc1" : "video_stem_sc2"
            )}
          ></View>
          <View className="collected_font">{setPeople(collectionAmount)}</View>
        </>
      )}
      {/* 评论区按钮 - start */}
      <View onClick={changeComment} className="video_comment_box"></View>
      <View className="video_comment_font">{commentAmount}</View>
      {/* 评论区按钮 - end */}
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
