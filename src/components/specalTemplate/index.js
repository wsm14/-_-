import React from "react";
import { Text, View } from "@tarojs/components";
import Router from "@/common/router";
import {
  toast,
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  computedPrice,
} from "@/common/utils";
import ButtonView from "@/components/Button";
import Date from "@/components/dateTime";
import "./index.scss";
export const template = (item, configUserLevelInfo) => {
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const {
    goodsId,
    goodsName,
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
    merchantPrice,
  } = item;
  return (
    <View
      className="specialOffer_shop animated fadeIn"
      onClick={() =>
        Router({
          routerName: "favourableDetails",
          args: {
            specialActivityId: specialActivityIdString,
            merchantId: merchantIdString,
          },
        })
      }
    >
      <View
        style={backgroundObj(goodsImg)}
        className="specialOffer_shopImg"
      ></View>
      <View className="specialOffer_desc">
        <View className="specialOffer_title  font_noHide">{goodsName}</View>
        <View className="specialOffer_userDetails font_hide">
          <View
            className="specialOffer_userprofile"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="specialOffer_username font_hide">
            {" "}
            {merchantName}
          </View>
          <View className="specialOffer_limit">
            {" "}
            ｜ {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="specialOffer_date_price">
          {" "}
          <Text className="specialOffer_price_text">¥ </Text>
          {realPrice}
          {shareCommission !== 0 && (
            <View className="specialOffer_share_text">
              /赚¥
              {computedPrice(realPrice - merchantPrice, shareCommission)}
            </View>
          )}
        </View>
        <View className="specialOffer_date_rel">¥ {oriPrice}</View>
        <View className="specialOffer_bean_border">
          <View
            className="specialOffer_bean_box"
            style={{ border: "1px solid #ef476f" }}
          >
            卡豆可抵 ¥{(realPrice * (payBeanCommission / 100)).toFixed(2)}
          </View>
        </View>
      </View>
      <ButtonView>
        <View className="specialOffer_bottom_btn">抢购</View>
      </ButtonView>
    </View>
  );
};

export const childTemplate = (item, configUserLevelInfo, type = "hot") => {
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  const {
    goodsId,
    goodsName,
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
    merchantPrice,
    activityEndTime,
    activityTimeRule = "infinite",
    buyUserImageList = [],
  } = item;
  const leftTemplate = {
    hot:
      activityTimeRule !== "infinite" ? (
        <View className="specialOffer_shop_text">
          <Date times={activityEndTime} fn={() => {}}></Date>
        </View>
      ) : (
        <View className="color1 font28">长期有效</View>
      ),
    today: (
      <View className="specialOffer_profile">
        {buyUserImageList.map((item, index) => {
          if (index === 0) {
            return (
              <View
                className="specialOffer_profile_box dakale_profile"
                style={backgroundObj(item)}
              ></View>
            );
          } else {
            return (
              <View
                className="specialOffer_profile_box dakale_profile specialOffer_profile_left"
                style={backgroundObj(item)}
              ></View>
            );
          }
        })}
        <View className="specialOffer_left_pay">抢购中</View>
      </View>
    ),
  }[type];
  return (
    <View className="specialOffer_shop_box">
      <View
        className="specialOffer_shop_child animated fadeIn"
        onClick={() =>
          Router({
            routerName: "favourableDetails",
            args: {
              specialActivityId: specialActivityIdString,
              merchantId: merchantIdString,
            },
          })
        }
      >
        <View
          style={backgroundObj(goodsImg)}
          className="specialOffer_shopImg"
        ></View>
        <View className="specialOffer_desc">
          <View className="specialOffer_title  font_noHide">{goodsName}</View>
          <View className="specialOffer_userDetails font_hide">
            <View
              className="specialOffer_userprofile"
              style={backgroundObj(merchantLogo)}
            ></View>
            <View className="specialOffer_username font_hide">
              {" "}
              {merchantName}
            </View>
            <View className="specialOffer_limit">
              {" "}
              ｜ {GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
          <View className="specialOffer_date_price">
            {" "}
            <Text className="specialOffer_price_text">¥ </Text>
            {realPrice}
            {shareCommission !== 0 && (
              <View className="specialOffer_share_text">
                /赚¥
                {computedPrice(realPrice - merchantPrice, shareCommission)}
              </View>
            )}
          </View>
          <View className="specialOffer_date_rel">¥ {oriPrice}</View>
          <View className="specialOffer_bean_border">
            <View
              className="specialOffer_bean_box"
              style={{ border: "1px solid #ef476f" }}
            >
              卡豆可抵 ¥{(realPrice * (payBeanCommission / 100)).toFixed(2)}
            </View>
          </View>
        </View>
      </View>
      <View className="specialOffer_shop_bottom public_auto">
        {leftTemplate}
        <View className="specialOffer_shop_btn">立即抢购</View>
      </View>
    </View>
  );
};
