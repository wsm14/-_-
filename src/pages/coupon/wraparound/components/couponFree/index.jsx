import React, { useState } from "react";
import { Button, View } from "@tarojs/components";
import "./index.scss";
import classNames from "classnames";
export default ({ data, status }) => {
  const [visible, setVisible] = useState(false);
  const {
    couponName,
    useScenesType,
    dayNum,
    activeBeginDate,
    activeEndDate,
    couponType,
    couponValue,
    thresholdPrice,
    unavailableReason,
    otherDesc,
    consortUserOs,
    classType,
  } = data;
  const renter = {
    goodsBuy: "商品通用券",
    scan: "扫码通用券",
    virtual: "虚拟商品券",
    commerce: "电商券",
    community: "团购券",
  }[useScenesType];

  const renderType = {
    universal: "通用券",
    category: "行业券",
    merchant: "店铺券",
    goods: "商品券",
  }[classType];
  const renderOs = {
    all: "全部",
    app: "用户端",
    wechat: "哒卡乐小程序",
    markWechat: "哒小卡小程序",
    communityWechat: "哒小团小程序",
  }[consortUserOs];
  return (
    <View
      className={classNames(
        `${visible ? "couponFree_box_open" : "couponFree_box"}`,
        status != 0 && status != 1 && "couponFree_opcity"
      )}
    >
      <View className="couponFree_title  font_hide">
        <View className="couponFree_title_left font_hide">
          <View className="couponFree_title_leftInfo font_hide">
            <View className="couponFree_title_font  font_hide">
              {couponName}
            </View>
            <View className="couponFree_title_icon">{renter}</View>
          </View>
          <View
            className={`couponFree_title_time ${
              dayNum < 3 && dayNum > 0 ? "color3" : "color2"
            }`}
          >
            {dayNum < 3 && dayNum >= 0
              ? `${dayNum}天后过期`
              : `${activeBeginDate} 至 ${activeEndDate}`}
          </View>
        </View>
      </View>
      <View className="couponFree_title_right">
        <View className="couponFree_title_priceInfo">
          <View className="couponFree_title_count">{couponValue}</View>
        </View>
        <View className="couponFree_title_mk">满{thresholdPrice}可用</View>
      </View>
      <View className="couponFree_content">
        <View
          onClick={() => {
            setVisible(!visible);
          }}
          className={
            visible
              ? "couponFree_coupon_bottomIcon"
              : "couponFree_coupon_bottomIcon1"
          }
        >
          {unavailableReason}
        </View>
        {visible && (
          <>
            <View className="couponFree_coupon_marginTop">{otherDesc}</View>
            <View className="couponFree_coupon_marginTop">
              限「{renderType}」使用
            </View>
            <View className="couponFree_coupon_marginTop">
              限在「{renderOs}」使用
            </View>
          </>
        )}
      </View>

      {status == 2 && <View className="couponFree_sy"></View>}
      {status == 3 && <View className="couponFree_gq"></View>}
    </View>
  );
};
