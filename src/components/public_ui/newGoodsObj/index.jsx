import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, Swiper, ScrollView, SwiperItem } from "@tarojs/components";
import {
  backgroundObj,
  computedPrice,
  getLnt,
  getLat,
  GetDistance,
} from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export const templateActive = (item, configUserLevelInfo) => {
  const {
    commission,
    goodsImg,
    goodsName,
    merchantName,
    lat,
    lnt,
    merchantLogo,
    oriPrice,
    realPrice,
    ownerIdString,
    specialActivityIdString,
    paymentModeObject = {},
  } = item;
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const { bean = 0, cash = 0, type = "defaultMode" } = paymentModeObject;
  if (item) {
    return (
      <View
        className="bottom_shop_box"
        onClick={() => {
          Router({
            routerName: "favourableDetails",
            args: {
              merchantId: ownerIdString,
              specialActivityId: specialActivityIdString,
            },
          });
        }}
        key={specialActivityIdString}
      >
        <View
          className="bottom_shop_img"
          style={backgroundObj(goodsImg)}
        ></View>
        <View className="bottom_shop_content">
          <View className="bottom_shop_goodsName font_noHide">{goodsName}</View>
          {type !== "defaultMode" ? (
            <>
              <View className="bottom_shop_oldPrice1">
                <View className="bottom_shop_oldLabel">原价:</View>
                <View className="bottom_shop_oldcout">¥{oriPrice}</View>
              </View>
              <View className="bottom_qy_price font_hide">
                <View className="bottom_qy_label">卡豆价:</View>
                <View className="bottom_qy_bean font_hide">
                  ¥{cash}+{bean}卡豆
                </View>
              </View>
            </>
          ) : (
            <>
              {" "}
              <View className="bottom_shop_realPrice">
                <View className="bottom_shop_realLabel">优惠价:</View>
                <View className="bottom_shop_price">¥{realPrice}</View>
              </View>
              <View className="bottom_shop_oldPrice">
                <View className="bottom_shop_oldLabel">原价:</View>
                <View className="bottom_shop_oldcout">¥{oriPrice}</View>
              </View>
              <View className="bottom_kol_info">
                <View className="bottom_kol_s">
                  <View className="bottom_kol_bean">
                    ¥{computedPrice(realPrice, payBeanCommission)}
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    );
  } else {
    return null;
  }
};
//电商商品
export const template = (item, configUserLevelInfo) => {
  const {
    commission,
    goodsImg,
    goodsName,
    merchantName,
    lat,
    lnt,
    merchantLogo,
    oriPrice,
    realPrice,
    ownerIdString,
    specialActivityIdString,
  } = item;
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  return (
    <View
      onClick={() => {
        Router({
          routerName: "favourableDetails",
          args: {
            merchantId: ownerIdString,
            specialActivityId: specialActivityIdString,
          },
        });
      }}
      className="bottom_shop_box"
      key={specialActivityIdString}
    >
      <View className="bottom_shop_img" style={backgroundObj(goodsImg)}></View>
      <View className="bottom_shop_content">
        <View className="bottom_shop_goodsName font_noHide">{goodsName}</View>
        <View className="bottom_shop_user font_hide">
          <View
            className="bottom_shop_profile merchant_dakale_logo"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="bottom_shop_name font_hide">{merchantName}</View>
          <View className="bottom_shop_limit">
            ｜{GetDistance(lat, lnt, getLat(), getLnt())}
          </View>
        </View>
        <View className="bottom_shop_realPrice">
          <View className="bottom_shop_realLabel">优惠价:</View>
          <View className="bottom_shop_price">¥{realPrice}</View>
        </View>
        <View className="bottom_shop_oldPrice">
          <View className="bottom_shop_oldLabel">原价:</View>
          <View className="bottom_shop_oldcout">¥{oriPrice}</View>
        </View>
        <View className="bottom_kol_info">
          <View className="bottom_kol_s">
            <View className="bottom_kol_bean">
              ¥{computedPrice(realPrice, payBeanCommission)}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
//特惠商品
export const templateRight = (item, configUserLevelInfo) => {
  const {
    goodsImg,
    ownerIdString,
    goodsName,
    merchantName,
    lat,
    lnt,
    merchantLogo,
    oriPrice,

    specialActivityIdString,
    paymentModeObject = {},
  } = item;
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const { bean, cash } = paymentModeObject;
  return (
    <View
      onClick={() => {
        Router({
          routerName: "favourableDetails",
          args: {
            merchantId: ownerIdString,
            specialActivityId: specialActivityIdString,
          },
        });
      }}
      className="bottom_shop_box"
      key={specialActivityIdString}
    >
      <View className="bottom_shop_img" style={backgroundObj(goodsImg)}></View>
      <View className="bottom_shop_content">
        <View className="bottom_shop_goodsName font_noHide">{goodsName}</View>
        <View className="bottom_shop_user font_hide">
          <View
            className="bottom_shop_profile merchant_dakale_logo"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="bottom_shop_name font_hide">{merchantName}</View>
          <View className="bottom_shop_limit">
            ｜{GetDistance(lat, lnt, getLat(), getLnt())}
          </View>
        </View>

        <View className="bottom_shop_oldPrice1">
          <View className="bottom_shop_oldLabel">原价:</View>
          <View className="bottom_shop_oldcout">¥{oriPrice}</View>
        </View>
        <View className="bottom_qy_price font_hide">
          <View className="bottom_qy_label">卡豆价:</View>
          <View className="bottom_qy_bean font_hide">
            ¥{cash}+{bean}卡豆
          </View>
        </View>
      </View>
    </View>
  );
};
//权益商品
export const templateGame = (item, configUserLevelInfo) => {
  const {
    commission,
    goodsImg,
    ownerIdString,
    goodsName,

    oriPrice,
    realPrice,

    specialActivityIdString,
  } = item;
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  return (
    <View
      onClick={() => {
        Router({
          routerName: "favourableDetails",
          args: {
            merchantId: ownerIdString,
            specialActivityId: specialActivityIdString,
          },
        });
      }}
      key={specialActivityIdString}
      className="bottom_shop_box"
    >
      <View className="bottom_shop_img" style={backgroundObj(goodsImg)}></View>
      <View className="bottom_shop_content">
        <View className="bottom_shop_goodsName font_noHide">{goodsName}</View>
        <View className="bottom_shop_realPrice">
          <View className="bottom_shop_realLabel">优惠价:</View>
          <View className="bottom_shop_price">¥{realPrice}</View>
        </View>
        <View className="bottom_shop_oldPrice">
          <View className="bottom_shop_oldLabel">原价:</View>
          <View className="bottom_shop_oldcout">¥{oriPrice}</View>
        </View>
        <View className="bottom_kol_info">
          <View className="bottom_kol_s">
            <View className="bottom_kol_bean">
              ¥{computedPrice(realPrice, payBeanCommission)}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
//周边游玩
