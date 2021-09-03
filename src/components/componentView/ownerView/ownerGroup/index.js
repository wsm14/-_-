import React from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import {
  backgroundObj,
  getLat,
  getLnt,
  GetDistance,
  filterStrList,
} from "@/common/utils";
import Router from "@/common/router";
export default ({ data }) => {
  const {
    activityGoodsNum,
    brandLogo,
    brandName,
    groupName,
    merchantGroupIdString,
    brandPublicityImage = "",
    userMerchantInfo = {},
  } = data;
  const { lat, lnt, address, merchantName } = userMerchantInfo;
  const ownerShopActivity = (item) => {
    const {
      specialGoodsFlag,
      markFlag,
      couponFlag,
      couponList = [],
      specialActivityList = [],
      markBean,
      activityGoodsNum,
    } = item;
    if (markFlag !== "1" && couponList.length === 0 && activityGoodsNum == 0) {
      return null;
    } else {
      return (
        <View className="ownerGroup_new_active font_hide">
          {activityGoodsNum > 0 && (
            <View className="ownerGroup_info_specal">
              {activityGoodsNum}款特惠热卖中
            </View>
          )}
          {couponList.length > 0 && (
            <View className="ownerGroup_new_coupon">
              <View className="ownerGroup_new_icon2 public_center">
                <View className="ownerGroup_new_cou"></View>
              </View>
              <View
                style={
                  specialGoodsFlag === "1"
                    ? {}
                    : { maxWidth: Taro.pxTransform(380) }
                }
                className="ownerGroup_new_text2 font_hide"
              >
                {couponList
                  .filter((item, index) => {
                    return index < 2;
                  })
                  .map(({ buyPrice, couponPrice }) => {
                    return `${buyPrice}元代${couponPrice}元`;
                  })
                  .join(",")}
              </View>
            </View>
          )}
        </View>
      );
    }
  };
  return (
    <View
      class="ownerGroup_box"
      onClick={(e) => {
        e.stopPropagation();

        Router({
          routerName: "groupDetails",
          args: {
            merchantGroupId: merchantGroupIdString,
          },
        });
      }}
    >
      <View className="ownerGroup_info_box">
        <View className="ownerGroup_info_userTop">
          <View class="ownerGroup_info_profile merchant_dakale_logo">
            <Image
              className="ownerGroup_info_image"
              lazyLoad
              mode={"aspectFill"}
              src={brandLogo}
            ></Image>
          </View>
          <View class="ownerGroup_info_content">
            <View className="ownerGroup_info_title_box">
              <View className="ownerGroup_info_title font_hide">
                {groupName}
              </View>
              <View className="ownerGroup_info_icon"></View>
            </View>
            {Object.keys(userMerchantInfo).length ? (
              <View className="ownerGroup_info_contentbox  font_hide">
                <View className="ownerGroup_info_address font_hide">
                  附近 {merchantName}
                </View>
                <View className="ownerGroup_info_limit price_margin8">
                  {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
                </View>
              </View>
            ) : null}
          </View>
        </View>
        {filterStrList(brandPublicityImage)[0] && (
          <View className="ownerGroup_frontImage">
            <Image
              className="ownerGroup_info_image"
              lazyLoad
              mode={"aspectFill"}
              src={filterStrList(brandPublicityImage)[0]}
            ></Image>
          </View>
        )}
        {ownerShopActivity(data)}
      </View>
    </View>
  );
};
