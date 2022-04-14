import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Banner from "@/components/banner";
import DateTime from "@/components/dateTime";
import { filterStrList, backgroundObj, toast } from "@/utils/utils";
import { renterCouponDesc } from "@/common/constant";
import { fakeAcquirePlatformCoupon } from "@/server/coupon";
import HotMetalCoupon from "./components/hotLb";
import dayjs from "dayjs";
import "./index.scss";
export default ({ data, reload, onChange }) => {
  const style = {
    width: Taro.pxTransform(750),
    height: Taro.pxTransform(540),
    position: "relative",
    zIndex: "10",
  };
  const { contentInfo } = data;
  const { topImg, startDate, couponList, platformGiftPacks = [] } = contentInfo;
  const createActiveTime = (date) => {
    const limit = dayjs().format("YYYY-MM-DD");
    // 86400000
    let min = dayjs(limit).valueOf();
    date = dayjs(date).valueOf();
    let timeinfo = 3 - (((min - date) / 86400000) % 3) - 1;
    const now = dayjs(min + timeinfo * 86400000).format("YYYY-MM-DD");
    return now;
  };
  const template = (val) => {
    const {
      platformCouponImg,
      classType,
      couponDesc,
      couponName,
      couponReceiveStatus,
      couponType,
      couponValue,
      platformCouponId,
      remain,
      thresholdPrice,
      total,
      useScenesType,
    } = val;
    const TemplateBtn = () => {
      if (couponReceiveStatus === "1") {
        return (
          <>
            <View className="hotMetal_shop_btn public_center hotMetal_shop_style2">
              已领取
            </View>
          </>
        );
      } else if (couponReceiveStatus === "0" && remain === 0) {
        return (
          <>
            <View className="hotMetal_shop_btn public_center hotMetal_shop_style2">
              下次再来
            </View>
          </>
        );
      } else {
        return (
          <View
            className="hotMetal_shop_btn public_center hotMetal_shop_style1"
            onClick={(e) => {
              e.stopPropagation();
              fakeAcquirePlatformCoupon({
                platformCouponId: platformCouponId,
              }).then((val) => {
                toast("领取成功", reload);
              });
            }}
          >
            立即领取
          </View>
        );
      }
    };
    if (filterStrList(platformCouponImg).length === 3) {
      return (
        <View onClick={() => onChange(val)} className="hotMetal_three_shop">
          {couponReceiveStatus === "0" && remain === 0 && (
            <View className="hotMetal_shop_iconBox hotMetal_shop_icon1"></View>
          )}
          {couponReceiveStatus === "1" && (
            <View className="hotMetal_shop_iconBox hotMetal_shop_icon2"></View>
          )}
          <View className="hotMetal_tag hotMetal_tag_three public_center">
            {renterCouponDesc(val)}
          </View>
          <View className="hotMetal_three_content">
            <View className="hotMetal_three_name font_hide">{couponName}</View>
            <View className="hotMetal_three_img public_auto">
              {filterStrList(platformCouponImg).map((item) => {
                return (
                  <View
                    className="hotMetal_three_imgBox"
                    style={backgroundObj(item)}
                  ></View>
                );
              })}
            </View>
          </View>
          <View className="hotMetal_three_priceBox">
            <View className="hotMetal_shop_price">
              <Text className="font24">¥</Text>
              {couponValue}
            </View>
            <View className="hotMetal_shop_priceDesc">
              满{thresholdPrice}元可用
            </View>
            <TemplateBtn></TemplateBtn>
          </View>
        </View>
      );
    } else {
      return (
        <View onClick={() => onChange(val)} className="hotMetal_shop_box">
          {couponReceiveStatus === "0" && remain === 0 && (
            <View className="hotMetal_shop_iconBox hotMetal_shop_icon1"></View>
          )}
          {couponReceiveStatus === "1" && (
            <View className="hotMetal_shop_iconBox hotMetal_shop_icon2"></View>
          )}
          <View
            className="hotMetal_shop_profile coupon_big_icon"
            style={backgroundObj(filterStrList(platformCouponImg)[0])}
          ></View>
          <View className="hotMetal_shop_content">
            <View className="hotMetal_shop_title font_hide">{couponName}</View>
            <View className="hotMetal_tag hotMetal_tag_margin">
              {renterCouponDesc(val)}
            </View>
          </View>
          <View className="hotMetal_shop_priceBox">
            <View className="hotMetal_shop_price">
              <Text className="font24">¥</Text>
              {couponValue}
            </View>
            <View className="hotMetal_shop_priceDesc">
              满{thresholdPrice}元可用
            </View>
            <TemplateBtn></TemplateBtn>
          </View>
        </View>
      );
    }
  };
  return (
    <View className="hotMetal_page_box">
      <Banner
        data={[
          {
            coverImg: topImg,
          },
        ]}
        imgName="coverImg"
        boxStyle={style}
      ></Banner>
      <View className="hotMetal_box">
        限时倒计时
        <DateTime
          showTimeInfo
          fn={() => {
            reload();
          }}
          times={createActiveTime(startDate)}
        ></DateTime>
      </View>

      {platformGiftPacks.length > 0 && (
        <HotMetalCoupon data={platformGiftPacks}></HotMetalCoupon>
      )}
      <View className="hotMetal_content">
        <View className="hotMetal_content_box">
          {couponList.map((item) => {
            return template(item);
          })}
        </View>
      </View>
      <View className="hotMetal_shop_bottom"></View>
      <View className="dakale_logo">
        <View className="dakale_logo_imageYellow"></View>
      </View>
    </View>
  );
};
