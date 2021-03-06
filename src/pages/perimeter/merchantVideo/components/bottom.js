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
} from "@/utils/utils";
import Taro from "@tarojs/taro";
import { fetchMomentRelate } from "@/server/index";
import Router from "@/utils/router";
import { mapGo, computedBeanPrice } from "@/utils/utils";
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
  } = server;
  const { address, lat, lnt } = addressContentObject;
  const getPromotion = (item) => {
    const { promotionFlag, ownerId, promotionNum, momentId, momentType } = item;
    if (promotionFlag === "1" && promotionNum > 0) {
      fetchMomentRelate(
        {
          ownerId,
          momentId,
          momentType,
        },
        (res) => {
          const { momentRelateInfo } = res;
          setCouponInfo(momentRelateInfo);
        }
      );
    }
  };
  const templateStated = (val, callback) => {
    const { activityGoodsList = [], ownerCouponList = [] } = val;
    if (activityGoodsList.length > 0) {
      return activityGoodsList.map((item, index) => {
        const {
          activityGoodsId,
          goodsImg,
          goodsName,
          realPrice,
          commission,
          oriPrice,
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
          );
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
                  <View className="templateStated_title font_hide">
                    {couponName}
                  </View>
                  <View className="templateStated_price font_hide">
                    <Text className="font18">????????????:</Text>
                    <Text className="font20 bold templateStated_margin">??</Text>
                    <Text className="font28 bold templateStated_margin">
                      {computedBeanPrice(buyPrice, 100 - payBeanCommission)}
                    </Text>
                  </View>
                </View>
                <View className="templateStated_pay public_center">??????</View>
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
    activityGoodsList = [],
    ownerCouponList = [],
    freeOwnerCouponList = [],
  } = couponInfo;
  const linkTo = (val) => {
    console.log(val);
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
  if (
    (activityGoodsList.length > 0 || ownerCouponList.length > 0) &&
    showFlag === true
  ) {
    return (
      <View className="test">
        <TemplateCard
          shareCommission={shareCommission}
          payBeanCommission={payBeanCommission}
          val={couponInfo}
          callback={linkTo}
          ownerImg={ownerImg}
          onClose={() => setShowFlag(false)}
        ></TemplateCard>
        <View className="home_bottom">
          <View className="home_desc_coll public_auto">
            {relateType === "user" || relateType === "brand" ? (
              <View></View>
            ) : (
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
                <View className="home_city_icon"></View>
                <ScrollView scrollX className="home_desc_text font_hide">
                  {cityCode === "3301"
                    ? "??????"
                    : cityCode === "4331"
                    ? "??????"
                    : "??????"}
                  ??{categoryName}
                  {GetDistance(getLat(), getLnt(), lat, lnt)
                    ? `???${GetDistance(getLat(), getLnt(), lat, lnt)}???`
                    : ""}
                  {address}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  } else if (
    (activityGoodsList.length > 0 || ownerCouponList.length > 0) &&
    !showFlag
  ) {
    return (
      <View className="home_bottom">
        {templateStated(couponInfo, linkTo)}
        <View onClick={() => routerInfo()} className="home_username font_hide">
          <View className="font_hide"> @{ownerName} </View>
          {momentType === "platform" && (
            <View className="home_momentType public_center">??????</View>
          )}
        </View>
        {descView()}
        <View className="home_desc_coll public_auto">
          {relateType === "user" || relateType === "brand" ? (
            <View></View>
          ) : (
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
              <View className="home_city_icon"></View>
              <ScrollView scrollX className="home_desc_text font_hide">
                {cityCode === "3301"
                  ? "??????"
                  : cityCode === "4331"
                  ? "??????"
                  : "??????"}
                ??{categoryName}
                {GetDistance(getLat(), getLnt(), lat, lnt)
                  ? `???${GetDistance(getLat(), getLnt(), lat, lnt)}???`
                  : ""}
                {address}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <View className="home_bottom">
          {children}
          <View
            className="home_username font_hide"
            onClick={() => routerInfo()}
          >
            <View className="font_hide"> @{ownerName} </View>
            {momentType === "platform" && (
              <View className="home_momentType public_center">??????</View>
            )}
          </View>
          {descView()}
          <View className="home_desc_coll public_auto">
            {relateType === "user" || relateType === "brand" ? (
              <View></View>
            ) : (
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
                <View className="home_city_icon"></View>
                <ScrollView scrollX className="home_desc_text font_hide">
                  {cityCode === "3301"
                    ? "??????"
                    : cityCode === "4331"
                    ? "??????"
                    : "??????"}
                  ??{categoryName}
                  {GetDistance(getLat(), getLnt(), lat, lnt)
                    ? `???${GetDistance(getLat(), getLnt(), lat, lnt)}???`
                    : ""}
                  {address}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
};
