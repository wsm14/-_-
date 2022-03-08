import React, { useState } from "react";
import { Button, View } from "@tarojs/components";
import Drawer from "./../drawer";
import "./index.scss";
import Router from "@/utils/router";
import classNames from "classnames";
export default ({ data, status, hasBtn = true }) => {
  const [visible, setVisible] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const {
    couponName,
    useScenesType,
    dayNum,
    activeBeginDate,
    activeEndDate,
    couponValue,
    thresholdPrice,
    unavailableReason,
    otherDesc,
    consortUserOs,
    classType,
    increaseStatus,
    increaseRuleObject = {},
    userCouponId,
  } = data;
  const { type, beanNum, increaseMaxValue } = increaseRuleObject;
  const renter = {
    goodsBuy: "商品通用券",
    scan: "扫码通用券",
    virtual: "虚拟商品券",
    commerce: "电商券",
    community: "团购券",
  }[useScenesType];
  const renderDesc = () => {
    if (classType === "universal" && useScenesType === "goodsBuy") {
      return "限特惠商品、优惠券可用";
    } else if (classType === "category" && useScenesType === "goodsBuy") {
      return "限指定行业的特惠商品、优惠券使用可用";
    } else if (classType === "merchant" && useScenesType === "goodsBuy") {
      return "限指定商家的特惠商品、优惠券使用";
    } else if (classType === "goods" && useScenesType === "goodsBuy") {
      return "限指定商品的特惠商品、优惠券使用";
    } else if (classType === "universal" && useScenesType === "virtual") {
      return "限话费充值、会员充值可用";
    } else if (classType === "goods" && useScenesType === "virtual") {
      return "限会员充值可用";
    } else if (classType === "universal" && useScenesType === "commerce") {
      return "限电商商品可用";
    } else if (classType === "goods" && useScenesType === "commerce") {
      return "限指定电商商品可用";
    }
  };
  const increaseTemplate = () => {
    if (status === 1 || status === 0) {
      if (type) {
        return (
          <View className="couponFree_increase">
            <View className="couponFree_increase_max public_center">
              最高{increaseMaxValue}
            </View>
            <View
              className="couponFree_increase_payBean public_center"
              onClick={(e) => {
                e.stopPropagation();
                setShowDrawer(true);
              }}
            >
              {beanNum}卡豆膨胀
            </View>
          </View>
        );
      } else if (increaseStatus === "1") {
        return (
          <>
            <View className="couponFree_pz"></View>
            {hasBtn && (
              <View className="couponFree_increase">
                <View className="couponFree_increase_payBean public_center">
                  去使用
                </View>
              </View>
            )}
          </>
        );
      } else {
        if (!hasBtn) {
          return null;
        }
        return (
          <View className="couponFree_increase">
            <View className="couponFree_increase_payBean public_center">
              去使用
            </View>
          </View>
        );
      }
    } else {
      return null;
    }
  };
  return (
    <>
      <View
        onClick={() => {
          hasBtn &&
            Router({
              routerName: "increase",
              args: {
                userCouponId: userCouponId,
                useScenesType,
                classType,
              },
            });
        }}
        className={classNames(
          `${visible ? "couponFree_box_open" : "couponFree_box"}`,
          status != 0 && status != 1 && "couponFree_opcity"
        )}
      >
        {increaseTemplate()}
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
              {dayNum <= 1
                ? "今日过期"
                : dayNum < 3 && dayNum >= 0
                ? `${dayNum}天后过期`
                : `${activeBeginDate} 至 ${activeEndDate}可用`}
            </View>
          </View>
        </View>
        <View className="couponFree_title_right">
          <View className="couponFree_title_priceInfo">
            <View className="couponFree_title_count">{couponValue}</View>
          </View>
          <View className="couponFree_title_mk">满{thresholdPrice}可用</View>
        </View>
        <View className="couponFree_content font_hide">
          <View
            onClick={() => {
              otherDesc && setVisible(!visible);
            }}
            className={
              otherDesc
                ? visible
                  ? "couponFree_coupon_bottomIcon"
                  : "couponFree_coupon_bottomIcon1"
                : "couponFree_coupon_bottomNoIcon"
            }
          >
            {renderDesc()}
          </View>
          {visible && (
            <>
              <View className="couponFree_coupon_marginTop">{otherDesc}</View>
            </>
          )}
        </View>
        {status == 2 && <View className="couponFree_sy"></View>}
        {status == 3 && <View className="couponFree_gq"></View>}
      </View>
      {showDrawer && (
        <Drawer
          data={data}
          onclose={() => setShowDrawer(false)}
          show={showDrawer}
        ></Drawer>
      )}
    </>
  );
};
