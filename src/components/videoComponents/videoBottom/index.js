import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
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
import { fetchMomentRelate } from "@/server/index";
import { fetchPromotionStatus } from "@/server/user";
import Router from "@/common/router";
import { mapGo, computedBeanPrice } from "@/common/utils";
import TemplateCard from "./components/shopcard";
import { city } from "@/common/city";
import "./index.scss";
const cityObj = {};
city.forEach((item) => {
  const { items = [] } = item;
  items.forEach((val) => {
    const { cityCode, name } = val;
    cityObj[cityCode] = name;
  });
});
export default (props) => {
  const { server = {}, children, index, userInfo, current } = props;
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const [flag, setFlag] = useState({
    flagType: false,
    boolean: false,
  });
  const [couponInfo, setCouponInfo] = useState({});
  const [showFlag, setShowFlag] = useState(false);
  const [momentStatus, setMomentStatus] = useState("0");
  useEffect(() => {
    getPromotion(server);
    getPromotionStatus(server);
    let time = setTimeout(() => {
      computedFont();
      clearTimeout(time);
    }, 1);
  }, []);
  useEffect(() => {
    const { promotionFlag } = server;
    setShowFlag(false);
    if (promotionFlag === "1" && current === index) {
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
    addressContentObject = {},
    ownerName,
    momentId,
    ownerImg,
    momentType,
    cityCode,
    relateType,
    relateId,
    jumpUrl,
    relateName,
    promotionFlag,
    ugcAddressObject = {},
    guideMomentFlag,
    ownerId,
  } = server;
  const { address, lat, lnt } = addressContentObject;

  const getPromotion = (item) => {
    const { promotionFlag, ownerId, momentId, momentType } = item;
    if (promotionFlag === "1") {
      fetchMomentRelate(
        {
          ownerId,
          momentId,
          momentType,
        },
        (res) => {
          const { momentRelateInfo = {} } = res;
          setCouponInfo(momentRelateInfo);
        }
      );
    }
  };
  const getPromotionStatus = (server) => {
    const { promotionFlag, ownerId, momentType } = server;
    if (promotionFlag === "0" && momentType !== "ugc") {
      fetchPromotionStatus({ ownerId }).then((val) => {
        const { merchantPromotionStatus } = val;
        setMomentStatus(merchantPromotionStatus);
      });
    }
  };
  const templateCommerce = (val, callback) => {
    const {
      activityType = "specialGoods",
      paymentModeObject = {},
      activityGoodsId,
      goodsImg,
      goodsName,
      realPrice,
      commission,
      oriPrice,
    } = val;
    const { type = "defaultMode", bean = "", cash = "" } = paymentModeObject;

    if (type === "defaultMode" || activityType === "specialGoods") {
      return (
        <View className="test_debug">
          <View className="templateStated_box" onClick={() => callback(val)}>
            <View
              className="templateStated_img coupon_shop_icon"
              style={backgroundObj(goodsImg)}
            ></View>
            <View className="templateStated_font">
              <View
                style={
                  shareCommission > 0 ? { maxWidth: Taro.pxTransform(336) } : {}
                }
                className="templateStated_title font_hide"
              >
                {goodsName}
              </View>
              <View className="templateStated_price font_hide">
                <Text className="font18">卡豆再省:</Text>
                <Text className="font20 bold templateStated_margin">¥</Text>
                <Text className="font28 bold templateStated_margin">
                  {computedBeanPrice(realPrice, 100 - payBeanCommission)}
                </Text>
                {shareCommission > 0 && commission && (
                  <Text className="font22 templateStated_margin">
                    /赚¥
                    {computedPrice(commission, shareCommission)}
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
    } else {
      if (activityType === "commerceGoods") {
        if (!bean) {
          return (
            <View className="test_debug">
              <View
                className="templateStated_box"
                onClick={() => callback(val)}
              >
                <View
                  className="templateStated_img coupon_shop_icon"
                  style={backgroundObj(goodsImg)}
                ></View>
                <View className="templateStated_font">
                  <View
                    style={
                      shareCommission > 0 && commission
                        ? { maxWidth: Taro.pxTransform(336) }
                        : {}
                    }
                    className="templateStated_title font_hide"
                  >
                    {goodsName}
                  </View>
                  <View className="templateStated_price font_hide">
                    <Text className="font18">卡豆再省:</Text>
                    <Text className="font20 bold templateStated_margin">¥</Text>
                    <Text className="font28 bold templateStated_margin">
                      {computedBeanPrice(realPrice, 100 - payBeanCommission)}
                      {shareCommission > 0 && commission && (
                        <Text className="font22 templateStated_margin">
                          /赚¥
                          {computedPrice(commission, shareCommission)}
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>
                <View
                  style={
                    shareCommission > 0 && commission
                      ? {}
                      : { width: Taro.pxTransform(112) }
                  }
                  className="templateStated_pay public_center"
                >
                  {shareCommission === 0 ? "抢购" : "分享赚"}
                </View>
              </View>
            </View>
          );
        } else {
          return (
            <View className="test_debug">
              <View
                className="templateStated_box"
                onClick={() => callback(val)}
              >
                <View
                  className="templateStated_img coupon_shop_icon"
                  style={backgroundObj(goodsImg)}
                ></View>
                <View className="templateStated_font">
                  <View
                    style={
                      shareCommission > 0
                        ? { maxWidth: Taro.pxTransform(336) }
                        : {}
                    }
                    className="templateStated_title font_hide"
                  >
                    {goodsName}
                  </View>
                  <View className="templateStated_price font_hide">
                    <Text className="font18">卡豆价:</Text>
                    <Text className="font20 bold templateStated_margin">¥</Text>
                    <Text className="font28 bold templateStated_margin">
                      {cash}+{bean}卡豆
                      {shareCommission > 0 && commission && (
                        <Text className="font22 templateStated_margin">
                          /赚¥
                          {computedPrice(commission, shareCommission)}
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>
                <View
                  style={
                    shareCommission > 0 && commission
                      ? {}
                      : { width: Taro.pxTransform(112) }
                  }
                  className="templateStated_pay public_center"
                >
                  {shareCommission === 0 ? "抢购" : "分享赚"}
                </View>
              </View>
            </View>
          );
        }
      }
    }
  };
  const templateStated = (val = {}, callback) => {
    const { activityGoodsList = [], ownerCouponList = [] } = val;
    if (activityGoodsList.length > 0) {
      return activityGoodsList.map((item, index) => {
        if (index === 0) {
          return templateCommerce(item, callback);
        }
        return null;
      });
    } else {
      return ownerCouponList.map((item, index) => {
        const {
          couponName,
          reduceObject: { couponPrice },
          commission,
          buyPrice,
        } = item;
        if (index === 0) {
          return (
            <View className="test_debug">
              <View
                className="templateStated_box"
                onClick={() => callback(item)}
              >
                <View
                  className="templateStated_img coupon_shop_icon"
                  style={backgroundObj(ownerImg)}
                ></View>
                <View className="templateStated_font">
                  <View
                    style={
                      shareCommission > 0
                        ? { maxWidth: Taro.pxTransform(336) }
                        : {}
                    }
                    className="templateStated_title font_hide"
                  >
                    {couponName}
                  </View>
                  <View className="templateStated_price font_hide">
                    <Text className="font18">卡豆再省:</Text>
                    <Text className="font20 bold templateStated_margin">¥</Text>
                    <Text className="font28 bold templateStated_margin">
                      {computedBeanPrice(buyPrice, 100 - payBeanCommission)}
                    </Text>
                    {shareCommission > 0 && (
                      <Text className="font22 templateStated_margin">
                        /赚¥
                        {computedPrice(commission, shareCommission)}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={
                    shareCommission === 0
                      ? {}
                      : { width: Taro.pxTransform(112) }
                  }
                  className="templateStated_pay public_center"
                >
                  {shareCommission === 0 ? "抢购" : "分享赚"}
                </View>
              </View>
            </View>
          );
        } else return null;
      });
    }
  };
  const routerInfo = () => {
    console.log(relateType);
    if (relateType === "user") {
      Router({
        routerName: "download",
      });
    } else if (relateType === "group") {
      Router({
        routerName: "groupDetails",
        args: {
          merchantGroupId: relateId,
        },
      });
    } else if (relateType === "merchant") {
      Router({
        routerName: "merchantDetails",
        args: {
          merchantId: relateId,
        },
      });
    } else {
      return;
    }
  };
  //路径跳转
  const computedFont = () => {
    getDom(`.video_bottom_decBox${index}`, (res) => {
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
  //计算描述高度
  const updateDec = () => {
    setFlag({
      ...flag,
      boolean: !boolean,
    });
  };
  //修改可看文字高度计算状态
  const {
    activityGoodsList = [],
    ownerCouponList = [],
    freeOwnerCouponList = [],
  } = couponInfo;
  //视频携带商品信息
  const linkTo = (val) => {
    if (val.couponName) {
      const { ownerIdString, ownerCouponIdString } = val;
      Router({
        routerName: "payCouponDetails",
        args: {
          merchantId: ownerIdString,
          ownerId: ownerIdString,
          ownerCouponId: ownerCouponIdString,
        },
      });
    } else {
      const { ownerIdString, activityGoodsId } = val;
      Router({
        routerName: "favourableDetails",
        args: {
          specialActivityId: activityGoodsId,
          merchantId: ownerIdString,
          momentId: momentId,
        },
      });
    }
  };
  //视频携带商品跳转详情页
  const FilterGoods = () => {
    if (!showFlag) {
      return (
        <React.Fragment>
          {(activityGoodsList.length > 0 || ownerCouponList.length > 0) &&
            templateStated(couponInfo, linkTo)}
          <View className="video_username font_hide">
            <View className="font_hide">
              @
              {momentType === "merchant" ||
              momentType === "ugc" ||
              momentType === "platform"
                ? relateName
                : ownerName}
            </View>
          </View>
          {/* 发布视频用户来源 */}
          {flagType && boolean ? (
            <ScrollView
              scrollY
              className={classNames(
                `video_bottom_decBox`,
                `video_bottom_decBox${index}
            video_bottom_auto`
              )}
            >
              {message}
            </ScrollView>
          ) : (
            <View
              onClick={() => {
                updateDec();
              }}
              className={classNames(
                `video_bottom_decBox`,
                `video_bottom_decBox${index}`,
                flagType && !boolean && "font_noHide"
              )}
            >
              {message}
              {momentType === "platform" && (
                <View className="video_momentType public_center">广告</View>
              )}
            </View>
          )}
          <View className="video_desc_coll public_auto">
            {relateType === "user" || relateType === "brand" ? null : (
              <View
                className="color6 home_desc_city"
                onClick={() =>
                  mapGo({
                    lat: lat,
                    lnt: lnt,
                    address: address,
                    merchantName: ownerName,
                  })
                }
              >
                <View className="video_city_icon"></View>
                <ScrollView scrollX className="video_desc_text font_hide">
                  {cityObj[cityCode] || "全国"}·{categoryName}
                  {GetDistance(getLat(), getLnt(), lat, lnt)
                    ? `｜${GetDistance(getLat(), getLnt(), lat, lnt)}｜`
                    : ""}
                  {address}
                </ScrollView>
              </View>
            )}
          </View>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <TemplateCard
            shareCommission={shareCommission}
            payBeanCommission={payBeanCommission}
            val={couponInfo}
            callback={linkTo}
            ownerImg={ownerImg}
            onClose={() => setShowFlag(false)}
          ></TemplateCard>
          <View className="video_desc_coll public_auto">
            {relateType === "user" || relateType === "brand" ? null : (
              <View
                className="color6 home_desc_city"
                onClick={() =>
                  mapGo({
                    lat: lat,
                    lnt: lnt,
                    address: address,
                    merchantName: ownerName,
                  })
                }
              >
                <View className="video_city_icon"></View>
                <ScrollView scrollX className="video_desc_text font_hide">
                  {cityObj[cityCode] || "全国"}·{categoryName}
                  {GetDistance(getLat(), getLnt(), lat, lnt)
                    ? `｜${GetDistance(getLat(), getLnt(), lat, lnt)}｜`
                    : ""}
                  {address}
                </ScrollView>
              </View>
            )}
          </View>
        </React.Fragment>
      );
    }
  };
  return (
    <View className="video_bottom_box">
      {children ? children : null}
      {momentType === "ugc" && ugcAddressObject.ugcCityCode && (
        <View className="video_shop_iconBox video_shop_icon2">
          <View className="video_shop_font2 font_hide">
            {cityObj[ugcAddressObject.ugcCityCode]} | {ugcAddressObject.address}
          </View>
        </View>
      )}
      {momentType !== "ugc" &&
        momentType !== "platform" &&
        guideMomentFlag !== "1" &&
        promotionFlag === "0" && (
          <View
            className="video_shop_iconBox video_shop_icon1"
            onClick={() => routerInfo()}
          >
            <View className="video_shop_font font_hide">
              {cityObj[cityCode]} | {ownerName}
            </View>
            {momentStatus === "1" && (
              <View className="video_shop_label">优惠特卖</View>
            )}
          </View>
        )}
      {/* 发布视频类型 */}
      {FilterGoods()}
      {jumpUrl.length > 0 && (
        <View
          onClick={() => {
            Router({
              routerName: "webView",
              args: {
                link: jumpUrl,
              },
            });
          }}
          className={classNames(
            "video_jumpUrl_link public_center",
            current === index && "video_jumpUrl_transtation"
          )}
        >
          查看详情 {">"}
        </View>
      )}
    </View>
  );
};
