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
    rightFlag = "0",
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
    paymentModeObject = {},
    goodsCount = 1,
    couponType,
    couponCount,
  } = data;
  const { payBeanCommission = 50 } = configUserLevelInfo;
  const { couponValue = 0 } = couponObj;
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
  const computedPriceInfo = () => {
    const { cash, type = "defaultMode", bean } = paymentModeObject;
    if (type === "defaultMode") {
      const { couponValue = 0 } = couponObj;
      let price = Number(totalFee) - couponValue;
      let payBean = price * payBeanCommission;
      let removeBean = payBean >= userBean ? userBean : payBean;
      if (removeBean && status === "1") {
        return (removeBean / 100).toFixed(2);
      } else {
        return 0;
      }
    } else {
      return userBean;
    }
  };
  const computedRight = () => {
    const { bean } = paymentModeObject;
    if (rightFlag === "1") {
      if (couponType) {
        if (userBean < bean * couponCount) {
          return false;
        } else {
          return true;
        }
      } else {
        if (userBean < bean * goodsCount) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
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
            <View onClick={linkCoupon} className="selectKol_coupon_coupons">
              <View className="font28 color3 bold">-{couponValue}</View>
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
            <View onClick={linkCoupon} className="selectKol_coupon_coupons">
              <View className="font28 color3 bold">-{couponPrice}</View>
            </View>
          );
        } else {
          return (
            <View onClick={linkCoupon} className="selectKol_coupon_coupons">
              <View className="selectKol_coupon_toast public_center">
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
          {computedRight() ? (
            <View className="order_pay_font">
              可用{parseInt(userBean - couponValue * 100)}卡豆优惠抵扣
              {((userBean - couponValue * 100) / 100).toFixed(2)}元
            </View>
          ) : (
            <View className="order_pay_font">暂无卡豆可用</View>
          )}
          <View
            className={classNames(
              "order_pay_iconBox",
              computedRight()
                ? status === "1"
                  ? "order_pay_icon2"
                  : "order_pay_icon1"
                : "order_pay_icon4"
            )}
          ></View>
          {totalFee > 0 && computedRight() && (
            <View className="order_payType_showPrice">
              - {computedPriceInfo()}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
