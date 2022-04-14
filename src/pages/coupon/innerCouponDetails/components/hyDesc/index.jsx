/*券的为你推荐*/
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  return (
    <View className="innerDesc_box">
      <View className="innerDesc_title">用券立省</View>
      <View className="innerDesc_flex_box public_auto">
        <View
          className="innerDesc_flex_content innerDesc_flex_contentBg3"
          onClick={() => {
            Router({
              routerName: "recharge",
            });
          }}
        ></View>
        <View
          className="innerDesc_flex_content innerDesc_flex_contentBg4"
          onClick={() => {
            Router({
              routerName: "rechargeMemberList",
            });
          }}
        ></View>
      </View>
      <View className="innerDesc_flex_desc">
        <View className="innerDesc_flex_descTitle">购买说明</View>
        <View className="innerDesc_flex_font">
          1. 购买期间，此活动区域的商品不支持退款。
        </View>
        <View className="innerDesc_flex_font">
          2.
          购买的商品如果账户卡豆不足时，无法购买，可通过刷视频/做日常任务赚取更多。
        </View>
        <View className="innerDesc_flex_font">
          3. 禁止使用非法手段进行刷取卡豆，一经发现，平台将会对于账号进行处罚。
        </View>
        <View className="innerDesc_flex_font">
          4. 如有任何疑问请联系客服400-800-5881。
        </View>
      </View>
      <View className="innerDesc_flex_logo">
        <View className="innerDesc_flex_logoImg"></View>
      </View>
    </View>
  );
};
