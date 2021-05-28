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
  computedPrice,
} from "@/common/utils";
import Taro from "@tarojs/taro";
import { getPromotionInfo } from "@/server/index";
import Router from "@/common/router";
// import Barrage from "./barrage";
import { getMomentBarrage } from "@/server/common";
import { mapGo } from "@/common/utils";
import "./../index.scss";
export default (props) => {
  const { server = {}, children, index, userInfo } = props;
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const [flag, setFlag] = useState({
    flagType: false,
    boolean: false,
  });
  const [couponInfo, setCouponInfo] = useState({});
  const [list, setList] = useState([]);
  useEffect(() => {
    getPromotion(server);
    setTimeout(() => computedFont(), 1);
  }, []);
  // useEffect(() => {
  //   const { promotionId, couponTitlesJson = [] } = server;
  //   if (couponTitlesJson.length > 0 && promotionId) {
  //     getMomentBarrages({});
  //   } else if (promotionId) {
  //     getMomentBarrages({ freeCouponStatus: "1" });
  //   } else {
  //     setList([]);
  //   }
  // }, [server]);
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
  const activeView = () => {
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
    if (Object.keys(couponInfo).length > 0) {
      if (shareCommission === 0) {
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
                卡豆抵扣到手价
              </View>
              <View className="home_active_price">
                <View className="color12 font20">¥ </View>
                <View className="color12 font28">
                  {" " + promotionBuyPrice}
                </View>
                <View className="home_active_specal">
                  {"¥ " + promotionOriPrice}
                </View>
              </View>
            </View>
            <View className={classNames("home_active_btn")}>立即抢购</View>
          </View>
        );
      } else {
        return (
          <View
            onClick={() => linkTo()}
            className={"home_active_shareCommission"}
          >
            <View className="home_shareCommission_image">
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: Taro.pxTransform(4),
                  ...backgroundObj(promotionImg),
                }}
              />
            </View>
            <View className="home_shareCommission_details">
              <View className="home_shareCommission_font1  font_hide">
                {promotionName}
              </View>
              <View className="home_shareCommission_font2 font_hide">
                <View className="home_shareCommission_title font20">
                  卡豆抵扣到手价
                </View>
                <View className="color12  font24">¥ </View>
                <View className="color12  font28">{promotionBuyPrice}</View>
                <View className="home_shareCommission_specal">
                  {"¥" + promotionOriPrice}
                </View>
              </View>
              <View className="home_shareCommission_tag">
                <View className="home_shareCommission_tagBox home_shareCommission_tagColor1">
                  {"自购省¥" +
                    computedPrice(
                      promotionBuyPrice - promotionMerchantPrice,
                      shareCommission
                    )}
                </View>

                <View className="home_shareCommission_tagBox home_shareCommission_tagColor2">
                  {"分享赚¥" +
                    computedPrice(
                      promotionBuyPrice - promotionMerchantPrice,
                      shareCommission
                    )}
                </View>
              </View>
            </View>
          </View>
        );
      }
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
  const getMomentBarrages = (obj = {}) => {
    getMomentBarrage({ size: 25, ...obj }, (res) => {
      const { momentBarrageList = [] } = res;
      setList(momentBarrageList);
    });
  };
  return (
    <View className="home_bottom">
      {/* {list.length > 0 && <Barrage data={list}></Barrage>} */}
      {children}
      {activeView()}
      <View className='home_username font_hide'>@{username}</View>
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
        {flagType && (
          <View className="bold" onClick={() => updateDec()}>
            {!boolean ? "展开" : "收起"}
          </View>
        )}
      </View>
    </View>
  );
};
