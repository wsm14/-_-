import React, { useMemo, useState } from "react";
import { View, Text, Swiper, SwiperItem } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  backgroundObj,
  computedPrice,
  computedBeanPrice,
} from "@/common/utils";
import ButtonView from "@/components/Button";
import classNames from "classnames";
export default ({
  val = {},
  callback,
  shareCommission,
  onClose,
  payBeanCommission = 50,
  ownerImg,
}) => {
  const { activityGoodsList = [], ownerCouponList = [] } = val;
  const [current, setCurrent] = useState(0);
  const templateBtn = (val) => {
    const { commission } = val;
    if (shareCommission > 0) {
      return (
        <View className="templateCard_btn_box">
          <View className="templateCard_btn_initbuy public_center">
            <View
              className="font_hide"
              style={{ maxWidth: Taro.pxTransform(135) }}
            >
              自购返¥{computedPrice(commission, shareCommission)}
            </View>
          </View>
          <View className="templateCard_btn_initshare public_center">
            <View
              className="font_hide"
              style={{ maxWidth: Taro.pxTransform(135) }}
            >
              分享赚¥{computedPrice(commission, shareCommission)}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View className="templateCard_btn_box">
          <View className="templateCard_btn_buy public_center">立即抢购</View>
          <View className="templateCard_btn_share public_center">
            分享给好友
          </View>
        </View>
      );
    }
  };
  const memo = useMemo(() => {
    return (
      <ButtonView
        data={{
          path: "pages/index/home/index",
          type: "home_shopcard",
          name: "首页商品大卡片",
        }}
      >
        <View className="templateCard_now_box">
          <Swiper
            current={current}
            style={{ width: "100%", height: "100%" }}
            autoplay
            onChange={(e) => {
              setCurrent(e.detail.current);
            }}
            interval={5000}
            circular
          >
            {activityGoodsList.map((item) => {
              const { goodsImg, goodsName, realPrice, commission, oriPrice } =
                item;
              return (
                <SwiperItem>
                  <View
                    style={{ position: "relative" }}
                    onClick={(e) => {
                      callback(item);
                    }}
                  >
                    <View className="templateCard_details_box">
                      <View
                        className="templateCard_image coupon_shop_icon"
                        style={backgroundObj(goodsImg)}
                      ></View>
                      <View className="templateCard_goods_box">
                        <View className="templateCard_title font_hide">
                          {goodsName}
                        </View>
                        <View className="templateCard_price font_hide">
                          <Text className="font22 bold color6">优惠价:</Text>
                          <Text className="font28 bold color6 templateCard_margin1">
                            ¥{realPrice}
                          </Text>
                          <Text className="font20 color6 bold templateCard_margin2 templateCard_opcity">
                            原价:
                          </Text>
                          <Text className="font20 color6 bold templateCard_margin1 templateCard_opcity templateCard_through">
                            ¥{oriPrice}
                          </Text>
                        </View>
                        <View className="templateCard_beanPrice font_hide">
                          <Text className="font20">卡豆再省:</Text>
                          <Text className="font20 bold templateCard_margin1">
                            ¥{" "}
                          </Text>
                          <Text className="font28 bold templateCard_margin1">
                            {computedBeanPrice(
                              realPrice,
                              100 - payBeanCommission
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {templateBtn(item)}
                  </View>
                </SwiperItem>
              );
            })}
            {ownerCouponList.map((item) => {
              const {
                couponName,
                reduceObject: { couponPrice },
                commission,
                buyPrice,
              } = item;
              return (
                <SwiperItem>
                  <View
                    style={{ position: "relative" }}
                    onClick={(e) => {
                      callback(item);
                    }}
                  >
                    <View className="templateCard_details_box">
                      <View
                        className="templateCard_image coupon_shop_icon"
                        style={backgroundObj(ownerImg)}
                      ></View>
                      <View className="templateCard_goods_box">
                        <View className="templateCard_title font_hide">
                          {couponName}
                        </View>
                        <View className="templateCard_price font_hide">
                          <Text className="font22 bold color6">优惠价:</Text>
                          <Text className="font28 bold color6 templateCard_margin1">
                            ¥{buyPrice}
                          </Text>
                          <Text className="font20 color6 bold templateCard_margin2 templateCard_opcity">
                            原价:
                          </Text>
                          <Text className="font20 color6 bold templateCard_margin1 templateCard_opcity templateCard_through">
                            ¥{couponPrice}
                          </Text>
                        </View>
                        <View className="templateCard_beanPrice font_hide">
                          <Text className="font20">卡豆再省:</Text>
                          <Text className="font20 bold templateCard_margin1">
                            ¥{" "}
                          </Text>
                          <Text className="font28 bold templateCard_margin1">
                            {computedBeanPrice(
                              buyPrice,
                              100 - payBeanCommission
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {templateBtn(item)}
                  </View>
                </SwiperItem>
              );
            })}
          </Swiper>
          <View
            className="templateCard_close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          ></View>
          {[...activityGoodsList, ...ownerCouponList].length > 1 && (
            <View className="banner_slider_box">
              {[...activityGoodsList, ...ownerCouponList].map((item, index) => {
                return (
                  <View
                    key={index}
                    className={classNames(
                      index == current ? "banner_slider" : "banner_slider_false"
                    )}
                  ></View>
                );
              })}
            </View>
          )}
        </View>
      </ButtonView>
    );
  }, [val, shareCommission, payBeanCommission, ownerImg, current]);
  return memo;
};
