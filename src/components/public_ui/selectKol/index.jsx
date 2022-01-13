import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import Router from "@/utils/router";
import classNames from "classnames";
import { objStatus, toast } from "@/utils/utils";
import "./index.scss";

export default (props) => {
  const {
    data,
    type = "goods",
    configUserLevelInfo = {},
    useScenesType,
    status,
    changeBean,
    couponObj,
  } = props;
  const {
    userCouponObjects = [],
    rightFlag,
    userBean,
    cityCode = "",
    categoryIds = "",
    ownerIdString = "",
    specialActivityIdString,
    tags = "",
    totalFee = "",
    ownerCouponIdString,
    availableCouponCount,
    merchantIdString,
  } = data;
  const { payBeanCommission = 50 } = configUserLevelInfo;
  const linkCoupon = () => {
    if (!totalFee) {
      return toast("输入价格有误,请在输入价格后选择优惠券");
    }
    Router({
      routerName: "selectCoupon",
      args: {
        useScenesType,
        cityCode,
        categoryNode: categoryIds,
        ownerId: ownerIdString || merchantIdString,
        goodsId: specialActivityIdString || ownerCouponIdString,
        tags,
        buyPrice: totalFee,
        defaultId: couponObj.userCouponId,
      },
    });
  };
  const CouponFontTemplate = () => {
    if (type === "goods") {
      if (userCouponObjects.length === 0) {
        return (
          <View className="selectKol_coupon_coupons color2">
            暂无优惠券可用
          </View>
        );
      } else {
        if (objStatus(couponObj)) {
          const { couponValue } = couponObj;
          return (
            <View className="selectKol_coupon_coupons">
              <View onClick={linkCoupon} className="font28 color3 bold">
                -{couponValue}
              </View>
            </View>
          );
        } else {
          return (
            <View className="selectKol_coupon_coupons">
              <View
                className="selectKol_coupon_toast public_center"
                onClick={linkCoupon}
              >
                未选优惠券，最高{userCouponObjects[0].couponValue}元可用
              </View>
            </View>
          );
        }
      }
    } else {
      if (availableCouponCount === 0) {
        return (
          <View className="selectKol_coupon_coupons color2">
            暂无优惠券可用
          </View>
        );
      } else {
        if (objStatus(couponObj)) {
          const { couponPrice } = couponObj;
          return (
            <View className="selectKol_coupon_coupons">
              <View onClick={linkCoupon} className="font28 color3 bold">
                -{couponPrice}
              </View>
            </View>
          );
        } else {
          return (
            <View className="selectKol_coupon_coupons">
              <View
                className="selectKol_coupon_toast public_center"
                onClick={linkCoupon}
              >
                请选择
              </View>
            </View>
          );
        }
      }
    }
  };
  return (
    <View className="selectKol_box">
      <View className="selectKol_coupon public_auto">
        <View className="selectKol_coupon_title">优惠券</View>
        {CouponFontTemplate()}
      </View>
      <View className="selectKol_bean">
        <View onClick={changeBean} className="order_payType_box">
          <View className="order_payType_top">
            卡豆下单<Text className="color3">立享优惠抵扣</Text>
            <View
              style={{ border: "1px solid #ef476f" }}
              className="order_payType_six"
            >
              {rightFlag === "1" ? `专区优惠` : `${payBeanCommission}%`}
            </View>
            {rightFlag !== "1" && (
              <View
                className="order_payType_question"
                onClick={(e) => {
                  e.stopPropagation();
                  setShow(true);
                }}
              ></View>
            )}
          </View>
          <View className="order_pay_font">
            可用{parseInt(userBean)}卡豆优惠抵扣{parseInt(userBean) / 100}元
          </View>
          <View
            className={classNames(
              "order_pay_iconBox",
              status === "1" ? "order_pay_icon2" : "order_pay_icon1"
            )}
          ></View>
        </View>
      </View>
    </View>
  );
};
