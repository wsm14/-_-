import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { ScrollView, Text, View } from "@tarojs/components";
import InterTime from "@/components/InterTime";
import ImageShow from "@/relay/components/ImageShow";
import Router from "@/common/router";
import "./index.scss";
export default (props) => {
  const { data } = props;
  console.log(data);
  const { createTime, status, organizationGoodsOrderDescObject } = data;
  const {
    goodsCount,
    goodsImg,
    goodsName,
    goodsPrice,
    liftingAddress,
    liftingContentPerson,
  } = organizationGoodsOrderDescObject;
  //订单支付渲染模板
  const orderTitle = {
    0: <View className="color3">待支付</View>,
    1: <View className="color4">已支付</View>,
    2: <View className="color2">已关闭</View>,
    3: <View className="color2">已完成</View>,
  }[status];
  return (
    <View className="relay_order_shopCardInfo">
      {status === "0" && (
        <View className="relay_order_computedTime">
          请在
          <InterTime
            fn={() => updateStatus(item)}
            times={createTime}
          ></InterTime>
          内支付，过期订单自动关闭
        </View>
      )}
      <View className="relay_order_cardTop">
        <View className="relay_order_cardTitle">暂无跟团号</View>
        <View className="relay_order_cardTime"></View>
        <View className="relay_order_status">{orderTitle}</View>
      </View>
      <View className="relay_order_cardShop">
        <View className="relay_order_ShopTitle">
          <View className="relay_order_ShopProfile"></View>
          <View className="relay_order_ShopName font_hide">
            二狗烘焙（国泰科技…
          </View>
          <View className="relay_order_ShopType">
            <View className="relay_order_ShopType1  font_hide">
              【顺丰包邮】优质… 【顺丰包邮】优质…
            </View>
            <View className="relay_order_ShopType2"></View>
          </View>
        </View>
        <View className="relay_order_ShopContent">
          <View className="relay_order_contentImg">
            <ImageShow width={160} src={goodsImg}></ImageShow>
          </View>
          <View className="relay_order_contentBody">
            <View className="relay_order_BodyText font_noHide">
              商品名称商品名称商品名称商品
            </View>
            <View className="relay_order_Bodyfont">×1</View>
          </View>
          <View className="relay_order_Bodyprice">¥ 69</View>
        </View>
        <View className="relay_order_cardUser">
          <View className="relay_cardUser_title">顾客自提</View>
          <View className="relay_cardUser_content">
            <View className="relay_cardUser_meAddress">
              <View className="relay_cardUser_meAddressMax font_hide">
                <Text>自提点：</Text>
                <Text className="bold">国泰科技大厦</Text>
              </View>
            </View>
            <View className="relay_cardUser_teartext">
              浙江省杭州市萧山区宁卫街道萧山区宁卫街道萧山区宁卫街道萧山区宁卫街道78号
            </View>
            <View className="relay_cardUser_userName">
              联系人：刘 187****6767
            </View>
            <View className="relay_cardUser_userDetails">
              <View className="relay_cardUser_meAddressMax font_hide">
                <Text className="color1">用户昵称昵称昵称昵称</Text>
                <Text className="color2">18679068769</Text>
              </View>
            </View>
            <View className="relay_cardUser_userAddress">
              浙江省杭州市萧山区宁卫街道萧山区宁卫街道区宁卫街道
            </View>
            <View className="relay_cardUser_remark">
              <View className="relay_cardUser_remakeMax font_hide">
                <Text className="color1">团员备注: </Text>
                <Text className="color3">国泰科技大厦</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
