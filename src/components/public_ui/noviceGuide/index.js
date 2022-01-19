import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { fetchUserAcquiredPlatformGift } from "@/server/index";
import Drawer from "@/components/Drawer";
import {
  loginStatus,
  computedTime,
  fetchStorage,
  fakeStorage,
} from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default ({ auth, stopVideo, initVideo }) => {
  let env = process.env.NODE_ENV === "development" ? "dev" : "dev";
  const [visible, setVisible] = useState(false);
  const [visibleCoupon, setVisibleCoupon] = useState(false);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState({});
  const [count, setCount] = useState({
    time: 5,
    val: null,
  });
  useDidShow(() => {
    const { createTime } = loginStatus() || {};
    if (
      loginStatus() &&
      computedTime(createTime) < 3 &&
      !fetchStorage("newUser")
    ) {
      let time = setTimeout(() => {
        clearTimeout(time);
        getUserAcquiredPlatformGift();
      }, 3000);
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
      if (count.val) {
        clearInterval(count);
      }
    };
  }, []);
  const getUserAcquiredPlatformGift = () => {
    fetchUserAcquiredPlatformGift({
      giftType: "newUser",
    }).then((val) => {
      const { platformGiftPackInfo } = val;
      console.log(platformGiftPackInfo, 111);
      if (platformGiftPackInfo) {
        setVisibleCoupon(() => {
          setStatus("1");
          setData(platformGiftPackInfo);
          stopVideo();
          let num = 0;
          const val = setInterval(() => {
            num = num + 1;
            if (num === 5) {
              onCoupon();
              clearInterval(count.val);
            } else {
              setCount({
                time: 5 - num,
                val: val,
              });
            }
          }, 1000);
          return true;
        });
      }
    });
  };
  const templateCoupon = (item) => {
    const { platformCoupon = {} } = item;
    const { thresholdPrice, couponValue, useScenesType } = platformCoupon;
    const renter = {
      goodsBuy: "商品通用券",
      scan: "扫码通用券",
      virtual: "虚拟商品券",
      commerce: "电商券",
      community: "团购券",
    }[useScenesType];
    return (
      <View className="noviceCoupon_content_coupon">
        <View className="noviceCoupon_coupon_title1 font_hide">{renter}</View>
        <View className="noviceCoupon_coupon_title2">
          <View className="font30">¥</View>
          <View className="font48">{couponValue}</View>
        </View>
        <View className="noviceCoupon_coupon_title3">
          满{thresholdPrice}可用
        </View>
      </View>
    );
  };
  const template = () => {
    if (status === "0" && visible) {
      return (
        <Drawer show={visible} close={() => onClose()}>
          <View className="noviceGuide_box">
            <View className="noviceGuide_priceTitle">恭喜您获得价值</View>
            <View className="noviceGuide_priceContent">
              <View className="noviceGuide_priceContent_line1">¥</View>
              <View className="noviceGuide_priceContent_line2">18.00</View>
            </View>
            <View className="noviceGuide_newDesc">新人福利礼包</View>
            <View className="noviceGuide_desc">超值无门槛 先到先得</View>
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
              登录领取限量礼包
            </View>
          </View>
        </Drawer>
      );
    } else if (status === "1" && visibleCoupon) {
      const { giftValue, giftName, platformGiftPackRelateList = [] } = data;
      return (
        <Drawer show={visibleCoupon} close={() => onCoupon()}>
          <View className="noviceCoupon_box">
            <View className="noviceCoupon_title1">
              <View className="font28 ">恭喜您成功领取价值</View>
              <View className="font40 bold price_margin8"> ¥{giftValue}</View>
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
                  onCoupon(() =>
                    Router({
                      routerName: "webView",
                      args: {
                        link: `https://web-new.dakale.net/${env}/game/sign/index.html#/coupon`,
                      },
                    })
                  )
                }
              >
                更多新人福利({count.time}S){" "}
              </View>
            </View>
          </View>
        </Drawer>
      );
    } else return null;
  };
  const onClose = (fn) => {
    setVisible(false);
    initVideo && initVideo();
    fn && fn();
  };
  console.log(status, visibleCoupon);
  const onCoupon = (fn) => {
    setVisibleCoupon(false);
    fakeStorage("newUser", true);
    initVideo && initVideo();
    fn && fn();
  };
  /* 显示隐藏动画  */

  return template();
};
