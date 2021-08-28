import React from "react";
import { Text, View } from "@tarojs/components";
import InterTime from "@/components/InterTime";
import ImageShow from "@/relay/components/ImageShow";
import Router from "@/common/router";
import { GOODS_BY_TYPE } from "@/relay/common/constant";
import { backgroundObj } from "@/common/utils";
import GoodsTools from "../GoodsTools";

export default (props) => {
  const { data } = props;
  const { createTime, status, organizationGoodsOrderDescObject, orderSn } =
    data;
  const {
    goodsCount,
    goodsImg,
    goodsName,
    goodsPrice,
    liftingAddress,
    liftingContentPerson,
    liftingMobile,
    organizationNumber,
    relateOwnerProfile,
    relateOwnerName,
    logisticsType,
    remark,
    writeAddress,
    writeContactPerson,
    writeMobile,
  } = organizationGoodsOrderDescObject;

  //订单支付渲染模板
  const orderTitle = {
    0: <View className="color3">待支付</View>,
    1: <View className="color4">已支付</View>,
    2: <View className="color2">已关闭</View>,
    3: <View className="color2">已完成</View>,
  }[status];
  const template = () => {
    if (organizationNumber) {
      return <Text className="color3">{organizationNumber}</Text>;
    } else {
      return null;
    }
  };
  return (
    <View
      onClick={(e) => {
        e.stopPropagation();
        Router({
          routerName: "orderDetails",
          args: { orderSn },
        });
      }}
      className="relay_order_shopCardInfo"
    >
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
        <View className="relay_order_cardTitle">
          {!organizationNumber ? "暂无跟团号" : `跟团号: `}
          {template()}
        </View>
        <View className="relay_order_cardTime">{createTime}</View>
        <View className="relay_order_status">{orderTitle}</View>
      </View>
      <View className="relay_order_cardShop">
        <View className="relay_order_ShopTitle">
          <View
            className="relay_order_ShopProfile"
            style={backgroundObj(relateOwnerProfile)}
          ></View>
          <View className="relay_order_ShopName font_hide">
            {relateOwnerName}
          </View>
          <View className="relay_order_ShopType">
            <View className="relay_order_ShopType1  font_hide">
              【顺丰包邮】优质… 【顺丰包邮】优质…
            </View>
            <View className="relay_order_ShopType2"></View>
          </View>
        </View>
        <View className="relay_order_ShopContent">
          <View className="relay_order_contentImg dakale_nullImage">
            <ImageShow width={160} src={goodsImg}></ImageShow>
          </View>
          <View className="relay_order_contentBody">
            <View className="relay_order_BodyText font_noHide">
              {goodsName}
            </View>
            <View className="relay_order_Bodyfont">×{goodsCount}</View>
          </View>
          <View className=" font_hide">¥ {goodsPrice}</View>
        </View>
        <View className="relay_order_cardUser">
          <View className="relay_cardUser_title">
            {GOODS_BY_TYPE[logisticsType]}
          </View>
          <View className="relay_cardUser_content">
            {logisticsType === "self" && (
              <View>
                {" "}
                <View className="relay_cardUser_meAddress">
                  <View className="relay_cardUser_meAddressMax font_hide">
                    <Text>自提点：</Text>
                    <Text className="bold">国泰科技大厦</Text>
                  </View>
                </View>
                <View className="relay_cardUser_teartext">
                  {liftingAddress}
                </View>
                <View className="relay_cardUser_userName">
                  联系人：{liftingContentPerson}
                  {liftingMobile}
                </View>
              </View>
            )}
            <View className="relay_cardUser_userDetails">
              <View className="relay_cardUser_meAddressMax font_hide">
                <Text className="color1">{writeContactPerson + " "}</Text>
                <Text className="color2">{writeMobile}</Text>
              </View>
            </View>
            <View className="relay_cardUser_userAddress">{writeAddress}</View>
            {remark && (
              <View className="relay_cardUser_remark">
                <View className="relay_cardUser_remakeMax font_hide">
                  <Text className="color1">团员备注: </Text>
                  <Text className="color3">{remark}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
        {/* 底部工具栏 */}
        <GoodsTools data={data}></GoodsTools>
      </View>
    </View>
  );
};
