import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { toast, GetDistance, getLat, getLnt } from "@/common/utils";
import classNames from "classnames";
import { acquireCoupon, getAvailableCoupon } from "@/server/coupon";
import "./index.scss";
export default (props) => {
  const { data, visible, show = false, beanflag } = props;
  const [list, setList] = useState([]);
  useEffect(() => {
    const { userIdString, userMomentIdString, channel = "moment" } = data;
    if (beanflag === true) {
      if (userIdString && userMomentIdString) {
        getAvailable({
          merchantId: userIdString,
          identifyId: userMomentIdString,
          channel,
        });
      }
    }
  }, [beanflag]);
  const acquire = (obj) => {
    acquireCoupon(obj);
  };
  const getAvailable = (obj) => {
    getAvailableCoupon(obj, (res) => {
      const { couponList = [] } = res;
      setList(couponList);
    });
  };
  const { lat, lnt, username } = data;

  if (list.length > 0) {
    const {
      couponName,
      reduceObject = {},
      activeDate,
      endDate,
      activeDays,
      delayDays,
      ownerIdString,
      merchantIdString,
      ownerCouponIdString,
      address,
    } = list[0];
    const { couponPrice, thresholdPrice } = reduceObject;
    const templateTime = () => {
      if (activeDays) {
        if (delayDays) {
          return `领取后${delayDays}天内生效，有效期${activeDays}天`;
        } else {
          return `购买后即刻生效，有效期${activeDays}天,请在有效期内使用`;
        }
      } else {
        return `${activeDate}至${endDate}`;
      }
    };
    return (
      <View
        style={!show ? { display: "none" } : { display: "flex" }}
        class="atomicActivity_layer_box atomicActivity_layer_save"
      >
        <View class="atomicActivity_save_box">
          <View class="atomicActivity_save_title font_hide">{username}</View>
          <View class="atomicActivity_save_merchant font_hide">
            <Text className="atomicActivity_save_text font_hide">
              {address}
            </Text>{" "}
            | {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
          <View class="atomicActivity_save_toast">送您到店消费优惠券</View>
          <View class="atomicActivity_save_goods">
            <View className="positionSave">
              <Text className="font24">￥</Text>
              {couponPrice}
            </View>
            <View class="atomicActivity_save_goodName  font_hide">
              {" "}
              {couponName}
            </View>
            <View class="atomicActivity_save_city">
              面值{couponPrice}元｜
              {thresholdPrice > 0 ? `满${thresholdPrice}元可用` : ""}
            </View>
            <View class="atomicActivity_save_time  font_hide">
              {templateTime()}
            </View>
          </View>
          <View
            class="atomicActivity_save_btn"
            onClick={() => {
              acquire({
                ownerId: ownerIdString,
                ownerCouponId: ownerCouponIdString,
                couponChannel: "moment",
                merchantId: merchantIdString,
              });
              visible && visible();
            }}
          >
            开心收下
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
