import React from "react";
import Taro from "@tarojs/taro";
import { ScrollView, View, Text } from "@tarojs/components";
import {
  getLat,
  getLnt,
  GetDistance,
  backgroundObj,
  filterStrList,
} from "@/common/utils";
import Router from "@/common/router";
import SpecalList from "./components/specalList";
import "./index.scss";
export default ({ data, type = "any", userInfo }) => {
  const {
    perCapitaConsumption,
    categoryName,
    districtName,
    businessHub,
    markFlag,
    markBean,
    coverImg,
    logoImg,
    specialGoodsFlag,
    specialActivityList = [],
    brandFlag,
    couponList = [],
    lat,
    lnt,
    merchantName,
    address,
    merchantId,
    businessTime,
    tag,
    userMerchantIdString,
  } = data;
  const ownerShopActivity = (item) => {
    const {
      specialGoodsFlag,
      markFlag,
      couponFlag,
      couponList = [],
      specialActivityList = [],
      markBean,
    } = item;
    if (
      markFlag !== "1" &&
      couponList.length === 0 &&
      specialActivityList.length === 0
    ) {
      return null;
    } else {
      return (
        <View className="ownerShop_shop_active">
          {markFlag === "1" && (
            <View className="ownerShop_bean">打卡捡豆{markBean}</View>
          )}
          {couponList.length > 0 && (
            <View className="ownerShop_coupon">
              <View className="ownerShop_icon2 public_center">
                <View className="ownerShop_cou"></View>
              </View>
              <View
                style={
                  specialGoodsFlag === "1"
                    ? {}
                    : { maxWidth: Taro.pxTransform(380) }
                }
                className="ownerShop_text2 font_hide"
              >
                {couponList
                  .map(({ buyPrice, couponPrice }) => {
                    return `${buyPrice}元代${couponPrice}元`;
                  })
                  .join(",")}
              </View>
            </View>
          )}
          {specialActivityList.length > 0 && (
            <SpecalList
              userInfo={userInfo}
              list={specialActivityList}
            ></SpecalList>
          )}
        </View>
      );
    }
  };
  return (
    <View
      className="ownerShop_shop_box"
      onClick={() =>
        Router({
          routerName: "merchantDetails",
          args: {
            merchantId: userMerchantIdString,
          },
        })
      }
    >
      <View className="ownerShop_shop_detailsBox">
        <View
          className="ownerShop_shop_img merchant_dakale_logo"
          style={backgroundObj(coverImg)}
        ></View>
        <View className="ownerShop_shop_font">
          <View className="ownerShop_shop_merchantName font_hide">
            {merchantName}
          </View>
          <View className="ownerShop_shop_bussionTime">
            {businessTime && (
              <View className="bussionTime_tag">
                <Text className="font22 bold color9">营业时间</Text>
                <Text className="bussionTime_liner bussionTime_margin"></Text>
                <Text className="bussionTime_margin font22 bold  color9">
                  {businessTime}
                </Text>
              </View>
            )}
            <View className="ownerShop_shop_peoplePay">
              人均￥{perCapitaConsumption}
            </View>
          </View>

          <View className="ownerShop_shop_address">
            <View className="ownerShop_shop_addressFont font_hide">
              {" "}
              {categoryName + " " + address}
            </View>
            <View className="ownerShop_shop_limit">
              {GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
        </View>
      </View>
      {ownerShopActivity(data)}
      <View className="ownerShop_shop_liner"></View>
    </View>
  );
};
