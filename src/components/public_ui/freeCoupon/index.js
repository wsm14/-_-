/*视频领券组件
  data 外部数据
  show 控制 是否显示
  beanflag  显示条件
 */
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text } from "@tarojs/components";
import { toast, GetDistance, getLat, getLnt } from "@/utils/utils";
import { acquireCoupon, getNewAvailableCoupon } from "@/server/coupon";
import "./index.scss";
export default (props) => {
  const { data, visible, show = false, beanflag } = props;
  const { freeCouponFlag } = data;
  const [list, setList] = useState([]);
  useEffect(() => {
    const { ownerId, momentId, channel = "moment" } = data;

    if (beanflag && freeCouponFlag === "1") {
      if (ownerId && momentId) {
        getAvailableCoupon({
          ownerId: ownerId,
          identifyId: momentId,
          channel,
        });
      }
    }
  }, [beanflag]);
  const acquire = (obj) => {
    acquireCoupon(obj);
  };
  const getAvailableCoupon = (obj) => {
    getNewAvailableCoupon(obj, (res) => {
      console.log(obj);
      const { couponList = [] } = res;
      setList(couponList);
    });
  };
  const { addressContentObject = {} } = data;
  const { lat, lnt, ownerName } = addressContentObject;
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
      merchantName,
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
        onClick={(e) => {
          e.stopPropagation();
          visible && visible();
        }}
        style={!show ? { display: "none" } : { display: "flex" }}
        class="atomicActivity_layer_box atomicActivity_layer_save"
      >
        <View class="atomicActivity_save_box">
          <View class="atomicActivity_save_title font_hide">
            {merchantName}
          </View>
          <View class="atomicActivity_save_merchant font_hide">
            <Text className="atomicActivity_save_text font_hide">
              {address}
            </Text>{" "}
            | {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
          <View class="atomicActivity_save_goods">
            <View class="atomicActivity_save_goodName  font_hide">
              {couponName}
            </View>
            <View class="atomicActivity_save_city">
              面值 {couponPrice}元
              {thresholdPrice > 0 ? `| 满${thresholdPrice}元可用` : ""}
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
            立即领取
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
