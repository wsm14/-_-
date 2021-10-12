import React from "react";
import { useRouter } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import Router from "@/common/router";
import "./index.scss";

/**
 * 用户联系地址商品信息
 */
export default ({ detail }) => {
  // 路由获取参数 blindBoxRewardId
  const routeParams = useRouter().params;
  const { blindBoxRewardId } = routeParams;

  const {
    logisticsStatus,
    addressName,
    mobile,
    prizeImg,
    address,
    showName,
    prize,
    type, // 奖品类型 bean-卡豆 commerce-电商商品
  } = detail;

  const INOF_STATUS = ["待完善收货信息", "待发货", "已发货"];

  return (
    <View className="prize_UserInfo">
      {type === "commerce" ? (
        logisticsStatus == 0 ? (
          // 没有信息时
          <View
            className="prize_location center"
            onClick={() =>
              Router({
                routerName: "delivery",
                args: {
                  blindType: 1,
                  blindBoxRewardId,
                },
              })
            }
          >
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
                {/* 用户 */}
                <Text className="prize_user_name">{addressName}</Text>
                {/* 电话 */}
                <Text className="prize_user_phone">{mobile}</Text>
              </View>
              {/* 地址 */}
              <View className="prize_user_address">{address}</View>
            </View>
          </View>
        )
      ) : (
        ""
      )}
      <View className="prize_goodsInfo">
        {/* 商品图片 */}
        <Image
          src={prizeImg}
          mode="aspectFill"
          className="prize_goods_img"
        ></Image>
        <View className="prize_goods_detail">
          <View className="prize_goods">
            {/* 商品名称 */}
            <View className="prize_goods_name">{showName}</View>
            {/* 灰色样式 end */}
            <View
              className={`prize_order_status ${
                logisticsStatus == 0 ? "" : "end"
              }`}
            >
              {INOF_STATUS[logisticsStatus]}
            </View>
          </View>
          {/* 卡豆是卡豆数 商品是数量 */}
          <View className="prize_goods_number">数量：{prize}</View>
        </View>
      </View>
    </View>
  );
};
