import React from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import { GetDistance, getLat, getLnt, computedPrice } from "@/utils/utils";
import Router from "@/utils/router";
export default ({ list, userInfo, name, categoryIds }) => {
  const template = (item, userInfo, linkTo) => {
    const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
    const {
      commission,
      couponName,
      buyPrice,
      merchantLogo,
      merchantName,
      lat,
      lnt,
      ownerIdString,
      ownerCouponIdString,
      merchantIdString,
    } = item;
    return (
      <View
        className="bubble_coupon_descBox animated  fadeIn"
        onClick={() =>
          linkTo(ownerIdString, ownerCouponIdString, merchantIdString)
        }
      >
        <View className="bubble_coupon_desc">
          <View className="bubble_coupon_descTitle font_hide">
            {couponName}
          </View>
          <View className="bubble_coupon_price">
            <View className="font18 color1">优惠价:</View>
            <View className="font24 color1 bold price_margin4">
              ¥{buyPrice}
            </View>
          </View>
          <View className="bubble_new_bean">
            <View className="bubble_new_img bean_getBigInfo"></View>
            <View className="bubble_new_pay">
              ¥{computedPrice(buyPrice, payBeanCommission)}
            </View>
          </View>
          <View className="bubble_new_bottom font_hide">
            <View className="bubble_new_user font_hide">
              <View className="bubble_new_userProfile">
                <Image
                  mode={"aspectFill"}
                  src={
                    merchantLogo ||
                    "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/merchant_dakale.png"
                  }
                  lazyLoad
                  className="bubble_conpon_image"
                ></Image>
              </View>
              <View className="bubble_new_userHide font_hide">
                <View className="bubble_new_merchantName font_hide">
                  {merchantName}
                </View>
                <View className="bubble_new_limit price_margin8">
                  {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
                </View>
              </View>
            </View>
            <View className="bubble_coupon_btn1 public_center">抢购</View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View className="bubble_coupon_box">
      <View className="bubble_coupon_title">
        <View className="bubble_coupon_titleFont">附近优惠券</View>
        {list.length > 5 && (
          <View
            className="bubble_coupon_ourFont"
            onClick={() => {
              Router({
                routerName: "nearPerimeter",
                args: {
                  categoryIds,
                  name,
                  type: "coupon",
                },
              });
            }}
          >
            更多
          </View>
        )}
      </View>
      <ScrollView scrollX className="bubble_coupon_content">
        {list.map((item, index) => {
          if (index < 5) {
            return template(
              item,
              userInfo,
              (ownerIdString, ownerCouponIdString, merchantIdString) => {
                Router({
                  routerName: "payCouponDetails",
                  args: {
                    ownerCouponId: ownerCouponIdString,
                    ownerId: ownerIdString,
                    merchantId: merchantIdString,
                  },
                });
              }
            );
          }
        })}
        {list.length > 5 && (
          <View className="bubble_move_box bubble_move_margin2">
            <View
              className="bubble_move_flex"
              onClick={() => {
                Router({
                  routerName: "nearPerimeter",
                  args: {
                    name,
                    categoryIds,
                    type: "coupon",
                  },
                });
              }}
            >
              <View className="bubble_move_icon"></View>
              <View className="bubble_move_font">查 看 更 多</View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
