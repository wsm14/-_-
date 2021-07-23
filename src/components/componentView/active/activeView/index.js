import React from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import classNames from "classnames";
import { getLat, getLnt, GetDistance, backgroundObj } from "@/common/utils";
export const goodsView = (item, val = "import", userInfo) => {
  const { merchantName, merchantLogo, GetDistance } = item;
  return (
    <View classNames={classNames("activeView_box", val)}>
      <View className="activeView_image">
        {/* <Image lazyLoad mode={'aspectFill'} src={} className='activeView_image_box'></Image> */}
      </View>
      <View className="activeView_about">
        <View className="activeView_name font_hide"></View>
        <View className="activeView_user">
          <View
            className="activeView_user_userProfile merchant_dakale_logo"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="activeView_user_userHide font_hide">
            <View className="activeView_user_merchantName font_hide">
              {merchantName}
            </View>
            <View className="price_margin8">
              {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
        </View>
        <View className="activeView_oldPrice">
          <View className="font24">原价:</View>
          <View className="font28 text_through price_margin4">¥9.99</View>
        </View>
        <View className="activeView_relPrice">
          <View className="font24">原价:</View>
          <View className="font28 text_through price_margin4">¥9.99</View>
        </View>
        <View className="activeView_card">
          <View class="activeView_card_box">
            <View class="activeView_card_left">卡豆再省</View>
            <View class="activeView_card_san"></View>
            <View class="activeView_card_right">￥99</View>
          </View>
        </View>
      </View>
    </View>
  );
};
