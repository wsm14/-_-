import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Swiper, SwiperItem } from "@tarojs/components";
import classNames from "classnames";
import Coupon from "@/components/public_ui/innerCoupon";
import Taro from "@tarojs/taro";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  console.log(data);
  const [current, setCurrent] = useState(1);
  return (
    <View className="hotMetal_lb_swiperBox">
      <Swiper
        circular
        style={{ width: "100%", height: "100%" }}
        onChange={(e) => {
          setCurrent(e.detail.current + 1);
        }}
      >
        {data.map((item) => {
          const {
            giftName,
            platformGiftPackRelateList,
            paymentModeObject = {},
            buyPrice,
            platformGiftId,
            giftValue,
          } = item;
          const { type = "defaultMode", bean, cash } = paymentModeObject;
          return (
            <SwiperItem>
              <View className="hotMetal_lb_box">
                <View className="hotMetal_lb_title">惊喜神券大礼包</View>
                <View className="hotMetal_lb_desc">
                  价值{giftValue}元的{giftName}仅需
                  {type === "defaultMode" ? `${buyPrice}` : `${cash}`}元
                </View>
                {platformGiftPackRelateList.length >= 3 ? (
                  <View className="hotMetal_lb_content">
                    <View className="hotMetal_lb_content_info">
                      {platformGiftPackRelateList.map((val, index) => {
                        if (index < 2) {
                          return <Coupon type={1} data={val}></Coupon>;
                        } else {
                          return null;
                        }
                      })}
                    </View>
                  </View>
                ) : (
                  <View className="hotMetal_lb_content public_center">
                    {platformGiftPackRelateList.map((val) => {
                      if (platformGiftPackRelateList.length === 1) {
                        return <Coupon type={3} data={val}></Coupon>;
                      } else {
                        return <Coupon type={2} data={val}></Coupon>;
                      }
                    })}
                  </View>
                )}
                <View
                  className="hotMetal_lb_btn public_center"
                  onClick={() =>
                    Router({
                      routerName: "innerCouponDetails",
                      args: {
                        platformGiftId,
                      },
                    })
                  }
                >
                  {type === "defaultMode"
                    ? `${buyPrice}元 抢购`
                    : `${cash}元${bean > 0 && `+${bean}卡豆`} 抢购`}
                </View>
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
      {data.length > 1 && (
        <View className="hotMetal_show_near">
          {data.map((item, index) => {
            return (
              <View
                key={index}
                className={classNames(
                  index == current - 1
                    ? "hotMetal_near_linerTrue"
                    : "hotMetal_near_false"
                )}
              ></View>
            );
          })}
        </View>
      )}
    </View>
  );
};
