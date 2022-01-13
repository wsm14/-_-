import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { computedPrice, setBuyRule } from "@/utils/utils";
import classNames from "classnames";
import Router from "@/utils/router";
import "./index.scss";

export default (props) => {
  const { data, userInfo, collect, showToast, close, show } = props;
  const {
    oriPrice,
    realPrice,
    goodsName,
    buyRule = "unlimited",
    dayMaxBuyAmount = 0,
    maxBuyAmount = 0,
    userCollectionStatus,
    paymentModeObject = {},
    rightFlag = "0",
    activityType,
  } = data;
  const { bean = 0, cash = "0", type = "defaultMode" } = paymentModeObject;
  const { payBeanCommission = 50 } = userInfo;
  if (rightFlag === "1" && type === "defaultMode") {
    //权益商品样式展示
    return (
      <View className="shopdetails_getShop">
        <View className="shopdetails_price_people">
          <Text className="font28 color1">优惠价: </Text>
          <Text className="font48 color1 font_hide bold price_margin4  shopdetails_price_info">
            ¥{cash}
          </Text>
          <Text className="shopdetails_price_style color2">原价:</Text>
          <Text className="font36 shopdetails_price_style1 font_hide price_margin4 color2 bold text_through">
            ¥{oriPrice}
          </Text>
        </View>
        <View className="shopdetails_beanTitleName public_auto">
          <View className="shopdetails_beanTitle_name font_fourHide">
            {goodsName}
          </View>
        </View>
      </View>
    );
  } else if (type !== "defaultMode") {
    //霸王餐的商品样式
    return (
      <View className="shopdetails_getShop">
        <View className="favourInfo_box">
          <View className="favourInfo_box_left">卡豆价:</View>
          <View className="favourInfo_box_right">
            ¥{cash}+{bean}卡豆
          </View>
        </View>
        <View className="favourInfo_rel">
          <Text className="color2 font28"> 原价:</Text>
          <Text className="font36 font_hide price_margin4 color2 bold text_through">
            ¥{oriPrice}
          </Text>
        </View>

        <View className="shopdetails_beanTitleName public_auto">
          <View className="shopdetails_beanTitle_name font_fourHide">
            {goodsName}
          </View>
          {activityType !== "commerceGoods" && (
            <View
              onClick={() => this.setCollection()}
              className={classNames(
                userCollectionStatus === "1"
                  ? "shopdetails_isCollect"
                  : "shopdetails_collect"
              )}
            ></View>
          )}
        </View>
        <View className="shopdetails_bean_handerRight">
          {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount) && (
            <View className="shopdetails_getPrice_tag">
              {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount)}
            </View>
          )}
        </View>
      </View>
    );
  } else {
    //普通特惠商品样式
    return (
      <View className="shopdetails_getShop">
        <View className="shopdetails_price_people">
          <Text className="font28 color1">优惠价: </Text>
          <Text className="font48 color1 font_hide bold price_margin4  shopdetails_price_info">
            ¥{realPrice}
          </Text>
          <Text className="shopdetails_price_style color2">原价:</Text>
          <Text className="font36 shopdetails_price_style1 font_hide price_margin4 color2 bold text_through">
            ¥{oriPrice}
          </Text>
        </View>
        <View onClick={() => showToast()} className="shopdetails_bean_showPay">
          <View className="color3 font24">卡豆再省</View>
          <View className="color3 font36 bold price_margin8">
            ¥{computedPrice(realPrice, payBeanCommission)}
          </View>
          <View className="shopdetails_bean_mx">{"卡豆抵扣明细" + " >"}</View>
        </View>
        <View className="shopdetails_beanTitleName public_center">
          <View className="shopdetails_beanTitle_name font_fourHide">
            {" "}
            {goodsName}
          </View>
          {activityType !== "commerceGoods" && (
            <View
              onClick={() => collect()}
              className={classNames(
                userCollectionStatus === "1"
                  ? "shopdetails_isCollect"
                  : "shopdetails_collect"
              )}
            ></View>
          )}
          {show && (
            <View
              className="shopdetails_collect_toast public_center"
              onClick={() => {
                close();
                Router({
                  routerName: "download",
                });
              }}
            >
              已成功收藏，打开APP查看关注详情{" "}
              <View className="shopdetails_collect_btn public_center">
                去打开
              </View>
            </View>
          )}
        </View>
        <View className="shopdetails_bean_handerRight">
          {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount) && (
            <View className="shopdetails_getPrice_tag">
              {setBuyRule(buyRule, dayMaxBuyAmount, maxBuyAmount)}
            </View>
          )}
        </View>
      </View>
    );
  }
};
