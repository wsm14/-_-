import React from "react";
import { Image, Text, View } from "@tarojs/components";
import classNames from "classnames";
import {
  computedHeight,
  GetDistance,
  getLat,
  getLnt,
  backgroundObj,
  filterTime,
  setPeople,
} from "@/common/utils";
import Taro from "@tarojs/taro";
import "./../index.scss";
import Router from "@/common/router";
const goWatch = (type, momentId, Id) => {
  if (type === "video") {
    Router({
      routerName: "shareVideo",
      args: {
        momentId: momentId,
        merchantId: Id,
      },
    });
  } else {
    Router({
      routerName: "shareImage",
      args: {
        momentId: momentId,
        merchantId: Id,
      },
    });
  }
};
export const createFall = (item, index) => {
  const {
    beanAmount,
    beanFlag,
    categoryName,
    contentType,
    lat,
    lnt,
    likeAmount,
    userLikeStatus,
    watchStatus,
    title,
    momentId,
    frontImage,
    frontImageHeight,
    frontImageWidth,
    address,
    username,
    userProfile,
    length,
    viewAmount,
    imageLength,
    userIdString,
  } = item;
  return (
    <View
      onClick={() => goWatch(contentType, momentId, userIdString)}
      className="createFall_box"
    >
      <View className="createFall_image dakale_nullImage">
        <Image
          style={{
            height: Taro.pxTransform(
              computedHeight(frontImageWidth, frontImageHeight, 335)
            ),
            width: "100%",
            borderRadius: Taro.pxTransform(8),
          }}
          lazyLoad
          src={frontImage}
        ></Image>
        {contentType === "image" ? (
          <View className="createFall_time createFall_time_image">
            {imageLength}
          </View>
        ) : (
          <View className="createFall_time">{filterTime(length)}</View>
        )}

        <View className="createFall_limit">
          <View className="createFall_address_icon"></View>
          <View className="createFall_address_font font_hide">
            {" "}
            {GetDistance(getLat(), getLnt(), lat, lnt) + " " + address}
          </View>
        </View>
      </View>
      <View className="createFall_details">
        <View className="createFall_title  font_noHide  ">
          <View style={{display:'inline-block'}}>
            <Text className="createFall_caTags">{categoryName} </Text>
          </View>

          {title}
        </View>
        {/*<View className='createFall_couponBox'>*/}
        {/*  <View className='createFall_coupon'>优惠券</View>*/}
        {/*  <View className='createFall_coupon'>优惠券</View>*/}
        {/*</View>*/}
        {beanFlag === "1" && (
          <View
            className={classNames(
              "createFall_beanBox",
              watchStatus === "0"
                ? "createFall_beanColor1"
                : "createFall_beanColor2"
            )}
          >
            {watchStatus === "0"
              ? `观看可捡${beanAmount}豆`
              : `已捡${beanAmount}豆`}
          </View>
        )}
        <View className="createFall_userBox public_auto">
          <View className="createFall_userBox_left">
            <View
              className="createFall_userProfile dakale_profile"
              style={userProfile ? backgroundObj(userProfile) : {}}
            ></View>
            <View className="createFall_userName font_hide">{username}</View>
          </View>
          <View style={{visibility:'hidden'}} className="createFall_userBox_right">
            <View
              className={classNames(
                "createFall_zanIcon",
                userLikeStatus === "1" ? "createFall_icon2" : "createFall_icon1"
              )}
            ></View>
            <View className="createFall_zanName createFall_zanColor1">
              {setPeople(likeAmount || 0) || 0}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export const createFull = (item) => {
  const {
    beanAmount,
    beanFlag,
    categoryName,
    contentType,
    lat,
    lnt,
    likeAmount,
    userLikeStatus,
    watchStatus,
    title,
    momentId,
    frontImage,
    frontImageHeight,
    frontImageWidth,
    address,
    username,
    userProfile,
    length,
    viewAmount,
    imageLength,
    userIdString,
  } = item;

  return (
    <View
      onClick={() => goWatch(contentType, momentId, userIdString)}
      className="createFull_box"
    >
      <View className="createFull_image">
        {contentType === "video" && <View className="createFull_video"></View>}
        <Image
          style={{
            height: "100%",
            width: "100%",
            borderRadius: Taro.pxTransform(8),
          }}
          lazyLoad
          mode="aspectFill"
          src={frontImage}
        ></Image>
        {contentType === "image" ? (
          <View className="createFall_time createFall_time_image">
            {imageLength}
          </View>
        ) : (
          <View className="createFall_time">{filterTime(length)}</View>
        )}

        <View className="createFall_limit">
          <View className="createFall_address_icon"></View>
          <View className="createFall_address_font font_hide">
            {" "}
            {GetDistance(getLat(), getLnt(), lat, lnt) + " " + address}
          </View>
        </View>
      </View>
      <View className="createFull_userDetails_box  public_auto">
        <View className="createFull_title font_noHide">
          <Text className="createFull_caTags">{categoryName}</Text>
          {title}
        </View>
        <View style={{visibility:'hidden'}} className="createFull_right">
          <View
            className={classNames(
              "createFall_zanIcon",
              userLikeStatus === "1" ? "createFall_icon2" : "createFall_icon1"
            )}
          ></View>
          <View className="createFall_zanName createFall_zanColor1">
            {setPeople(likeAmount || 0) || 0}
          </View>
        </View>
      </View>
      <View className="createFull_userBox public_auto">
        <View className="createFull_userBox_left">
          <View
            className="createFull_userBox_profile dakale_profile"
            style={userProfile ? backgroundObj(userProfile) : {}}
          ></View>
          <View className="createFull_userBox_userName font_hide">
            {username}
          </View>
        </View>
        {beanFlag === "1" && (
          <View
            className={classNames(
              "createFull_right",
              watchStatus === "1"
                ? "createFall_zanColor1"
                : "createFall_zanColor2"
            )}
          >
            {watchStatus === "0"
              ? `观看可捡${beanAmount}豆`
              : `已捡${beanAmount}豆`}
          </View>
        )}
      </View>
    </View>
  );
};
