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
  const { visible = false, close, userPlatformCouponInfo, orderResult } = props;
  const {
    couponName,
    activeBeginDate,
    activeEndDate,
    couponValue,
    thresholdPrice,
    couponType,
  } = userPlatformCouponInfo;
  const { beanFee } = orderResult;
  if (show) {
    return (
      <Drawer close={close} show={visible}>
        <View className="couponToast_box">
          <View className="couponToast_bean">
            {beanFee && (
              <>
                <View>本单卡豆帮你节省</View>
                <View> ¥ {(Number(beanFee) / 100).toFixed(2)}元</View>
              </>
            )}
          </View>
          <View className="couponToast_desc">再送你一张通用券</View>
          <View className="couponToast_content">
            <View className="couponToast_title font_hide">{couponName}</View>
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
              {couponType === "fullReduce" ? "满减券" : "折扣券"}
            </View>
          </View>
          <View className="couponToast_tags">
            可在「我的-我的券包」中查看券详情
          </View>
          <View className="couponToast_btn public_center" onClick={close}>
            知道了
          </View>
        </View>
      </Drawer>
    );
  } else {
    return null;
  }
};
