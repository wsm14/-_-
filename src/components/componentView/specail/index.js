import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { GetDistance, getLnt, getLat, backgroundObj } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
export const specailGoods = (item, val = {}) => {
  const {
    goodsId,
    goodsImg,
    oriPrice,
    realPrice,
    lnt,
    lat,
    status,
    goodsType,
    merchantAddress,
    merchantName,
    merchantLogo,
    merchantIdString,
    specialActivityIdString,
    goodsName,
    merchantPrice,
  } = item;
  const { payBeanCommission = 50, shareCommission = 0 } = val;
  return (
    <View className="specail_hot_box">
      <View
        className="specail_hot_specalImage"
        style={backgroundObj(goodsImg)}
        onClick={() =>
          Router({
            routerName: "favourableDetails",
            args: {
              specialActivityId: specialActivityIdString,
              merchantId: merchantIdString,
            },
          })
        }
      ></View>
      <View className="specail_hot_font font_noHide">{goodsName}</View>
      <View className="specail_hot_limit">
        距您 {GetDistance(getLat(), getLnt(), lat, lnt)}
      </View>
      <View className="specail_hot_toast">卡豆抵扣到手价</View>
      <View className="specail_hot_price font_hide">
        <View className="specail_price_text">¥ </View>
        {(realPrice * ((100 - payBeanCommission) / 100)).toFixed(2)}
        <View className="specail_share_text specail_share_textMargin">
          {" "}
          ¥ {oriPrice}
        </View>
      </View>

      {shareCommission !== 0 && (
        <View className="specail_bean_border">
          <View
            style={{ border: "1px solid #ef476f" }}
            className="specail_bean_box"
          >
            <View className="specail_share_text">
              赚¥
              {((realPrice - merchantPrice) * (shareCommission / 100)).toFixed(
                2
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
