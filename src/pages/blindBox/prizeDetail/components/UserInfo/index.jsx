import React from "react";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";

/**
 * 用户联系地址商品信息
 */
export default ({ data }) => {
  return (
    <View className="prize_UserInfo">
      {!data ? (
        // 没有信息时
        <View className="prize_location center">
          <View className="prize_location_icon"></View>
          <View className="prize_info">完善收货信息才可以发货哦</View>
          <View className="prize_goSet">去完善</View>
        </View>
      ) : (
        // 存在信息时
        <View className="prize_location info">
          <View className="prize_location_icon info"></View>
          <View className="prize_info">
            <View className="prize_user">
              <Text className="prize_user_name">晴天</Text>
              <Text className="prize_user_phone">18912345678</Text>
            </View>
            <View className="prize_user_address">
              完善收货信息才可以发货哦完善收货信息才可以发货哦完善收货信息才可以发货哦完善收货信息才可以发货哦完善收货信息才可以发货哦完善收货信息才可以发货哦
            </View>
          </View>
        </View>
      )}
      <View className="prize_goodsInfo">
        <Image
          src={
            "https://wechat-config.dakale.net/miniprogram/blind/home/home_head.png"
          }
          mode="aspectFill"
          className="prize_goods_img"
        ></Image>
        <View className="prize_goods_detail">
          <View className="prize_goods">
            <View className="prize_goods_name">iPhone13</View>
            <View className="prize_order_status ">待完善收货信息</View>
          </View>
          <View className="prize_goods_number">数量：1</View>
        </View>
      </View>
    </View>
  );
};
