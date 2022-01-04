import React from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data, computedCount }) => {
  const {
    merchantIdString,
    merchantLogo,
    merchantName,
    goodsName,
    goodsImg,
    goodsCount,
    paymentModeObject = {},
  } = data;
  const { bean = 0, cash = 0 } = paymentModeObject;
  return (
    <View className="order_details_box">
      <View className="order_details_merchant">
        <View
          className="order_merchant_details"
          onClick={() =>
            Router({
              routerName: "merchantDetails",
              args: {
                merchantId: merchantIdString,
              },
            })
          }
        >
          <View
            className="order_merchant_userProfile merchant_dakale_logo"
            style={{ ...backgroundObj(merchantLogo) }}
          ></View>
          <View className="order_name font_hide">{merchantName}</View>
          <View className="order_merchant_go"></View>
        </View>
      </View>
      <View className="order_shopDetails">
        <View className="order_shopDetails_box">
          <View
            className="order_shopDetails_Img dakale_nullImage"
            style={{ ...backgroundObj(goodsImg) }}
          ></View>
          <View className="order_shopDetails_dec">
            <View className="order_shopDetails_title font_hide">
              {goodsName}
            </View>
            <View className="order_price">
              ¥{cash.toFixed(2)} + {bean}卡豆
            </View>
            <View className="order_toast">购买数量</View>
          </View>
          <View className="order_shopDetails_price">
            <View
              className="order_shop_btnBox order_shop_btn1"
              onClick={() => computedCount()}
            ></View>
            <View className="order_shop_num">{goodsCount}</View>
            <View
              className="order_shop_btnBox order_shop_btn2"
              onClick={() => computedCount("add")}
            ></View>
          </View>
        </View>
      </View>
      <View className="order_shop_price">
        <View className="order_shop_label">商品总额</View>
        <View className="order_shop_count"></View>
      </View>
    </View>
  );
};
