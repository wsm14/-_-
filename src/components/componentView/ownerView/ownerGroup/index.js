import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { backgroundObj } from "@/common/utils";
import Router from "@/common/router";
export default ({ data }) => {
  const {
    activityGoodsNum,
    brandLogo,
    brandName,
    groupName,
    merchantGroupIdString,
  } = data;
  console.log(data);
  return (
    <View
      class="ownerGroup_box"
      onClick={(e) => {
        e.stopPropagation();

        Router({
          routerName: "groupDetails",
          args: {
            merchantGroupId: merchantGroupIdString,
          },
        });
      }}
    >
      <View className="ownerGroup_info_box">
        <View
          class="ownerGroup_info_profile merchant_dakale_logo"
          style={backgroundObj(brandLogo)}
        ></View>
        <View class="ownerGroup_info_content">
          <View className="ownerGroup_info_title font_hide">{groupName}</View>
          <View className="ownerGroup_info_contentbox">
            {activityGoodsNum ? (
              <View className="ownerGroup_info_specal">
                {activityGoodsNum}款特惠热卖中
              </View>
            ) : null}
            <View
              className="ownerGroup_info_near"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              附近门店
            </View>
          </View>
        </View>
      </View>
      <View className="ownerGroup_info_link"></View>
    </View>
  );
};
