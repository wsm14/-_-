import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { ScrollView, Text, View } from "@tarojs/components";
import { GOODS_BY_TYPE } from "@/relay/common/constant";
import { backgroundObj, mapGo, toast } from "@/common/utils";
export default (props) => {
  const { data } = props;
  console.log(data);
  const { createTime, status, communityOrganizationGoods = {} } = data;
  const {
    logisticsType,
    remark,
    writeAddress,
    writeContactPerson,
    writeMobile,
    relateOwnerName,
    mobile,
    contactPerson,
    address,
    liftingName,
    liftingAddress,
    lat,
    lnt,
  } = communityOrganizationGoods;
  console.log(communityOrganizationGoods);

  //订单支付渲染模板
  return (
    <View className="detailPges_order_cardUser">
      <View className="detailPges_cardUser_title">
        {GOODS_BY_TYPE[logisticsType]}
      </View>
      <View className="detailPges_cardUser_content">
        {logisticsType === "self" && (
          <View>
            {" "}
            <View className="detailPges_cardUser_meAddress">
              <View className="detailPges_cardUser_meAddressMax font_hide">
                <Text>自提点：</Text>
                <Text className="bold">{liftingName}</Text>
              </View>
            </View>
            <View
              className="detailPges_cardUser_teartext"
              onClick={(e) => {
                e.stopPropagation();
                mapGo({
                  lat: lat,
                  lnt: lnt,
                  address: address,
                  merchantName: liftingName,
                });
              }}
            >
              {address}
            </View>
            <View
              className="detailPges_cardUser_userName"
              onClick={(e) => {
                e.stopPropagation();
                Taro.makePhoneCall({
                  phoneNumber: mobile,
                  fail: (res) => {
                    toast("拨打失败");
                  },
                  complete: (res) => {},
                });
              }}
            >
              联系人：{contactPerson}
              {mobile}
            </View>
          </View>
        )}
        <View className="detailPges_cardUser_userDetails">
          <View className="detailPges_cardUser_meAddressMax font_hide">
            <Text className="color1">{writeContactPerson + " "}</Text>
            <Text className="color2">{writeMobile}</Text>
          </View>
        </View>
        <View className="detailPges_cardUser_userAddress">{writeAddress}</View>
        {remark && (
          <View className="detailPges_cardUser_remark">
            <View className="detailPges_cardUser_remakeMax font_hide">
              <Text className="color1">团员备注: </Text>
              <Text className="color3">{remark}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
