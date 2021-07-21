import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Canvas,
  CoverImage,
  CoverView,
  Swiper,
  SwiperItem,
  Text,
  View,
} from "@tarojs/components";
import drawQrcode from "weapp-qrcode";
import "./../index.scss";
import classNames from "classnames";
import Router from "@/common/router";
import {
  backgroundObj,
  filterWeek,
  filterStrList,
  navigateTo,
  mapGo,
} from "@/common/utils";
import Taro from "@tarojs/taro";

export default (props) => {
  const { data, fn, telephone, style } = props;
  const [orderResult, setOrderResult] = useState({});
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState([]);
  const qrwh = (304 / 750) * Taro.getSystemInfoSync().windowWidth;
  useEffect(() => {
    const { orderGoodsVerifications } = data;
    setOrderResult(data);
    if (orderGoodsVerifications && Array.isArray(orderGoodsVerifications)) {
      setList(orderGoodsVerifications);
    }
  }, [data]);
  useEffect(() => {
    setTimeout(() => {
      list.forEach((item, index) => {
        const { verificationUrl } = item;
        if (item.status === "0") {
          drawQrcode({
            width: qrwh,
            height: qrwh,
            background: "#FFFFFF",
            canvasId: `canvas${index}`,
            text: verificationUrl,
          });
        }
      });
    }, 500);
  }, [list]);
  const {
    merchantIdString,
    merchantImg,
    merchantName,
    goodsImg,
    goodsName,
    goodsCount,
    totalFee,
    status,
    needOrder,
    allowRefund,
    allowExpireRefund,
    merchantLat,
    merchantLnt,
    merchantAddress,
    orderType,
    thresholdPrice,
    couponPrice,
    useEndTime,
    merchantCount,
    ownerIdString,
    activityIdString,
  } = orderResult;
  console.log(orderResult);
  const goSpeGoods = () => {
    const {
      ownerIdString,
      ownerCouponIdString,
      merchantIdString,
      activityIdString,
      orderType,
    } = orderResult;
    if (orderType === "specialGoods") {
      Router({
        routerName: "favourableDetails",
        args: {
          merchantId: merchantIdString,
          specialActivityId: activityIdString,
        },
      });
    } else {
      Router({
        routerName: "payCouponDetails",
        args: {
          merchantId: merchantIdString,
          ownerId: ownerIdString,
          ownerCouponId: ownerCouponIdString,
        },
      });
    }
  };
  const setCode = () => {
    return (
      <View className="codeBox public_center">
        <Swiper
          current={current}
          onChange={(e) => {
            const {
              detail: { current },
            } = e;
            setCurrent(current);
          }}
          style={{ width: qrwh, height: qrwh }}
        >
          {list.map((item, index) => {
            return (
              <SwiperItem>
                {item.status === "1" ? (
                  <View
                    style={{ width: qrwh, height: qrwh }}
                    className="code_onloader bgCode public_center"
                  ></View>
                ) : (
                  <Canvas
                    id={"canvas" + index}
                    style={{ width: qrwh, height: qrwh }}
                    canvasId={"canvas" + index}
                  ></Canvas>
                )}
              </SwiperItem>
            );
          })}
        </Swiper>
        <View
          onClick={() => onChangeLeft()}
          className="code_left codeLeft_icon codePosition"
        ></View>
        <View
          onClick={() => onChangeRight()}
          className="code_right codeLeft_right codePosition"
        ></View>
      </View>
    );
  };
  const onChangeLeft = () => {
    if (current === 0) {
      return setCurrent(list.length - 1);
    }
    return setCurrent(current - 1);
  };
  const onChangeRight = () => {
    if (current === list.length - 1) {
      return setCurrent(0);
    }
    return setCurrent(current + 1);
  };
  const filterPrice = (pay) => {
    if (pay) {
      let str = pay.split(".");
      if (str.length == 2) {
        return (
          <View className="descriptionCard_shop_price color1 bold">
            <Text className="font20">¥ </Text>
            <Text className="font32">{" " + str[0]}</Text>
            <Text className="font24">{`.${str[1]}`}</Text>
          </View>
        );
      } else {
        return (
          <View className="descriptionCard_shop_price color1 bold">
            <Text className="font20">¥ </Text>
            <Text className="font32">{pay}</Text>
          </View>
        );
      }
    } else return null;
  };
  const filterCode = () => {
    if (status === "3" || status === "1") {
      return true;
    }
    return false;
  };
  const filterTopMerchant = (count = 1) => {
    if (count === 1) {
      return (
        <View
          onClick={() =>
            navigateTo(
              `/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`
            )
          }
          className="descriptionCard_merchant"
        >
          <View
            className="descriptionCard_profile dakale_nullImage"
            style={backgroundObj(merchantImg)}
          ></View>
          <View className="descriptionCard_merchantTitle font_hide">
            {merchantName}
          </View>
          <View className="descriptionCard_goIcon"></View>
        </View>
      );
    } else
      return (
        <View
          onClick={() =>
            Router({
              routerName: "groupList",
              args: {
                ownerServiceId: activityIdString,
                ownerId: ownerIdString,
              },
            })
          }
          className="descriptionCard_merchant"
        >
          <View
            className="descriptionCard_profile dakale_nullImage"
            style={backgroundObj(merchantImg)}
          ></View>
          <View className="descriptionCard_merchantTitle font_hide">
            {merchantName}
          </View>
          <View className="descriptionCard_group_liner">
            更多{count}家门店可用
          </View>
        </View>
      );
  };
  return (
    <View className="descriptionCard_title" style={style ? style : {}}>
      <View className="descriptionCard_box">
        {filterTopMerchant(merchantCount)}
        <View className="descriptionCard_merchantShop">
          <View
            className={classNames(
              "descriptionCard_merchantLogo",
              orderType === "reduceCoupon"
                ? "coupon_big_icon"
                : "dakale_nullImage"
            )}
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="descriptionCard_shop_details">
            <View className="descriptionCard_goods_name color1 font28 font_hide">
              {goodsName}
            </View>

            {orderType === "reduceCoupon" ? (
              <View className="font24 color2 descriptionCard_goods_num font_hide">
                面值{couponPrice} |{" "}
                {!thresholdPrice ? "无门槛" : `满${thresholdPrice}元可用`} |
                数量:
                {goodsCount}
              </View>
            ) : (
              <View className="font24 color2 descriptionCard_goods_num">
                数量:
                {goodsCount}
              </View>
            )}
            <View className="font24 color3 descriptionCard_goods_time">
              有效期至：{useEndTime}
            </View>
          </View>
          {filterPrice(totalFee)}
        </View>
        <View className="descriptionCard_goods_liner"></View>
        <View className="descriptionCard_goods_tags public_center">
          <View className="kolTagBox public_center">
            {needOrder === "0" && (
              <View className="public_center">
                <View className="kolTag kolTagIcons"></View>
                <View className="font24 color2 kolTag_font">免预约</View>
              </View>
            )}
            {allowRefund === "1" && (
              <View className="public_center">
                <View className="kolTag kolTagIcons"></View>
                <View className="font24 color2 kolTag_font">随时退</View>
              </View>
            )}
            {allowExpireRefund === "1" && (
              <View className="public_center">
                <View className="kolTag kolTagIcons"></View>
                <View className="font24 color2 kolTag_font">过期退</View>
              </View>
            )}
          </View>
        </View>
        {filterCode() && (
          <>
            {setCode()}
            {list.length > 0 && (
              <View
                style={
                  list[current]["status"] === "1"
                    ? { color: "#CCCCCC", textDecoration: "line-through" }
                    : {}
                }
                className={classNames("color1 font24 code_num")}
              >
                券码: {list[current]["verificationCode"]}
              </View>
            )}
            <View className="public_center color1 font24 code_count">
              {current + 1 + "/" + list.length}{" "}
            </View>
            <View
              onClick={() => fn && fn()}
              className="public_center font24 color2 code_onRead"
            >
              <View className="onReadly_icon onReadly_iconBox"></View>
              如果券码不显示，点这里刷新
            </View>
            <View className="kolgoods_go public_auto font24 color1">
              <View
                className="kolgoods_go_left public_center"
                onClick={() =>
                  mapGo({
                    lat: merchantLat,
                    lnt: merchantLnt,
                    address: merchantAddress,
                    merchantName: merchantName,
                  })
                }
              >
                <View className="kolgoods_go_leftBox public_center">
                  <View className="kolgoods_goIcon_box kol_radius"></View>
                  到这里去
                </View>
              </View>
              <View
                className="kolgoods_go_center public_center"
                onClick={() => goSpeGoods()}
              >
                <View className="kolgoods_go_leftBox public_center">
                  <View className="kolgoods_goIcon_box kol_shop_icon"></View>
                  商品详情
                </View>
              </View>
              <View
                onClick={() => telephone()}
                className="kolgoods_go_right public_center"
              >
                <View className="kolgoods_go_rightBox public_center">
                  <View className="kolgoods_goIcon_box kol_telephone"></View>
                  联系商家
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};
