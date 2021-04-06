import React, { useEffect, useState } from "react";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { useReady } from "@tarojs/taro";
import classNames from "classnames";
import {
  getDom,
  GetDistance,
  getLat,
  getLnt,
  backgroundObj,
} from "@/common/utils";
import Taro from "@tarojs/taro";
import { getPromotionInfo } from "@/server/index";
import Router from "@/common/router";
import "./../index.scss";
export default (props) => {
  const { server = {}, list = [], children, index } = props;
  const [flag, setFlag] = useState({
    flagType: false,
    boolean: false,
  });
  const [couponInfo, setCouponInfo] = useState({});

  useEffect(() => {
    getPromotion(server);
    setTimeout(() => computedFont(), 1);
  }, []);

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
  // console.log(data);
  const activeView = () => {
    const {
      promotionType,
      promotionImg = "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/coupon_sm.png",
      promotionName,
      promotionBuyPrice,
      promotionIdString,
    } = couponInfo;
    const linkTo = () => {
      if (promotionType === "special") {
        Router({
          routerName: "favourableDetails",
          args: {
            specialActivityId: promotionIdString,
            merchantId: userIdString,
          },
        });
      } else {
        Router({ routerName: "download" });
      }
    };
    if (Object.keys(couponInfo).length > 0) {
      return (
        <View
          onClick={() => linkTo()}
          className={classNames("home_active_box", `home_active_box${index}`)}
        >
          <View className="home_active_image">
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: Taro.pxTransform(4),
                ...backgroundObj(promotionImg),
              }}
            />
          </View>
          <View className="home_active_details">
            <View className="home_active_font1  font_hide">
              {promotionName}
            </View>
            <View className="home_active_font2 font_hide">
              专享特价 <Text className={"font20 color3"}>¥ </Text>{" "}
              <Text className={"font28 color3 bold"}>{promotionBuyPrice} </Text>
            </View>
          </View>
          <View className={classNames("home_active_btn")}>立即抢购</View>
        </View>
      );
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

  return (
    <View className="home_bottom">
      {children}
      {activeView()}
      {descView()}
      <View className="home_desc_coll public_auto">
        <View className="color6 home_desc_city">
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
        {flagType && (
          <View className="bold" onClick={() => updateDec()}>
            {!boolean ? "展开" : "收起"}
          </View>
        )}
      </View>
    </View>
  );
};
