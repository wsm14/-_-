import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import classNames from "classnames";
import { getListFreeCoupon } from "@/server/goods";
import { acquireCoupon } from "@/server/coupon";
import { toast } from "@/common/utils";

export default (props) => {
  const { data } = props;
  const [list, setList] = useState([]);
  const [saveVal, setSaveVal] = useState(null);
  useEffect(() => {
    const { relateOwnerId, merchantId, merchantIdString } = data;
    if (relateOwnerId && merchantId && list.length === 0) {
      getListFreeCoupon({ relateOwnerId, merchantId: merchantIdString }).then(
        (val) => {
          const { couponList } = val;
          setList(couponList);
        }
      );
    }
  }, [data]);
  console.log(saveVal);
  const saveCoupon = (obj) => {
    const { ownerCouponId } = obj;

    if (saveVal) {
      return;
    }
    acquireCoupon(obj, (res) => {
      toast("领取成功");
      setSaveVal(ownerCouponId);
    }).catch((val) => {
      toast("领取成功");
      setSaveVal(ownerCouponId);
    });
  };
  const renderList = (item) => {
    const { ownerCouponIdString, couponName, ownerIdString, thresholdPrice } =
      item;
    return (
      <View className="goods_coupon_sile">
        <View className="goods_coupon_name font_hide">{couponName}</View>
        <View className="goods_coupon_type">
          {thresholdPrice ? `满${thresholdPrice}元可用` : "不限门槛"}
        </View>
        <View
          onClick={() => {
            saveCoupon({
              ownerId: ownerIdString,
              ownerCouponId: ownerCouponIdString,
              couponChannel: "consume",
            });
          }}
          className={classNames(
            "goods_coupon_btn",
            saveVal ? "goods_coupon_color2" : "goods_coupon_color1"
          )}
        >
          {ownerCouponIdString === saveVal ? "已领" : "领券"}
        </View>
      </View>
    );
  };
  if (list.length > 0) {
    return (
      <View className="goods_coupon_box">
        <View className="goods_coupon_title">
          <View className="goods_coupon_liner"></View>
          <View className="font24 color2">到店支付有福利</View>
          <View className="goods_coupon_liner"></View>
        </View>
        <View className="goods_coupon_list">
          {list.map((item) => {
            return renderList(item);
          })}
        </View>
      </View>
    );
  } else return null;
};
