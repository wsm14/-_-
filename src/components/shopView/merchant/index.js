import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View } from "@tarojs/components";
import {
  getLat,
  getLnt,
  GetDistance,
  filterStrList,
  mapGo,
} from "@/common/utils";
import MakePhone from "@/components/payTelephone";
import classNames from "classnames";
import Router from "@/common/router";
import "./index.scss";

export default (props) => {
  const { data, serviceType, ownerServiceId } = props;
  const {
    merchantName,
    useTime,
    telephone,
    lat,
    lnt,
    address,
    merchantIdString,
    businessTime,
    ownerType = "merchant",
    ownerIdString,
    merchantCount,
  } = data;
  console.log(data);
  const [visible, setVisible] = useState(false);
  return (
    <View className="merchant__com_box">
      <View className="merchant__com_title">适用门店</View>
      <View
        onClick={() =>
          Router({
            routerName: "merchantDetails",
            args: {
              merchantId: merchantIdString,
            },
          })
        }
        className="merchantcom_name public_auto"
      >
        <View className="merchant_com_nameLeft font_hide">{merchantName}</View>
        <View className="merchant_com_Right">
          <View className="merchant_com_RightIcon merchant_com_RightIcon1"></View>
          <View className="merchant_com_RightFont">主页</View>
        </View>
      </View>
      {businessTime && (
        <View className="merchant_com_time color2 font24">
          营业时间: {businessTime}
        </View>
      )}
      <View className="merchant_com_telephone public_auto">
        <View className="merchant_com_telephoneMax color2 font24 font_hide">
          商家电话：{telephone}
        </View>
        <View className="merchant_com_Right">
          <View className="merchant_com_RightIcon merchant_com_RightIcon2"></View>
          <View
            className="merchant_com_RightFont"
            onClick={() => setVisible(true)}
          >
            拨打
          </View>
        </View>
      </View>
      <View className="merchant_com_address public_auto">
        <View className=" color2 font24 merchant_com_max font_hide">
          商家地址：距您
          {GetDistance(getLat(), getLnt(), lat, lnt)}｜{address}
        </View>
        <View className="merchant_com_Right">
          <View className="merchant_com_RightIcon merchant_com_RightIcon3"></View>
          <View
            className="merchant_com_RightFont"
            onClick={() =>
              mapGo({
                lat: lat,
                lnt: lnt,
                address,
                merchantName,
              })
            }
          >
            导航
          </View>
        </View>
      </View>
      {visible && (
        <MakePhone
          onClose={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          data={filterStrList(telephone)}
        ></MakePhone>
      )}
      {ownerType === "group" && merchantCount > 1 && (
        <View
          className="merchant_group_btn"
          onClick={() =>
            Router({
              routerName: "groupList",
              args: {
                ownerServiceId,
                ownerId: ownerIdString,
              },
            })
          }
        >
          更多{merchantCount}家门店可用
        </View>
      )}
    </View>
  );
};
