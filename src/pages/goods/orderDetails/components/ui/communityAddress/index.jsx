import React from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import {
  backgroundObj,
  filterPayfont,
  objStatus,
  getLat,
  getLnt,
  mapGo,
} from "@/utils/utils";
export default (props) => {
  const { data = {} } = props;
  const GOODS_BY_TYPE = {
    self: "顾客自提",
    send: "送货上门",
    noLogistics: "无需物流",
  };
  let { communityOrganizationGoods = {} } = data;
  const {
    writeMobile,
    writeContactPerson,
    writeAddress,
    logisticsType,
    liftingName,
    address,
    mobile,
    contactPerson,
    lat,
    lnt,
  } = communityOrganizationGoods;
  const templateCenter = {
    noLogistics: (
      <>
        <View className="communityAddress_useName">
          {writeContactPerson} {writeMobile}
        </View>
        <View className="communityAddress_details">{writeAddress}</View>
      </>
    ),
    send: (
      <>
        <View className="communityAddress_useName">
          {writeContactPerson} {writeMobile}
        </View>
        <View className="communityAddress_details">{writeAddress}</View>
      </>
    ),
    self: (
      <>
        {liftingName && (
          <View className="communityAddress_self_top">
            自提点：{liftingName}
          </View>
        )}
        {address && (
          <View
            className="communityAddress_self_content  font_hide"
            onClick={(e) => {
              e.stopPropagation();
              mapGo({
                lat: lat,
                lnt: lnt,
                address: address,
                merchantName: "",
              });
            }}
          >
            {address}
          </View>
        )}
        {contactPerson && (
          <View
            className="communityAddress_self_mobile  font_hide"
            onClick={(e) => {
              e.stopPropagation();
              Taro.makePhoneCall({
                phoneNumber: mobile,
                fail: (res) => {
                  toast("团长暂未设置联系电话");
                },
                complete: (res) => {},
              });
            }}
          >
            联系人： {contactPerson}
          </View>
        )}
        <View className="communityAddress_useName">
          {writeContactPerson} {writeMobile}
        </View>
        <View className="communityAddress_details">{writeAddress}</View>
      </>
    ),
  }[logisticsType];
  console.log(templateCenter);
  return (
    <View className="communityAddress_box">
      <View className="communityAddress_title">
        {GOODS_BY_TYPE[logisticsType]}
      </View>
      {templateCenter}
    </View>
  );
};
