import React, { useEffect, useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import "./index.scss";
export default ({
  data,
  list,
  startGroupUser,
  type,
  userJoinStatus,
  joinGroupUserDetail = {},
  onChange,
}) => {
  const { togetherEarnGoodsObject = {}, joinUserNum } = data;

  const {
    costPrice,
    goodsDesc,
    goodsDescImg,
    goodsIdString,
    goodsImg,
    goodsName,
    goodsType,
    oriPrice,
    ownerIdString,
    togetherPrice,
  } = togetherEarnGoodsObject;

  return (
    <View className="collageDownload_shopCard_box">
      <View className="collageDownload_template_box">
        <View
          style={backgroundObj(goodsImg)}
          className="collageDownload_shop_profile"
        ></View>
        <View className="collageDownload_shop_content font_hide">
          <View className="collageDownload_shop_username font_noHide">
            {goodsName}
          </View>
          <View className="collageDownload_shop_count public_auto"></View>
          <View className="collageDownload_shop_price">
            <View className="font24 color1">拼团价:</View>
            <View className="price_margin4 font40 color3 bold">
              ¥{togetherPrice}
            </View>
            <View className="collageDownload_shop_throuer">原价:</View>
            <View className="font20 text_through collageDownload_margin color2">
              {oriPrice}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
