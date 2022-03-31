/*到店打卡领豆视频领豆组件
 * show 显示或隐藏组件
 * data 外部导入数据
 * visible 外部关闭方法
 */
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Drawer from "@/components/Drawer";
import "./index.scss";
export default (props) => {
  const { show = false, visible, userPlatformCouponInfo, orderResult } = props;
  const {
    couponName,
    activeBeginDate,
    activeEndDate,
    couponValue,
    thresholdPrice,
    couponType,
    classType,
    useScenesType,
    increaseRuleObject = {},
  } = userPlatformCouponInfo;
  const { type, beanNum, increaseMaxValue } = increaseRuleObject;
  const renderDesc = () => {
    if (classType === "universal" && useScenesType === "goodsBuy") {
      return "商品通用券";
    } else if (classType === "category" && useScenesType === "goodsBuy") {
      return "行业商品券";
    } else if (classType === "merchant" && useScenesType === "goodsBuy") {
      return "店铺商品券";
    } else if (classType === "goods" && useScenesType === "goodsBuy") {
      return "指定商品券";
    } else if (classType === "universal" && useScenesType === "virtual") {
      return "虚拟通用券";
    } else if (classType === "goods" && useScenesType === "virtual") {
      return "指定虚拟券";
    } else if (classType === "universal" && useScenesType === "commerce") {
      return "电商通用券";
    } else if (classType === "goods" && useScenesType === "commerce") {
      return "指定电商券";
    }
  };
  const { beanFee = 0 } = orderResult;
  if (show) {
    return (
      <Drawer close={visible} show={show}>
        <View className="couponToast_box">
          <View className="couponToast_bean">
            <>
              <View>本单卡豆帮你节省</View>
              <View> ¥ {(Number(beanFee) / 100).toFixed(2)}元</View>
            </>
          </View>
          <View className="couponToast_desc">再送你一张通用券</View>
          <View className="couponToast_content">
            <View className="couponToast_title font_hide">
              <View className="font_hide"> {couponName}</View>
              {type && (
                <View className="coupon_increaseMaxValue font_hide public_center">
                  {increaseMaxValue}
                </View>
              )}
            </View>
            <View className="couponToast_time">
              有效期：{activeBeginDate} 至 {activeEndDate}
            </View>
            <View className="couponToast_price">
              <View className="font24 color3">¥</View>
              <View className="font40 price_margin4 color3">{couponValue}</View>
              <View className="font20 price_margin8 color2">
                满{thresholdPrice}可用
              </View>
            </View>
            <View className="couponToast_icon public_center">
              {renderDesc()}
            </View>
          </View>
          <View className="couponToast_tags">
            可在「我的-我的券包」中查看券详情
          </View>
          <View className="couponToast_btn public_center" onClick={visible}>
            知道了
          </View>
        </View>
      </Drawer>
    );
  } else {
    return null;
  }
};
