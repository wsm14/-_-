import React from "react";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";

/**
 * 盲盒购物区域
 */
export default () => {
  return (
    <View className="blind_GoodsContent">
      <View className="blind_GoodsContent_Gorup">
        <View className="blind_GoodsContent_title bean"></View>
        <View className="blind_Goods_group">
          <View className="blind_Goods_cell">
            <Image
              src={
                "https://wechat-config.dakale.net/miniprogram/blind/home/home_head.png"
              }
              mode="aspectFill"
              className="blind_Goods_img"
            ></Image>
            <View className="blind_Goods_info">
              <View className="blind_Goods_name">
                特价红富士特价红富士特价特价红富士特价红富士特价红…
              </View>
              <View className="blind_Goods_store">
                <Image
                  src={
                    "https://wechat-config.dakale.net/miniprogram/blind/home/home_head.png"
                  }
                  mode="aspectFill"
                  className="blind_Goods_storeIcon"
                ></Image>
                <View className="blind_Goods_storeName">
                  鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果鲜丰水果
                </View>
                ｜200m
              </View>
              <View className="blind_Goods_priceContent">
                原价: <Text className="blind_Goods_price">¥9.99</Text>
              </View>
              <View className="blind_Goods_oriContent">
                优惠价: <Text className="blind_Goods_oriPrice">¥9.99</Text>
              </View>
              <View className="lookAround_new_bean">
                <View className="bean_getInfo lookAround_new_img"></View>
                <View className="lookAround_new_pay">¥999</View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
