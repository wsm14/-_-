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
} from "@/utils/utils";
import { observer, MobXProviderContext } from "mobx-react";
import { fetchMomentRelate, fetchPromotionStatus } from "@/server/index";
import Router from "@/utils/router";
import { mapGo, computedBeanPrice } from "@/utils/utils";
import TemplateCard from "./components/shopcard";
import { city } from "@/common/city";
import Tarking from "@/components/tracking";
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
  const { server = {}, children, index, current } = props;
  const [flag, setFlag] = useState({
    flagType: false,
    boolean: false,
  });
  const [couponInfo, setCouponInfo] = useState({});
  const [showFlag, setShowFlag] = useState(false);
  const [momentStatus, setMomentStatus] = useState("0");
  const [userInfo, setUserInfo] = useState({});
  const { store } = React.useContext(MobXProviderContext);
  const { commonStore } = store;
  const { preferentialGlobalDefaultList } = commonStore;
  const { payBeanCommission = 50 } = userInfo;
  useEffect(() => {
    if (preferentialGlobalDefaultList.length > 0) {
      let data = preferentialGlobalDefaultList.find((item) => {
        const { identification } = item;
        return identification === "videoDefault";
      });
      setUserInfo({
        payBeanCommission:
          data.preferentialActivityRuleObject.payBeanCommission,
      });
    }
  }, [preferentialGlobalDefaultList]);
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
    jumpUrl = "",
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
    console.log(server);
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
        <Tarking args={val} name={"homeCardSm"}>
          <View className="test_debug">
            <View className="templateStated_box" onClick={() => callback(val)}>
              <View
                className="templateStated_img coupon_shop_icon"
                style={backgroundObj(goodsImg)}
              ></View>
              <View className="templateStated_font">
                <View className="templateStated_title font_hide">
                  {goodsName}
                </View>
                <View className="templateStated_price font_hide">
                  <Text className="font18">????????????:</Text>
                  <Text className="font20 bold templateStated_margin">??</Text>
                  <Text className="font28 bold templateStated_margin">
                    {computedBeanPrice(realPrice, 100 - payBeanCommission)}
                  </Text>
                </View>
              </View>
              <View className="templateStated_pay public_center">??????</View>
            </View>
          </View>
        </Tarking>
      );
    } else {
      if (activityType === "commerceGoods") {
        if (!bean) {
          return (
            <Tarking args={val} name={"homeCardSm"}>
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
                    <View className="templateStated_title font_hide">
                      {goodsName}
                    </View>
                    <View className="templateStated_price font_hide">
                      <Text className="font18">????????????:</Text>
                      <Text className="font20 bold templateStated_margin">
                        ??
                      </Text>
                      <Text className="font28 bold templateStated_margin">
                        {computedBeanPrice(realPrice, 100 - payBeanCommission)}
                      </Text>
                    </View>
                  </View>
                  <View className="templateStated_pay public_center">??????</View>
                </View>
              </View>
            </Tarking>
          );
        } else {
          return (
            <Tarking args={val} name={"homeCardSm"}>
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
                    <View className="templateStated_title font_hide">
                      {goodsName}
                    </View>
                    <View className="templateStated_price font_hide">
                      <Text className="font18">?????????:</Text>
                      <Text className="font20 bold templateStated_margin">
                        ??
                      </Text>
                      <Text className="font28 bold templateStated_margin">
                        {cash}+{bean}??????
                      </Text>
                    </View>
                  </View>
                  <View className="templateStated_pay public_center">??????</View>
                </View>
              </View>
            </Tarking>
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
            <Tarking args={val} name={"homeCardSm"}>
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
                    <View className="templateStated_title font_hide">
                      {couponName}
                    </View>
                    <View className="templateStated_price font_hide">
                      <Text className="font18">????????????:</Text>
                      <Text className="font20 bold templateStated_margin">
                        ??
                      </Text>
                      <Text className="font28 bold templateStated_margin">
                        {computedBeanPrice(buyPrice, 100 - payBeanCommission)}
                      </Text>
                    </View>
                  </View>
                  <View className="templateStated_pay public_center">??????</View>
                </View>
              </View>
            </Tarking>
          );
        } else return null;
      });
    }
  };
  const routerInfo = () => {
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
  //????????????
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
  //??????????????????
  const updateDec = () => {
    setFlag({
      ...flag,
      boolean: !boolean,
    });
  };
  //????????????????????????????????????
  const {
    activityGoodsList = [],
    ownerCouponList = [],
    freeOwnerCouponList = [],
  } = couponInfo;
  //????????????????????????
  const linkTo = (val) => {
    if (val.couponName) {
      const { ownerIdString, ownerCouponIdString } = val;
      Router({
        routerName: "payCouponDetails",
        args: {
          merchantId: ownerIdString,
          ownerId: ownerIdString,
          ownerCouponId: ownerCouponIdString,
          identification: "videoDefault",
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
          identification: "videoDefault",
        },
      });
    }
  };
  //?????????????????????????????????
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
          {/* ???????????????????????? */}
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
                <View className="video_momentType public_center">??????</View>
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
                  {cityObj[cityCode] || "??????"}??{categoryName}
                  {GetDistance(getLat(), getLnt(), lat, lnt)
                    ? `???${GetDistance(getLat(), getLnt(), lat, lnt)}???`
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
                  {cityObj[cityCode] || "??????"}??{categoryName}
                  {GetDistance(getLat(), getLnt(), lat, lnt)
                    ? `???${GetDistance(getLat(), getLnt(), lat, lnt)}???`
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
              <View className="video_shop_label">????????????</View>
            )}
          </View>
        )}
      {/* ?????????????????? */}
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
          ???????????? {">"}
        </View>
      )}
    </View>
  );
};
