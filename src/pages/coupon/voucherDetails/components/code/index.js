import React, { useState, useEffect } from "react";
import { Canvas, Swiper, SwiperItem, View } from "@tarojs/components";
import "./../../index.scss";
import classNames from "classnames";
import {
  backgroundObj,
  filterWeek,
  filterStrList,
  navigateTo,
  mapGo,
} from "@/common/utils";
import Router from "@/common/router";
import Taro from "@tarojs/taro";
import drawQrcode from "weapp-qrcode";
export default (props) => {
  const { data, fn, style } = props;
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
    }, 100);
  }, [list]);
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
            const { status } = item;
            const codeObj = {
              1: (
                <View
                  style={{ width: qrwh, height: qrwh }}
                  className="code_onloader code_status1 public_center"
                ></View>
              ),
              2: (
                <View
                  style={{ width: qrwh, height: qrwh }}
                  className="code_onloader code_status2  public_center"
                ></View>
              ),
              3: (
                <View
                  style={{ width: qrwh, height: qrwh }}
                  className="code_onloader code_status3  public_center"
                ></View>
              ),
              4: (
                <View
                  style={{ width: qrwh, height: qrwh }}
                  className="code_onloader code_status4  public_center"
                ></View>
              ),
            }[status];
            return (
              <SwiperItem>
                {codeObj ? (
                  codeObj
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
  const orderStatusObj = {
    0: (
      <View className="color3 font24 couponDetails_goods_type">
        {" "}
        还有{orderResult.dayNum}天过期{" "}
      </View>
    ),
    2: <View className="color7 font24 couponDetails_goods_type"> 已使用 </View>,
    1: <View className="color7 font24 couponDetails_goods_type"> 已过期 </View>,
    3: (
      <View className="color7 font24 couponDetails_goods_type">
        还有{orderResult.dayNum}天过期
      </View>
    ),
  }[orderResult.couponStatus];
  const {
    ownerType,
    thresholdPrice = "",
    merchantCount,
    ownerIdString,
    userCouponIdString,
    couponType,
    merchantIdString,
  } = orderResult;
  return (
    <View className="couponDetails_title" style={style ? style : {}}>
      <View className="couponDetails_box">
        {merchantCount !== 1 ? (
          <>
            <View className="couponDetails_merchant">
              <View
                onClick={() =>
                  navigateTo(
                    `/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`
                  )
                }
                className="couponDetails_profile coupon_shop_icon"
                style={
                  orderResult.merchantLogo
                    ? backgroundObj(orderResult.merchantLogo)
                    : {}
                }
              ></View>
              <View className="couponDetails_merchantTitle font_hide">
                {orderResult.merchantName}
              </View>
            </View>
            <View
              className="groupGo"
              onClick={() =>
                Router({
                  routerName: "groupList",
                  args: {
                    ownerServiceId: userCouponIdString,
                    ownerId: ownerIdString,
                  },
                })
              }
            >
              <View className="groupGo_font">
                更多{merchantCount}家门店可用
              </View>
            </View>
          </>
        ) : (
          <>
            <View
              onClick={() =>
                navigateTo(
                  `/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`
                )
              }
              className="couponDetails_merchant"
            >
              <View
                className="couponDetails_profile coupon_shop_icon"
                style={
                  orderResult.merchantLogo
                    ? backgroundObj(orderResult.merchantLogo)
                    : {}
                }
              ></View>
              <View className="couponDetails_merchantTitle font_hide">
                {orderResult.merchantName}
              </View>
              <View className="couponDetails_goIcon"></View>
            </View>
            <View
              className="goMap"
              onClick={() =>
                mapGo({
                  lat: orderResult.lat,
                  lnt: orderResult.lnt,
                  address: orderResult.merchantAddress,
                  merchantName: orderResult.merchantName,
                })
              }
            ></View>
          </>
        )}
        <View className="couponDetails_merchantShop">
          <View
            className="couponDetails_merchantLogo coupon_big_icon"
            style={
              orderResult.couponImg ? backgroundObj(orderResult.couponImg) : {}
            }
          ></View>
          <View className="couponDetails_shop_details">
            <View className="font_hide font28 couponDetails_shop_name">
              {orderResult.couponName}
            </View>
            <View className="couponDetails_shop_content font24 color2">
              {thresholdPrice.length > 0 ? `满${thresholdPrice}可用` : "无门槛"}
            </View>
            {orderStatusObj}
          </View>
        </View>
        <View className="couponDetails_goods_liner"></View>
        <>
          {setCode()}
          {list.length > 0 && (
            <View
              style={
                list[current]["status"] !== "0"
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
        </>
      </View>
    </View>
  );
};
