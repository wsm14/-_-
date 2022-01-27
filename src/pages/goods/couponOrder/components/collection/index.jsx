import React from "react";
import { View } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data, computedCount }) => {
  const {
    merchantLogo,
    merchantName,
    merchantIdString,
    couponName,
    couponImg,
    thresholdPrice = "0",
    couponPrice,
    couponCount,
    paymentModeObject,
    rightFlag,
    buyPrice,
  } = data;
  const { cash, bean } = paymentModeObject;
  return (
    <View className="order_details_box">
      <View className="order_details_merchant">
        <View
          className="order_merchant_details"
          onClick={() =>
            Router({
              routerName: "merchantDetails",
              args: { merchantId: merchantIdString },
            })
          }
        >
          <View
            className="order_merchant_userProfile merchant_dakale_logo"
            style={{ ...backgroundObj(merchantLogo) }}
          ></View>
          <View className="order_name font_hide">{merchantName || ""}</View>
          <View className="order_merchant_go"></View>
        </View>
      </View>
      <View className="order_shopDetails">
        <View className="order_shopDetails_box">
          <View
            className="order_shopDetails_Img coupon_big_icon"
            style={{ ...backgroundObj(couponImg) }}
          ></View>
          <View className="order_shopDetails_dec">
            <View className="order_shopDetails_title font_hide">
              {couponName}
            </View>
            <View className="order_price">
              面值{couponPrice}元{" "}
              {thresholdPrice ? `｜满${thresholdPrice}元可用` : ""}
            </View>
            <View className="order_toast">购买数量</View>
          </View>
          <View className="order_shopDetails_price">
            <View
              className="order_shop_btnBox order_shop_btn1"
              onClick={() => computedCount()}
            ></View>
            <View className="order_shop_num">{couponCount}</View>
            <View
              className="order_shop_btnBox order_shop_btn2"
              onClick={() => computedCount("add")}
            ></View>
          </View>
        </View>
      </View>
      <View className="order_shop_price">
        <View className="order_shop_label">商品总额</View>
        <View className="order_shop_count">
          {rightFlag === "1"
            ? `¥${cash * couponCount}元+${bean * couponCount}卡豆`
            : `¥${(buyPrice * couponCount).toFixed(2)}`}
        </View>
      </View>
    </View>
  );
};
