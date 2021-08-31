import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { ScrollView, Text, View } from "@tarojs/components";
import InterTime from "@/components/InterTime";
import ImageShow from "@/relay/components/ImageShow";
import Router from "@/common/router";
import { GOODS_BY_TYPE } from "@/relay/common/constant";
import { backgroundObj,  } from "@/common/utils";
export default (props) => {
  const { data } = props;
  const {
    createTime,
    status,
    communityOrganizationGoods = {},
    totalFee,
    beanFee,
    payFee,
  } = data;
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
    title,
    communityOrganizationId,
    relateOwnerId,
  } = communityOrganizationGoods;

  return (
    <View>
      {" "}
      <View className="detailPges_order_cardShop">
        <View className="detailPges_order_ShopTitle">
          <View
            className="detailPges_order_ShopProfile"
            style={backgroundObj(relateOwnerProfile)}
          ></View>
          <View className="detailPges_order_ShopName font_hide">
            {relateOwnerName}
          </View>
          <View
            className="detailPges_order_ShopType"
            onClick={() =>
              Router({
                routerName: "communityGoods",
                args: { communityOrganizationId, ownerId: relateOwnerId },
              })
            }
          >
            <View className="detailPges_order_ShopType1  font_hide">
              {title}
            </View>
            <View className="detailPges_order_ShopType2"></View>
          </View>
        </View>
        <View className="detailPges_order_ShopContent">
          <View className="detailPges_order_contentImg dakale_nullImage">
            <ImageShow width={160} src={goodsImg}></ImageShow>
          </View>
          <View className="detailPges_order_contentBody">
            <View className="detailPges_order_BodyText font_noHide">
              {goodsName}
            </View>
            <View className="detailPges_order_Bodyfont">×{goodsCount}</View>
          </View>
          <View className="detailPges_order_Bodyprice">¥ {goodsPrice}</View>
        </View>
        <View className="detailPges_order_price public_auto color1 font24">
          <View>商品金额</View>
          <View>¥{totalFee}</View>
        </View>
        {beanFee && (
          <View className="detailPges_order_bean public_auto">
            <View className="color2 font24">卡豆优惠抵扣</View>
            <View className="color3 font24">
              -{beanFee + " "}
              {`(¥${(beanFee / 100).toFixed(2)})`}
            </View>
          </View>
        )}
      </View>
      <View className="detailPges_order_info">
        <Text className="font20 color2">共{goodsCount}件</Text>
        <Text className="font28 color1 price_margin8">
          {" "}
          {status === "3" || status === "1" ? "实付款：" : "待付款："}
        </Text>
        <Text className="font28 color3 price_margin8">¥ {payFee}</Text>
      </View>
    </View>
  );
};
