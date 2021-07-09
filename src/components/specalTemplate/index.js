import React from "react";
import { Text, View } from "@tarojs/components";
import Router from "@/common/router";
import Taro from "@tarojs/taro";
import {
  toast,
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  computedPrice,
  computedBeanPrice,
} from "@/common/utils";
import ButtonView from "@/components/Button";
import Date from "@/components/dateTime";
import classNames from "classnames";
import "./index.scss";
export const template = (item, configUserLevelInfo, animate = true) => {
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
      className={classNames("specialOffer_shop", animate && "animated fadeIn")}
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
            className="specialOffer_userprofile dakale_profile"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="specialOffer_userHide">
            <View className="specialOffer_username font_hide">
              {" "}
              {merchantName}
            </View>
            <View className="specialOffer_limit">
              {" "}
              ｜{GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
        </View>
        <View className="specialOffer_hot_price color1 font_hide">
          <View className="font24">原价:</View>
          <View className="specialOffer_hot_priceMax font_hide font28 price_margin4 bold  text_through">
            ¥{oriPrice}
          </View>
          <View className="font24 price_margin8">优惠价: </View>
          <View className="font28 price_margin4 bold">¥{realPrice}</View>
        </View>
        <View className="specialOffer_bean_price">卡豆抵扣后最低到手价</View>
        <View className="specialOffer_bean_show">
          <View className="color3 font36 bold specialOffer_bean_showText">
            <View className="color3 font20 bold">¥ </View>
            <View className="price_margin4">
              {computedBeanPrice(realPrice, payBeanCommission)}
            </View>
          </View>
        </View>
      </View>
      <ButtonView>
        <View className="specialOffer_new_btn">
          {shareCommission > 0 ? (
            <View>
              分享赚
              <Text className="bold">
                ¥{computedPrice(realPrice - merchantPrice, shareCommission)}
              </Text>
            </View>
          ) : (
            "抢购"
          )}
        </View>
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
      activityTimeRule !== "infinite" && activityTimeRule !== "" ? (
        <View className="specialOffer_shop_text">
          <Date styles times={activityEndTime} fn={() => {}}></Date>
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
    <View
      className="specialOffer_shop_box"
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
      <View className="specialOffer_shop_child animated fadeIn">
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
            <View className="specialOffer_userHide">
              <View className="specialOffer_username font_hide">
                {" "}
                {merchantName}
              </View>
              <View className="specialOffer_limit">
                {" "}
                ｜ {GetDistance(getLat(), getLnt(), lat, lnt)}
              </View>
            </View>
          </View>
          <View className="specialOffer_hot_price color1 font_hide">
            <View className="font24">原价:</View>
            <View className="specialOffer_hot_priceMax font_hide font28 price_margin4 bold text_through">
              ¥{oriPrice}
            </View>
            <View className="font24 price_margin8">优惠价: </View>
            <View className="font28 price_margin4 bold">¥{realPrice}</View>
          </View>
          <View className="specialOffer_bean_price">卡豆抵扣后最低到手价</View>
          <View className="specialOffer_bean_show">
            <View className="color3 font36 bold specialOffer_bean_showText">
              <View className="color3 font20 bold">¥</View>
              {computedBeanPrice(realPrice, payBeanCommission)}
            </View>
            {shareCommission > 0 && (
              <View
                style={{
                  border: "1px solid #ef476f",
                  padding: `0 ${Taro.pxTransform(8)}`,
                  height: Taro.pxTransform(32),
                }}
                className="specialOffer_bean_getMoney font_hide"
              >
                赚
                <Text className="bold">
                  ¥{computedPrice(realPrice - merchantPrice, shareCommission)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View className="specialOffer_shop_bottom public_auto">
        {leftTemplate}
        <View className="specialOffer_shop_btn">
          {shareCommission > 0 ? "分享赚" : "立即抢购"}
        </View>
      </View>
    </View>
  );
};

export const couponTemplate = (item, configUserLevelInfo) => {
  const { payBeanCommission = 50, shareCommission = 0 } = configUserLevelInfo;
  let nullCoupon =
    "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/coupon_big.png";
  let nullImage =
    "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/conpon_shop.png";
  const {
    couponImg,
    couponName,
    merchantLogo,
    lat,
    lnt,
    buyPrice,
    merchantPrice,
    merchantName,
    buyRule,
    personLimit,
    dayMaxBuyAmount,
    reduceObject: { couponPrice, thresholdPrice },
    ownerCouponIdString,
    ownerIdString,
    merchantIdString,
  } = item;
  const templateSelect = () => {
    if (buyRule === "unlimited") {
      return `不限购`;
    } else {
      if (buyRule === "personLimit") {
        return `每人限购${personLimit}份`;
      } else {
        return `每人每天限购${dayMaxBuyAmount}份`;
      }
    }
  };
  return (
    <View
      className="specialOffer_shop animated fadeIn"
      onClick={() =>
        Router({
          routerName: "payCouponDetails",
          args: {
            ownerCouponId: ownerCouponIdString,
            ownerId: ownerIdString,
            merchantId: merchantIdString,
          },
        })
      }
    >
      <View
        style={backgroundObj(couponImg || nullCoupon)}
        className="specialOffer_shopImg"
      ></View>
      <View className="specialOffer_desc">
        <View className="specialOffer_coupon_title  font_hide">
          {couponName}
        </View>
        <View className="specialOffer_coupon_details font_hide">
          {thresholdPrice ? `满元${thresholdPrice}可用 | ` : ""}
          {templateSelect()}
        </View>
        <View className="specialOffer_userDetails font_hide">
          <View
            className="specialOffer_userprofile"
            style={backgroundObj(merchantLogo || nullImage)}
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
        <View className="specialOffer_toast">卡豆抵扣后最低到手价</View>
        <View className="specialOffer_date_price">
          <View className="font20">{"¥"}</View>
          {computedBeanPrice(buyPrice, payBeanCommission)}
          <View className="specialOffer_date_rel specialOffer_date_relMargin">
            ¥ {couponPrice}
          </View>
        </View>

        {shareCommission !== 0 && (
          <View className="specialOffer_bean_border">
            <View
              className="specialOffer_bean_box"
              style={{ border: "1px solid #ef476f" }}
            >
              赚¥
              {computedPrice(buyPrice - merchantPrice, shareCommission)}
            </View>
          </View>
        )}
      </View>
      <ButtonView>
        <View className="specialOffer_bottom_btn">
          {shareCommission > 0 ? "分享赚" : "抢购"}
        </View>
      </ButtonView>
    </View>
  );
};
