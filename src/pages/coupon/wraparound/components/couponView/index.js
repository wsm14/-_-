import React, { useEffect, useState } from "react";
import { Image, View } from "@tarojs/components";
import { navigateTo, filterWeek } from "@/common/utils";
import classNames from "classnames";
import "./../../index.scss";
export default (props) => {
  const { item } = props;
  const [status, setStatus] = useState(false);
  const {
    merchantLogo,
    dayNum,
    merchantIdString,
    merchantName,
    couponType,
    userCouponIdString,
    couponStatus,
    couponImg,
    couponTitle,
    thresholdPrice = "",
    couponName,
    couponChannel,
    verificationCodeAmount,
    couponPrice,
    activeBeginDate,
    useWeek = "",
    useTime = "",
    verificationTime = "",
    activeEndDate,
  } = item;
  let nullImage =
    "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/conpon_shop.png";
  let nullCoupon =
    "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/coupon_big.png";

  const goMerchant = (val) => {
    const { ownerType, merchantIdString, ownerIdString } = val;
    if (ownerType !== "group") {
      navigateTo(
        `/pages/perimeter/merchantDetails/index?merchantId=${ownerIdString}`
      );
    } else {
      navigateTo(
        `/pages/perimeter/kaMerchantDetails/index?merchantGroupId=${ownerIdString}`
      );
    }
  };

  const goCouponDetails = (couponType, userCouponIdString) => {
    if (couponType !== "reduceCoupon" && couponType !== "freeReduceCoupon") {
      navigateTo(`/pages/coupon/couponDetails/index?id=${userCouponIdString}`);
    } else {
      navigateTo(`/pages/coupon/voucherDetails/index?id=${userCouponIdString}`);
    }
  };
  const templateContent = () => {
    if (couponType === "specialGoods") {
      return `数量${verificationCodeAmount}`;
    } else {
      return `面值${couponPrice} ${
        thresholdPrice.length > 0 ? `| 满${thresholdPrice}元可用` : ""
      }${verificationCodeAmount ? `| 数量：${verificationCodeAmount}` : ""}`;
    }
  };
  const temPlateBottom = () => {
    if (couponType === "goodsCoupon") {
      return (
        <View className="wraparound_coupon_bottom">
          <View
            onClick={(e) => {
              e.stopPropagation();
              setStatus(!status);
            }}
            className={classNames(
              status
                ? "wraparound_coupon_bottomIcon"
                : "wraparound_coupon_bottomIcon1"
            )}
          >
            限到店核销使用
          </View>
          {status && (
            <>
              <View className="wraparound_coupon_bottomMargin">
                仅用于指定商家
              </View>
              <View className="wraparound_coupon_bottomMargin">
                凭券到店扫码核销领取对应的商品
              </View>
              <View className="wraparound_coupon_bottomMargin">
                限{activeBeginDate} 至 {activeBeginDate}使用
              </View>
              <View className="wraparound_coupon_bottomMargin">
                限{filterWeek(useWeek) + " " + useTime}
              </View>
            </>
          )}
        </View>
      );
    } else {
      return (
        <View className="wraparound_coupon_bottom">
          <View
            onClick={(e) => {
              e.stopPropagation();
              setStatus(!status);
            }}
            className={classNames(
              status
                ? "wraparound_coupon_bottomIcon"
                : "wraparound_coupon_bottomIcon1"
            )}
          >
            {couponChannel === "buy" ? "限到店核销使用" : "限到店扫码支付使用"}
          </View>
          {status && (
            <>
              <View className="wraparound_coupon_bottomMargin">
                仅用于指定商家
              </View>
              {couponChannel === "buy" && (
                <View className="wraparound_coupon_bottomMargin">
                  凭券到店扫码核销使用
                </View>
              )}

              <View className="wraparound_coupon_bottomMargin">
                限{activeBeginDate} 至 {activeBeginDate}使用
              </View>
            </>
          )}
        </View>
      );
    }
  };
  const temPlateNoHander = () => {
    if (couponType === "goodsCoupon") {
      return (
        <View className="wraparound_coupon_bottom public_auto">
          <View className="wraparound_coupon_bottomIcon1">限到店核销使用</View>
          <View>
            {couponStatus === "2"
              ? `${verificationTime}使用`
              : `${activeEndDate}过期`}
          </View>
        </View>
      );
    } else {
      return (
        <View className="wraparound_coupon_bottom  public_auto">
          <View className="wraparound_coupon_bottomIcon1">
            {couponChannel === "buy" ? "限到店核销使用" : "限到店扫码支付使用"}
          </View>
          <View>
            {couponStatus === "2"
              ? `${verificationTime}使用`
              : `${activeEndDate}过期`}
          </View>
        </View>
      );
    }
  };
  const temPlateView = () => {
    return (
      <View
        className="wraparound_coupon_box"
        onClick={() => goCouponDetails(couponType, userCouponIdString)}
      >
        <View className="wraparound_coupon_top">
          <View
            className="wraparound_topBox"
            onClick={(e) => {
              e.stopPropagation();
              goMerchant(item);
            }}
          >
            <View className="wraparound_logo">
              <Image
                className="wraparound_logo"
                lazyLoad
                mode={"aspectFill"}
                src={merchantLogo ? merchantLogo : nullImage}
              ></Image>
            </View>
            <View className="wraparound_title font_hide">{merchantName}</View>
            <View className="wraparound_data color3 font24">
              {dayNum !== "0" ? `还有${dayNum}天过期` : "即将过期"}
            </View>
          </View>
        </View>
        <View className="wraparound_coupon_content">
          <View className="wraparound_couponBox">
            <View className="wraparound_couponImg">
              <Image
                className="wraparound_couponImg"
                lazyLoad
                mode={"aspectFill"}
                src={couponImg ? couponImg : nullCoupon}
              ></Image>
            </View>
            <View className="wraparound_couponContent">
              <View className="wraparound_couponContent_title font_hide font32 color1 bold">
                {couponName}
              </View>
              <View className="wraparound_couponContent_details font_hide font24 color2">
                {templateContent()}
              </View>
            </View>
          </View>
          {temPlateBottom()}
        </View>
      </View>
    );
  };
  const temPlateView1 = () => {
    return (
      <View
        onClick={() => goCouponDetails(couponType, userCouponIdString)}
        className={classNames(
          "temPlateView_box",
          couponStatus === "1" ? "temPlateView_date" : "temPlateView_over"
        )}
      >
        <View style={{ opacity: 0.4 }}>
          {" "}
          <View
            className="wraparound_topBox"
            onClick={(e) => {
              e.stopPropagation();
              goMerchant(item);
            }}
          >
            <View className="wraparound_logo">
              <Image
                className="wraparound_logo"
                lazyLoad
                mode={"aspectFill"}
                src={merchantLogo ? merchantLogo : nullImage}
              ></Image>
            </View>
            <View className="wraparound_title font_hide">{merchantName}</View>
          </View>
          <View className="temPlateView_content">
            <View className="wraparound_couponBox">
              <View className="wraparound_couponImg">
                <Image
                  className="wraparound_couponImg"
                  lazyLoad
                  mode={"aspectFill"}
                  src={couponImg ? couponImg : nullCoupon}
                ></Image>
              </View>
              <View className="wraparound_couponContent">
                <View className="wraparound_couponContent_title font_hide font32 color1 bold">
                  {couponName}
                </View>
                <View className="wraparound_couponContent_details font_hide font24 color2">
                  {templateContent()}
                </View>
              </View>
            </View>
            {temPlateNoHander()}
          </View>
        </View>
      </View>
    );
  };
  const templateRightTitle = () => {
    if (couponStatus === "0" || couponStatus === "3") {
      return temPlateView();
    } else {
      return temPlateView1();
    }
  };

  return templateRightTitle();
};
