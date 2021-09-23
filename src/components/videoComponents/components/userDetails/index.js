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
    relateImg,
    relateId,
    watchStatus,
    length,
    followStatus,
    commentAmount = 0,
    momentType,
    relateType,
    jumpUrl = "",
  } = data;

  const linkTo = () => {
    if (jumpUrl) {
      Router({
        routerName: "webView",
        args: {
          link: jumpUrl,
        },
      });
    } else if (relateType === "user") {
      Router({
        routerName: "download",
      });
    } else if (relateType === "group") {
      Router({
        routerName: "groupDetails",
        args: {
          merchantGroupId: relateId,
        },
      });
    } else if (relateType === "merchant") {
      Router({
        routerName: "merchantDetails",
        args: {
          merchantId: relateId,
        },
      });
    } else {
      return;
    }
  };
  return (
    <View className="video_stem_layer">
      <View
        style={backgroundObj(relateImg)}
        className="video_stem_userProfile merchant_dakale_logo"
        onClick={(e) => {
          e.stopPropagation();
          linkTo();
        }}
      >
        {followStatus === "0" &&
          (relateType === "user" || relateType === "merchant") &&
          !jumpUrl && (
            <View
              onClick={(e) => follow(e)}
              className={classNames("video_stem_fallStatus video_stem_status1")}
            ></View>
          )}
        {jumpUrl.length > 0 && (
          <View
            className={classNames("video_stem_fallStatus video_stem_status2")}
          ></View>
        )}
      </View>

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
