import React, { useEffect, useMemo, useState } from "react";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { useReady } from "@tarojs/taro";
import classNames from "classnames";
import {
  getDom,
  GetDistance,
  getLat,
  getLnt,
  backgroundObj,
  computedPrice,
} from "@/common/utils";
import Taro from "@tarojs/taro";
import { getPromotionInfo } from "@/server/index";
import Router from "@/common/router";
import { mapGo } from "@/common/utils";
import TemplateCard from "./shopcard";
import "./../index.scss";
export default (props) => {
  const { server = {}, children, index, userInfo, current } = props;
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const [flag, setFlag] = useState({
    flagType: false,
    boolean: false,
  });
  const [couponInfo, setCouponInfo] = useState({});
  const [showFlag, setShowFlag] = useState(false);

  useEffect(() => {
    getPromotion(server);
    let time = setTimeout(() => {
      computedFont();
      clearTimeout(time);
    }, 1);
  }, []);

  useEffect(() => {
    const { promotionIdString } = server;
    setShowFlag(false);
    if (promotionIdString && current === index) {
      let time = setTimeout(() => {
        clearTimeout(time);
        setShowFlag(true);
      }, 3000);
    }
  }, [current]);
  const { flagType, boolean } = flag;
  const {
    message,
    cityName,
    categoryName,
    lat,
    lnt,
    merchantAddress,
    userIdString,
    merchantLnt,
    merchantLat,
    username,
    promotionPrice,
    userMomentIdString,
  } = server;
  const getPromotion = (item) => {
    const { promotionType, promotionIdString, userIdString } = item;
    if (promotionIdString) {
      getPromotionInfo(
        {
          promotionId: promotionIdString,
          promotionType,
          merchantId: userIdString,
        },
        (res) => {
          const { promotionInfo } = res;
          setCouponInfo(promotionInfo);
        }
      );
    }
  };
  const templateStated = (val, callback) => {
    const {
      promotionName,
      promotionBuyPrice,
      promotionMerchantPrice,
      promotionImg,
    } = val;
    return (
      <View className="test_debug">
        <View className="templateStated_box" onClick={() => callback()}>
          <View
            className="templateStated_img"
            style={backgroundObj(
              promotionImg ||
                "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/coupon_sm.png"
            )}
          ></View>
          <View className="templateStated_font">
            <View
              style={
                shareCommission > 0 ? { maxWidth: Taro.pxTransform(336) } : {}
              }
              className="templateStated_title font_hide"
            >
              {promotionName}
            </View>
            <View className="templateStated_price font_hide">
              <Text className="font20">卡豆抵扣到手价</Text>
              <Text className="font20 bold templateStated_margin">¥</Text>
              <Text className="font28 bold templateStated_margin">
                {(promotionBuyPrice * (payBeanCommission / 100)).toFixed(2)}
              </Text>
              {shareCommission > 0 && (
                <Text className="font22 templateStated_margin">
                  /赚
                  {computedPrice(
                    promotionBuyPrice - promotionMerchantPrice,
                    shareCommission
                  )}
                </Text>
              )}
            </View>
          </View>
          <View
            style={
              shareCommission === 0 ? {} : { width: Taro.pxTransform(112) }
            }
            className="templateStated_pay public_center"
          >
            {shareCommission === 0 ? "抢购" : "分享赚"}
          </View>
        </View>
      </View>
    );
  };

  const descView = () => {
    if (flagType && boolean) {
      return (
        <ScrollView
          scrollY
          className={classNames(
            `home_bottom_decBox`,
            `home_bottom_decBox${index}
            home_bottom_auto`
          )}
        >
          {message}
        </ScrollView>
      );
    } else {
      return (
        <View
          onClick={() => {
            updateDec();
          }}
          className={classNames(
            `home_bottom_decBox`,
            `home_bottom_decBox${index}`,
            flagType && !boolean && "font_noHide"
          )}
        >
          {message}
        </View>
      );
    }
  };
  const computedFont = () => {
    getDom(`.home_bottom_decBox${index}`, (res) => {
      if (res[0]) {
        const { height } = res[0];
        if (height > 46) {
          setFlag({
            flagType: true,
            boolean: false,
          });
        } else {
          setFlag({
            flagType: false,
            boolean: false,
          });
        }
      }
    });
  };
  const updateDec = () => {
    setFlag({
      ...flag,
      boolean: !boolean,
    });
  };
  const {
    promotionType,
    promotionImg = "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/coupon_sm.png",
    promotionName,
    promotionBuyPrice,
    promotionIdString,
    promotionOriPrice,
    promotionMerchantPrice,
  } = couponInfo;
  const linkTo = () => {
    if (promotionType === "special") {
      Router({
        routerName: "favourableDetails",
        args: {
          specialActivityId: promotionIdString,
          merchantId: userIdString,
          momentId: userMomentIdString,
        },
      });
    } else {
      const { ownerIdString, promotionIdString } = couponInfo;
      Router({
        routerName: "payCouponDetails",
        args: {
          merchantId: userIdString,
          ownerId: ownerIdString,
          ownerCouponId: promotionIdString,
        },
      });
    }
  };
  if (Object.keys(couponInfo).length > 0 && showFlag === true) {
    return (
      <TemplateCard
        shareCommission={shareCommission}
        val={couponInfo}
        callback={linkTo}
        payBeanCommission={payBeanCommission}
        onClose={() => setShowFlag(false)}
      ></TemplateCard>
    );
  } else if (Object.keys(couponInfo).length > 0 && !showFlag) {
    return (
      <View className="home_bottom">
        {templateStated(couponInfo, linkTo)}
        <View className="home_username font_hide">@{username}</View>
        {descView()}
        <View className="home_desc_coll public_auto">
          <View
            className="color6 home_desc_city"
            onClick={() =>
              mapGo({
                lat: lat,
                lnt: lnt,
                address: merchantAddress,
                merchantName: username,
              })
            }
          >
            <View className="home_city_icon"></View>
            <View className="home_desc_text font_hide">
              {cityName}·{categoryName}｜
              {GetDistance(
                getLat(),
                getLnt(),
                merchantLat || lat,
                merchantLnt || lnt
              )}
              ｜{merchantAddress}
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View className="home_bottom">
        {children}
        <View className="home_username font_hide">@{username}</View>
        {descView()}
        <View className="home_desc_coll public_auto">
          <View
            className="color6 home_desc_city"
            onClick={() =>
              mapGo({
                lat: lat,
                lnt: lnt,
                address: merchantAddress,
                merchantName: username,
              })
            }
          >
            <View className="home_city_icon"></View>
            <View className="home_desc_text font_hide">
              {cityName}·{categoryName}｜
              {GetDistance(
                getLat(),
                getLnt(),
                merchantLat || lat,
                merchantLnt || lnt
              )}
              ｜{merchantAddress}
            </View>
          </View>
        </View>
      </View>
    );
  }
};
