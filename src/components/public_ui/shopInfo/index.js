import React from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/utils/router";
import { format, backgroundObj } from "@/utils/utils";
import "./index.scss";
export const goodsCard = (item) => {
  const {
    goodsName,
    goodsImg,
    oriPrice,
    realPrice,
    merchantName,
    specialActivityIdString,
    merchantLogo,
    lat,
    lnt,
    merchantIdString,
    discount,
    total,
    remain,
    status,
    activityStartTime = "",
    activityTimeRule = "fixed",
  } = item;
  const templateBtn = () => {
    if (status === "0") {
      return (
        <View className="shopDetails_btn shopDetails_btnColor3">已结束</View>
      );
    } else if (status === "1" && remain === "0") {
      return (
        <View className="shopDetails_btn shopDetails_btnColor3">已售罄</View>
      );
    } else if (!format(activityStartTime) && activityTimeRule === "fixed") {
      return (
        <View className="shopDetails_btn shopDetails_btnColor2">即将开抢</View>
      );
    } else {
      return (
        <View className="shopDetails_btn shopDetails_btnColor1">立即抢</View>
      );
    }
  };
  return (
    <View
      className="goodsCard_box"
      onClick={() => {
        if (status === "0" || (status === "1" && remain === "0")) {
          return;
        }
        return Router({
          routerName: "favourableDetails",
          args: {
            merchantId: merchantIdString,
            specialActivityId: specialActivityIdString,
          },
        });
      }}
    >
      <View className="goodsCard_desc_box">
        <View
          className="goodsCard_desc_image dakale_nullImage"
          style={backgroundObj(goodsImg)}
        ></View>
        <View className="goodsCard_right">
          <View className="goodsCard_right_title font_hide">{goodsName}</View>
          <View className="goodsCard_right_price public_auto">
            <View className="shopDetails_left">
              <Text style={{ fontSize: Taro.pxTransform(20) }}>¥</Text>
              {" " + realPrice || ""}
              <Text className="shopDetails_right">
                ¥ {" " + oriPrice || ""}
              </Text>
            </View>
            <View className="shop_zhekou  font20">{discount}折</View>
          </View>
          <View className="goodsCard_btn public_auto">
            <View>热卖中</View>
            {templateBtn()}
          </View>
        </View>
      </View>
    </View>
  );
};
export const shopDetails = (data, obj) => {
  if (data) {
    const {
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      merchantName,
      specialActivityIdString,
      merchantLogo,
      lat,
      lnt,
      merchantIdString,
      discount,
      total,
      remain,
      status,
      activityStartTime,
      boughtActivityGoodsNum,
      activityTimeRule,
    } = data;
    const templateBtn = () => {
      if (status === "0") {
        return (
          <View className="shopDetails_btn shopDetails_btnColor3">已结束</View>
        );
      } else if (status === "1" && remain === 0) {
        return (
          <View className="shopDetails_btn shopDetails_btnColor3">已售罄</View>
        );
      } else if (!format(activityStartTime) && activityTimeRule === "fixed") {
        return (
          <View className="shopDetails_btn shopDetails_btnColor2">
            即将开抢
          </View>
        );
      } else {
        return (
          <View className="shopDetails_btn shopDetails_btnColor1">立即抢</View>
        );
      }
    };
    return (
      <View
        className="shopDetails_box"
        onClick={() => {
          if (status === "0" || (status === "1" && remain === 0)) {
            return;
          }
          return Router({
            routerName: "favourableDetails",
            args: {
              merchantId: merchantIdString,
              specialActivityId: specialActivityIdString,
            },
          });
        }}
      >
        <View
          style={backgroundObj(goodsImg)}
          className="shopDetails_Img dakale_nullImage"
        ></View>
        <View className="shopDetails_dec">
          <View className="shopDetails_shopName font_hide">{goodsName}</View>
          <View className="shopDetails_price">
            <View className="shopDetails_left">
              <Text style={{ fontSize: Taro.pxTransform(20) }}>¥</Text>
              {" " + realPrice || ""}
              <Text className="shopDetails_right">
                ¥ {" " + oriPrice || ""}
              </Text>
            </View>
            <View className="shop_zhekou font20">
              {((Number(realPrice) / Number(oriPrice)) * 10).toFixed(1)}折
            </View>
          </View>
          <View className="shopDetails_btnBox public_auto">
            <View className="shopDetails_btnTitle font24">
              {boughtActivityGoodsNum > 50 ? "50+" : "热卖中"}
            </View>
            {templateBtn()}
          </View>
        </View>
      </View>
    );
  } else return null;
};
//商品标签
export const billboard = (data, userIdString) => {
  if (data) {
    const { goodsImg, goodsName, goodsIdString } = data;
    return (
      <View
        className="billboard_box"
        onClick={() =>
          Router({
            routerName: "merchantCommodity",
            args: {
              merchantId: userIdString,
              goodsId: goodsIdString,
            },
          })
        }
      >
        <View
          className="billboard_img dakale_nullImage"
          style={goodsImg ? backgroundObj(goodsImg) : {}}
        ></View>
        <View className="billboard_title font_hide">{goodsName}</View>
      </View>
    );
  }
  return null;
};
