import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import Drawer from "@/components/Drawer";
import {
  fakeStorage,
  fetchStorage,
  computedTime,
  loginStatus,
} from "@/utils/utils";
import { fakeAcquireMoment, fakeLinkCoupon } from "@/server/index";
import "./index.scss";
export default ({ visible, data, onChange, userMomentsList }) => {
  const { momentId, tippingBean, ownerId } = data;
  const [visibleFlag, setvisibleFlag] = useState(false);
  const [couponVisible, setVisible] = useState(false);
  const [couponInfo, setCouponInfo] = useState([]);
  const [userPlatformCouponInfo, setUserPlatformCouponInfo] = useState({});
  useEffect(() => {
    if (!visible) {
      setCouponInfo([]);
      setUserPlatformCouponInfo({});
      setVisible(false);
      setvisibleFlag(false);
    } else {
      const { createTime } = loginStatus();
      let count = computedTime(createTime);
      const { num, current = 0 } = fetchStorage(`day${count}`);
      fakeAcquireMoment({
        momentId,
        beanStage: current === 0 ? 50 : 150,
        newUserFlag: createTime < 3 ? 0 : 1,
        ownerId,
      })
        .then((val) => {
          const { momentLinkCouponList = [] } = val;
          onChange({
            userMomentsInfo: {
              ...data,
              watchStatus: "1",
            },
            userMomentsList: userMomentsList.map((item) => {
              if (item.momentId === momentId) {
                return {
                  ...item,
                  watchStatus: "1",
                };
              }
              return item;
            }),
          });
          setvisibleFlag(() => {
            setCouponInfo(momentLinkCouponList);
            return true;
          });

          fakeStorage(`day${count}`, {
            current: current + 1,
            num: num + tippingBean,
          });
        })
        .catch((res) => {
          const { resultCode } = res;
          if (resultCode == "5231") {
            this.setState({
              userMomentsInfo: {
                ...data,
                beanFlag: 0,
              },
              userMomentsList: userMomentsList.map((item) => {
                if (item.momentId === momentId) {
                  return {
                    ...item,
                    beanFlag: 0,
                  };
                }
                return item;
              }),
            });
          }
        });
    }
  }, [visible]);

  const templateCoupon = () => {
    const {
      couponName,
      activeBeginDate,
      activeEndDate,
      couponValue,
      thresholdPrice,
      couponType,
    } = userPlatformCouponInfo;
    return (
      <View className="couponNews_content">
        <View className="couponNews_title font_hide">{couponName}</View>
        <View className="couponNews_time">
          有效期：{activeBeginDate} 至 {activeEndDate}
        </View>
        <View className="couponNews_price">
          <View className="font24 color3">¥</View>
          <View className="font40 price_margin4 color3">{couponValue}</View>
          <View className="font20 price_margin8 color2">
            满{thresholdPrice}可用
          </View>
        </View>
        <View className="couponNews_icon public_center">
          {couponType === "fullReduce" ? "满减券" : "折扣券"}
        </View>
      </View>
    );
  };
  const saveCoupon = (platformCouponId) => {
    const { createTime } = loginStatus();
    let count = computedTime(createTime);
    const { num, current = 0 } = fetchStorage(`day${count}`);
    fakeLinkCoupon({
      platformCouponId,
      beanStage: current == 1 ? "50" : "150",
    })
      .then((val) => {
        const { userPlatformCouponInfo } = val;
        setVisible(() => {
          setvisibleFlag(false);
          setUserPlatformCouponInfo(userPlatformCouponInfo);
          return true;
        });
      })
      .catch((e) => {
        onChange({
          showFlag: false,
          couponFlag: true,
        });
      });
  };
  return (
    <>
      {visibleFlag && (
        <Drawer
          show={visibleFlag}
          close={() => {
            onChange({
              showFlag: false,
              couponFlag: true,
            });
          }}
        >
          <View className="couponBean_info">
            <View className="couponBean_content">
              <View className="couponBean_bean_hook"></View>
              <View className="couponBean_bean_x"></View>
              <View className="couponBean_bean_bean">{tippingBean}</View>
            </View>
            <View className="couponBean_let public_auto">
              {couponInfo.map((item, index) => {
                const { createTime } = loginStatus();
                let count = computedTime(createTime);
                const { num, current = 0 } = fetchStorage(`day${count}`);
                const {
                  exchangeBeanNum,
                  useScenesType,
                  thresholdPrice,
                  couponValue,
                  platformCouponId,
                } = item;
                const renter = {
                  goodsBuy: "商品通用券",
                  scan: "扫码通用券",
                  virtual: "虚拟商品券",
                  commerce: "电商券",
                  community: "团购券",
                }[useScenesType];
                return (
                  <View className="couponBean_coupon_details">
                    <View className="couponBean_coupon_absolute">
                      {num < exchangeBeanNum && (
                        <View className="couponBean_coupon_toast">
                          {exchangeBeanNum}卡豆可兑
                        </View>
                      )}
                    </View>
                    <View className="couponBean_coupon_title">{renter}</View>
                    <View className="couponBean_coupon_price">
                      <View className="couponBean_coupon_price1">¥</View>
                      <View className="couponBean_coupon_price2">
                        {couponValue}
                      </View>
                    </View>
                    <View className="couponBean_coupon_xz">
                      满{thresholdPrice}可用
                    </View>
                    {exchangeBeanNum > num ? (
                      <View
                        className="couponBean_coupon_btn public_center"
                        onClick={() =>
                          onChange({
                            showFlag: false,
                          })
                        }
                      >
                        继续捡豆
                      </View>
                    ) : (
                      <View
                        className="couponBean_coupon_btn public_center"
                        onClick={() => saveCoupon(platformCouponId)}
                      >
                        {exchangeBeanNum}卡豆可兑
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </Drawer>
      )}
      {couponVisible && (
        <Drawer
          show={couponVisible}
          close={() => {
            onChange({
              showFlag: false,
              couponFlag: true,
            });
          }}
        >
          <View className="coupon_success_box">
            <View className="coupon_success_title">兑换成功</View>
            <View className="coupon_success_titleInfo">恭喜你成功领取</View>
            {templateCoupon({})}

            <View className="coupon_success_init">
              可在「我的-我的券包」中查看券详情
            </View>
            <View
              className="coupon_success_btn public_center"
              onClick={() => {
                onChange({
                  showFlag: false,
                  couponFlag: true,
                });
              }}
            >
              继续捡豆
            </View>
          </View>
        </Drawer>
      )}
    </>
  );
};
