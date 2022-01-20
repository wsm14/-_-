import React from "react";
import Taro from "@tarojs/taro";
import { View, Text, ScrollView, Video } from "@tarojs/components";
import {
  GetDistance,
  filterStrList,
  filterSetting,
  mapGo,
  getLat,
  getLnt,
  backgroundObj,
} from "@/utils/utils";
import Banner from "@/components/banner";
import Router from "@/utils/router";
export default ({ data, saveFollow, deleteFollow, fetchShareInfo, onOpen }) => {
  const {
    headerContentObject = {},
    businessHub,
    perCapitaConsumption,
    businessStatus,
    businessTime,
    allImgs,
    services,
    address,
    categoryName,
    lat,
    lnt,
    tag,
    merchantId,
    merchantName,
    scenesNames = "",
    merchantFollowStatus,
  } = data;
  const {
    headerType = "image",
    imageUrl = "",
    mp4Url = "",
  } = headerContentObject;
  const templateTitle = () => {
    if (headerType === "image") {
      return (
        <Banner
          autoplay={imageUrl.split(",").length > 1 ? true : false}
          imgStyle
          data={
            imageUrl
              ? imageUrl.split(",")
              : [
                  "https://wechat-config.dakale.net/miniprogram/image/icon744.png",
                ]
          }
          imgName={"coverImg"}
          style={{ width: "100%", height: Taro.pxTransform(440) }}
          boxStyle={{ width: "100%", height: Taro.pxTransform(440) }}
        ></Banner>
      );
    } else {
      return (
        <Video
          style={{ width: "100%", height: Taro.pxTransform(440) }}
          autoplay
          showMuteBtn
          src={mp4Url}
        ></Video>
      );
    }
  };
  return (
    <>
      {templateTitle()}
      <View className="merchantDetails_shop">
        <View className="merchant_name font_noHide">{merchantName}</View>
        <View className="merchant_desc">
          「{businessHub && businessHub + "·"}
          {categoryName}{" "}
          {perCapitaConsumption && "人均" + perCapitaConsumption + "元"}」
        </View>
        <View className="merchant_tag">
          {filterStrList(scenesNames).map((item) => {
            return <View className="merchat_tag_box">{item}</View>;
          })}
        </View>
        <ScrollView scrollX className="merchant_shopImg">
          {filterStrList(allImgs).map((item) => {
            return (
              <View
                className="shopImgBox"
                style={{ ...backgroundObj(item) }}
              ></View>
            );
          })}
        </ScrollView>
        <View className="share_btn public_auto">
          {merchantFollowStatus === "0" ? (
            <View
              className="share_saveColleton_btn"
              onClick={() => saveFollow()}
            >
              关注
            </View>
          ) : (
            <View
              className="share_updateColleton_btn"
              onClick={() => deleteFollow()}
            >
              已关注
            </View>
          )}

          <View
            className="share_image_btn"
            onClick={() => {
              fetchShareInfo();
            }}
          >
            分享
          </View>
        </View>

        <View className="merchant_shop_details">
          <View
            className="merchat_time"
            onClick={() =>
              Router({
                routerName: "businessSell",
                args: {
                  merchantId,
                },
              })
            }
          >
            <View className="merchant_time_go"></View>
            <View className="merchant_time_box">
              <View className="merchant_bisinissStatus">
                <Text>
                  {businessStatus === "0" ? "休息中 | " : "营业中 | "}
                </Text>
                <Text style={{ color: "rgba(153, 153, 153, 1)" }}>
                  {businessTime}
                </Text>
              </View>
              <View className="merchant_time_tags">
                {[...filterStrList(tag), ...services].map((item, index) => {
                  if (index < 5) {
                    return <View className={"merchant_tag_shop"}>{item}</View>;
                  }
                })}
              </View>
            </View>
          </View>
          <View className="merchat_city_accress">
            <View className="merchant_accBox">
              <View
                className="merchant_city_icon1"
                onClick={() =>
                  mapGo({
                    lat,
                    lnt,
                    address,
                    merchantName: merchantName,
                  })
                }
              ></View>
              <View className="merchant_city_icon2"></View>
              <View
                className="merchant_city_icon3"
                onClick={() => onOpen()}
              ></View>
            </View>
            <View className="merchat_city_details">
              <View className="merchat_city_names font_hide">{address}</View>
              <View className="merchat_city_limit">
                距您{GetDistance(getLat(), getLnt(), lat, lnt) + " "}{" "}
                {filterSetting(GetDistance(getLat(), getLnt(), lat, lnt))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
