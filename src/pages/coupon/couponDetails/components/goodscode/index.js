import React, { useState, useEffect } from "react";
import { Canvas, Swiper, SwiperItem, View, Button } from "@tarojs/components";
import classNames from "classnames";
import { backgroundObj, mapGo } from "@/utils/utils";
import Router from "@/utils/router";
import Taro from "@tarojs/taro";
import drawQrcode from "weapp-qrcode";
import "./index.scss";
export default (props) => {
  const { data, fn, style } = props;
  const [orderResult, setOrderResult] = useState({});
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState([]);
  const qrwh = (304 / 750) * Taro.getSystemInfoSync().windowWidth;
  const {
    ownerIdString,
    ownerCouponIdString,
    merchantCount,
    merchantIdString,
  } = orderResult;
  const goMerchant = (val) => {
    Router({
      routerName: "merchantDetails",
      args: {
        merchantId: merchantIdString,
      },
    });
  };

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
        ??????{orderResult.dayNum}?????????{" "}
      </View>
    ),
    2: <View className="color7 font24 couponDetails_goods_type"> ????????? </View>,
    1: <View className="color7 font24 couponDetails_goods_type"> ????????? </View>,
    3: (
      <View className="color7 font24 couponDetails_goods_type">
        ??????{orderResult.dayNum}?????????
      </View>
    ),
  }[orderResult.couponStatus];
  const goShopGoods = () => {
    const { merchantIdString, ownerCouponIdString, kolMomentsIdString } =
      orderResult;
    Router({
      routerName: "favourableDetails",
      args: {
        merchantId: merchantIdString,
        specialActivityId: ownerCouponIdString,
      },
    });
  };
  //????????????

  return (
    <View className="couponDetails_title" style={style ? style : {}}>
      <View className="couponDetails_box">
        {" "}
        {merchantCount > 1 ? (
          <>
            <View
              className="couponDetails_merchant"
              onClick={() => goMerchant(orderResult)}
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
            </View>
            <View
              className="groupGo"
              onClick={(e) => {
                e.stopPropagation();
                Router({
                  routerName: "groupList",
                  args: {
                    ownerServiceId: ownerCouponIdString,
                    ownerId: ownerIdString,
                  },
                });
              }}
            >
              <View className="groupGo_font">
                ??????{merchantCount}???????????????
              </View>
            </View>
          </>
        ) : (
          <>
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
            <View
              onClick={() => goMerchant(merchantIdString)}
              className="couponDetails_merchant"
            >
              <View
                className="couponDetails_profile dakale_nullImage"
                style={backgroundObj(orderResult.merchantLogo)}
              ></View>
              <View className="couponDetails_merchantTitle font_hide">
                {orderResult.merchantName}
              </View>
              <View className="couponDetails_goIcon"></View>
            </View>
          </>
        )}
        <View
          onClick={() => goShopGoods()}
          className="couponDetails_merchantShop"
        >
          <View
            className="couponDetails_merchantLogo dakale_nullImage"
            style={backgroundObj(orderResult.couponImg)}
          ></View>
          <View className="couponDetails_shop_details">
            <View className="font_hide font28 couponDetails_shop_name">
              {orderResult.couponName}
            </View>
            <View className="font24 color2  font_hide couponDetails_goods_num">
              {"????????????:" + orderResult.couponName}
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
              ??????: {list[current]["verificationCode"]}
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
            ???????????????????????????????????????
          </View>
          <View className="kolgoods_go public_auto font24 color1">
            <View className="kolgoods_go_right public_center">
              <Button
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "none",
                }}
                openType={"contact"}
              ></Button>
              <View className="kolgoods_go_rightBox public_center">
                <View className="kolgoods_goIcon_box cannet_icon"></View>
                ????????????
              </View>
            </View>
          </View>
        </>
      </View>
    </View>
  );
};
