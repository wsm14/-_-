import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { fetchUserAcquiredPlatformGift } from "@/server/index";
import Drawer from "@/components/Drawer";
import GlobalDrawer from "@/components/GlobalDrawer";
import {
  loginStatus,
  computedTime,
  fetchStorage,
  fakeStorage,
} from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
let timeOutInfo = null;
export default ({ auth, stopVideo, initVideo }) => {
  let env = process.env.NODE_ENV === "development" ? "dev" : "product";
  const [visible, setVisible] = useState(false);
  const [visibleCoupon, setVisibleCoupon] = useState(false);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState({});
  const [count, setCount] = useState({
    time: 5,
    val: null,
    init: null,
  });
  useDidShow(() => {
    const { createTime } = loginStatus() || {};
    if (
      loginStatus() &&
      computedTime(createTime) < 3 &&
      !fetchStorage("newUser")
    ) {
      setTimeout(() => {
        getUserAcquiredPlatformGift();
      }, 2000);
    } else {
      setStatus("2");
    }
  });
  useEffect(() => {
    if (auth) {
      if (!loginStatus()) {
        setStatus(() => {
          stopVideo && stopVideo();
          setVisible(true);
          return "0";
        });
      }
    }
  }, [auth]);
  useEffect(() => {
    return () => {
      if (timeOutInfo) {
        clearInterval(timeOutInfo);
      }
    };
  }, []);
  const getUserAcquiredPlatformGift = () => {
    fetchUserAcquiredPlatformGift({
      giftType: "newUser",
    }).then((val) => {
      const { platformGiftPackInfo } = val;
      if (platformGiftPackInfo && !timeOutInfo) {
        setVisibleCoupon(() => {
          setStatus("1");
          setData(platformGiftPackInfo);
          stopVideo();
          let num = 0;
          timeOutInfo = setInterval(() => {
            num = num + 1;
            if (num === 5) {
              clearInterval(timeOutInfo);
              !fetchStorage("newUser") &&
                Router({
                  routerName: "webView",
                  args: {
                    link: `https://web-new.dakale.net/${env}/game/sign/index.html#/coupon`,
                  },
                });
              onCoupon();
            } else {
              setCount({
                time: 5 - num,
              });
            }
          }, 1000);
          return true;
        });
      } else {
        setStatus("2");
      }
    });
  };
  const templateCoupon = (item) => {
    const { platformCoupon = {} } = item;
    const { thresholdPrice, couponValue, useScenesType } = platformCoupon;
    const renter = {
      goodsBuy: "???????????????",
      scan: "???????????????",
      virtual: "???????????????",
      commerce: "?????????",
      community: "?????????",
    }[useScenesType];
    return (
      <View className="noviceCoupon_content_coupon">
        <View className="noviceCoupon_coupon_title1 font_hide">{renter}</View>
        <View className="noviceCoupon_coupon_title2">
          <View className="font30">??</View>
          <View className="font48">{couponValue}</View>
        </View>
        <View className="noviceCoupon_coupon_title3">
          ???{thresholdPrice}??????
        </View>
      </View>
    );
  };
  const template = () => {
    if (status === "0" && visible) {
      return (
        <Drawer show={visible} close={() => onClose()}>
          <View className="noviceGuide_box">
            <View className="noviceGuide_priceTitle">?????????????????????</View>
            <View className="noviceGuide_priceContent">
              <View className="noviceGuide_priceContent_line1">??</View>
              <View className="noviceGuide_priceContent_line2">18.00</View>
            </View>
            <View className="noviceGuide_newDesc">??????????????????</View>
            <View className="noviceGuide_desc">??????????????? ????????????</View>
            <View
              className="noviceGuide_btn public_center"
              onClick={() => {
                onClose(() =>
                  Router({
                    routerName: "authPrize",
                  })
                );
              }}
            >
              ????????????????????????
            </View>
          </View>
        </Drawer>
      );
    } else if (status === "1" && visibleCoupon) {
      const { giftValue, giftName, platformGiftPackRelateList = [] } = data;
      return (
        <Drawer
          show={visibleCoupon}
          close={() => {
            onCoupon();
            setStatus("2");
          }}
        >
          <View className="noviceCoupon_box">
            <View className="noviceCoupon_title1">
              <View className="font28 ">???????????????????????????</View>
              <View className="font40 bold price_margin8"> ??{giftValue}</View>
            </View>
            <View className="noviceCoupon_title2">{giftName}</View>

            <ScrollView scrollX className="noviceCoupon_content_scroll">
              <View className="noviceCoupon_content">
                {platformGiftPackRelateList.map((item) => {
                  return templateCoupon(item);
                })}
              </View>
            </ScrollView>

            <View className="noviceCoupon_bom">
              <View
                className="noviceCoupon_btn public_center"
                onClick={() =>
                  onCoupon(() => {
                    setCount(() => {
                      clearInterval(timeOutInfo);
                      setStatus("2");
                      Router({
                        routerName: "webView",
                        args: {
                          link: `https://web-new.dakale.net/${env}/game/sign/index.html#/coupon`,
                        },
                      });
                      return {
                        time: 5,
                        val: null,
                        init: {},
                      };
                    });
                  })
                }
              >
                ??????????????????({count.time}S){" "}
              </View>
            </View>
          </View>
        </Drawer>
      );
    } else if (status === "2") {
      return (
        <GlobalDrawer
          pageName="pickup"
          stopVideo={stopVideo}
          initVideo={initVideo}
        ></GlobalDrawer>
      );
    } else return null;
  };
  const onClose = (fn) => {
    setVisible(false);
    fn && fn();
  };
  const onCoupon = (fn) => {
    setVisibleCoupon(false);
    fakeStorage("newUser", true);
    fn && fn();
  };
  /* ??????????????????  */
  return template();
};
