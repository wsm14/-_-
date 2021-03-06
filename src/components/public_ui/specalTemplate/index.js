import React from "react";
import { Text, View } from "@tarojs/components";
import {
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  computedPrice,
} from "@/utils/utils";
import Date from "@/components/dateTime";
import classNames from "classnames";
import Router from "@/utils/router";
import "./index.scss";
export const template = (
  item,
  configUserLevelInfo,
  animate = true,
  flag = true
) => {
  const { payBeanCommission = 50 } = configUserLevelInfo;
  const {
    goodsName,
    goodsImg,
    oriPrice,
    realPrice,
    lnt,
    lat,
    merchantName,
    merchantLogo,
    specialActivityIdString,
    ownerIdString,
    commission,
    identification,
  } = item;
  return (
    <View
      className={classNames("specialOffer_shop", "animated fadeIn")}
      onClick={() =>
        Router({
          routerName: "favourableDetails",
          args: {
            specialActivityId: specialActivityIdString,
            merchantId: ownerIdString,
            identification,
          },
        })
      }
    >
      <View
        style={backgroundObj(goodsImg)}
        className="specialOffer_shopImg"
      ></View>
      <View className="specialOffer_desc">
        <View className="specialOffer_title  font_hide">{goodsName}</View>
        <View className="specialOffer_userDetails font_hide">
          {flag && (
            <React.Fragment>
              <View
                className="specialOffer_userprofile merchant_dakale_logo"
                style={backgroundObj(merchantLogo)}
              ></View>
              <View className="specialOffer_userHide">
                <View className="specialOffer_username font_hide">
                  {merchantName}
                </View>
                <View className="specialOffer_limit">
                  ｜{GetDistance(getLat(), getLnt(), lat, lnt)}
                </View>
              </View>
            </React.Fragment>
          )}
        </View>
        <View className="specialOffer_hotOld_price color1 font_hide">
          <View className="font20">原价:</View>
          <View className="font24 bold price_margin4 text_through">
            ¥{oriPrice}
          </View>
        </View>
        <View className="specialOffer_real_price font_hide">
          <View className="font20 color1">优惠价:</View>
          <View className="font28 color1 bold price_margin4  real_max font_hide">
            ¥{realPrice}
          </View>
        </View>
        <View
          style={{ border: "1px solid #ef476f;" }}
          className="specialOffer_new_bean"
        >
          <View className="bean_getBigInfo specialOffer_new_img"></View>
          <View className="specialOffer_new_pay font_hide">
            ¥{computedPrice(realPrice, payBeanCommission)}
          </View>
        </View>
      </View>
      <View className="specialOffer_new_btn">抢购</View>
    </View>
  );
};
//特惠
export const childTemplate = (item, configUserLevelInfo, type = "hot") => {
  const { payBeanCommission = 50 } = configUserLevelInfo;
  const {
    goodsId,
    goodsName,
    goodsImg,
    oriPrice,
    realPrice,
    lnt,
    lat,
    status,
    goodsType,
    merchantAddress,
    merchantName,
    merchantLogo,
    merchantIdString,
    specialActivityIdString,
    merchantPrice = 0,
    activityEndTime,
    activityTimeRule = "infinite",
    buyUserImageList = [],
    ownerIdString,
  } = item;
  const leftTemplate = {
    hot:
      activityTimeRule !== "infinite" && activityTimeRule !== "" ? (
        <View className="specialOffer_shop_text">
          <Date styles times={activityEndTime} fn={() => {}}></Date>
        </View>
      ) : (
        <View className="color1 font28">长期有效</View>
      ),
    today: (
      <View className="specialOffer_profile">
        {buyUserImageList.map((item, index) => {
          if (index === 0) {
            return (
              <View
                className="specialOffer_profile_box dakale_profile"
                style={backgroundObj(item)}
              ></View>
            );
          } else {
            return (
              <View
                className="specialOffer_profile_box dakale_profile specialOffer_profile_left"
                style={backgroundObj(item)}
              ></View>
            );
          }
        })}
        <View className="specialOffer_left_pay">抢购中</View>
      </View>
    ),
  }[type];
  return (
    <View
      className="specialOffer_shop_box"
      onClick={() =>
        Router({
          routerName: "favourableDetails",
          args: {
            specialActivityId: specialActivityIdString,
            merchantId: ownerIdString,
          },
        })
      }
    >
      <View className="specialOffer_shop_child animated fadeIn">
        <View
          style={backgroundObj(goodsImg)}
          className="specialOffer_shopImg"
        ></View>
        <View className="specialOffer_desc">
          <View className="specialOffer_title  font_hide">{goodsName}</View>
          <View className="specialOffer_userDetails font_hide">
            <View
              className="specialOffer_userprofile merchant_dakale_logo"
              style={backgroundObj(merchantLogo)}
            ></View>
            <View className="specialOffer_userHide">
              <View className="specialOffer_username font_hide">
                {" "}
                {merchantName}
              </View>
              <View className="specialOffer_limit">
                {" "}
                ｜ {GetDistance(getLat(), getLnt(), lat, lnt)}
              </View>
            </View>
          </View>
          <View className="specialOffer_hotOld_price color1 font_hide">
            <View className="font20">原价:</View>
            <View className="font24 bold price_margin4 text_through">
              ¥{oriPrice}
            </View>
          </View>
          <View className="specialOffer_real_price font_hide">
            <View className="font20 color1">优惠价:</View>
            <View className="font28 color1 bold price_margin4  real_max font_hide">
              ¥{realPrice}
            </View>
          </View>
          <View
            style={{ border: "1px solid #ef476f;" }}
            className="specialOffer_new_bean"
          >
            <View className="bean_getBigInfo specialOffer_new_img"></View>
            <View className="specialOffer_new_pay font_hide">
              ¥{computedPrice(realPrice, payBeanCommission)}
            </View>
          </View>
        </View>
      </View>
      <View className="specialOffer_shop_bottom public_auto">
        {leftTemplate}
        <View className="specialOffer_shop_btn">抢购</View>
      </View>
    </View>
  );
};
//带头像或者时间的特殊特惠样式
export const couponTemplate = (item, configUserLevelInfo) => {
  const { payBeanCommission = 50 } = configUserLevelInfo;
  let nullCoupon =
    "https://wechat-config.dakale.net/miniprogram/image/coupon_big.png";
  let nullImage =
    "https://wechat-config.dakale.net/miniprogram/image/conpon_shop.png";
  const {
    couponImg,
    couponName,
    merchantLogo,
    lat,
    lnt,
    buyPrice,
    merchantPrice = 0,
    merchantName,
    buyRule,
    personLimit,
    dayMaxBuyAmount,
    reduceObject = {},
    ownerCouponIdString,
    ownerIdString,
    merchantIdString,
  } = item;
  const { couponPrice = "", thresholdPrice = "" } = reduceObject;
  const templateSelect = () => {
    if (buyRule === "unlimited") {
      return `不限购`;
    } else {
      if (buyRule === "personLimit") {
        return `每人限购${personLimit}份`;
      } else {
        return `每人每天限购${dayMaxBuyAmount}份`;
      }
    }
  };
  return (
    <View
      className="specialOffer_shop animated fadeIn"
      onClick={() =>
        Router({
          routerName: "payCouponDetails",
          args: {
            ownerCouponId: ownerCouponIdString,
            ownerId: ownerIdString,
            merchantId: merchantIdString,
          },
        })
      }
    >
      <View
        style={backgroundObj(couponImg || nullCoupon)}
        className="specialOffer_shopImg"
      ></View>
      <View className="specialOffer_desc">
        <View className="specialOffer_coupon_title  font_hide">
          {couponName}
        </View>
        <View className="specialOffer_coupon_details font_hide">
          {thresholdPrice ? `满${thresholdPrice}元可用 ` : "无门槛"}
        </View>
        <View className="specialOffer_userDetails font_hide">
          <View
            className="specialOffer_userprofile"
            style={backgroundObj(merchantLogo || nullImage)}
          ></View>
          <View className="specialOffer_username font_hide">
            {" "}
            {merchantName}
          </View>
          <View className="specialOffer_limit">
            {" "}
            ｜ {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="specialOffer_old_height"></View>
        <View className="specialOffer_real_price font_hide">
          <View className="font20 color1">优惠价:</View>
          <View className="font28 color1 bold price_margin4  real_max font_hide">
            ¥{buyPrice}
          </View>
        </View>
        <View
          style={{ border: "1px solid #ef476f;" }}
          className="specialOffer_new_bean"
        >
          <View className="bean_getBigInfo specialOffer_new_img"></View>
          <View className="specialOffer_new_pay font_hide">
            ¥{computedPrice(buyPrice, payBeanCommission)}
          </View>
        </View>
      </View>

      <View className="specialOffer_bottom_btn">抢购</View>
    </View>
  );
};
//券
export const prefectrueGoodsTemplate = (item) => {
  const {
    goodsImg,
    goodsName,
    merchantName,
    merchantLogo,
    lat,
    lnt,
    oriPrice,
    realPrice,
    paymentModeObject: { bean, cash },
    specialActivityIdString,
    ownerId,
    identification,
  } = item;
  return (
    <View
      className="prefecture_fure_box"
      onClick={() => {
        Router({
          routerName: "favourableDetails",
          args: {
            specialActivityId: specialActivityIdString,
            merchantId: ownerId,
            identification,
          },
        });
      }}
    >
      <View
        className="prefecture_fure_img"
        style={backgroundObj(goodsImg)}
      ></View>
      <View className="prefecture_fure_content">
        <View className="prefecture_fure_title font_hide">{goodsName}</View>
        <View className="prefecture_fure_user  font_hide">
          <View
            className="prefecture_fure_userProfile merchant_dakale_logo"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="prefecture_fure_userName font_hide">
            {merchantName}
          </View>
          <View className="prefecture_fure_limit">
            {"| "}
            {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="prefecture_fure_price">
          <Text className="font20">原价:</Text>
          <Text className="font24 text_through">{oriPrice}</Text>
        </View>
        <View className="prefecture_fure_tag prefecture_fure_margin1"></View>
        <View className="prefecture_fure_bean">
          ¥{cash}+{bean}卡豆
        </View>
      </View>
      <View className="prefecture_btn  public_center">抢购</View>
    </View>
  );
};
//权益商品
export const prefectrueCouponTemplate = (item) => {
  const {
    couponImg,
    couponName,
    lat,
    lnt,
    merchantLogo,
    paymentModeObject: { bean, cash },
    merchantName,
    oriPrice,
    realPrice,
    ownerIdString,
    ownerCouponIdString,
    identification,
  } = item;
  return (
    <View
      className="prefecture_fure_box"
      onClick={() =>
        Router({
          routerName: "payCouponDetails",
          args: {
            merchantId: ownerIdString,
            ownerId: ownerIdString,
            ownerCouponId: ownerCouponIdString,
            identification,
          },
        })
      }
    >
      <View
        className="prefecture_fure_img coupon_big_icon"
        style={backgroundObj(couponImg)}
      ></View>
      <View className="prefecture_fure_content">
        <View className="prefecture_fure_title font_hide">{couponName}</View>
        <View className="prefecture_fure_quan font_hide">{"无门槛"}</View>
        <View className="prefecture_fure_user font_hide">
          <View
            className="prefecture_fure_userProfile merchant_dakale_logo"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="prefecture_fure_userName"> {merchantName}</View>
          <View className="prefecture_fure_limit">
            {"| "}
            {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="prefecture_fure_tag prefecture_fure_margin2"></View>
        <View className="prefecture_fure_bean">
          ¥{cash}+{bean}卡豆
        </View>
      </View>
      <View className="prefecture_btn  public_center">抢购</View>
    </View>
  );
};
//权益券

export const commerGoodsTemplate = (item, configUserLevelInfo) => {
  const {
    goodsImg,
    goodsName,
    oriPrice,
    realPrice,
    paymentModeObject: { bean, cash, type },
    specialActivityIdString,
    ownerId,
    commission,
    identification,
  } = item;
  const templatePrice = {
    self: (
      <View className="prefecture_fure_bean">
        ¥{cash}+{bean}卡豆
      </View>
    ),
    defaultMode: <View className="prefecture_fure_bean">{realPrice}</View>,
  }[type];
  return (
    <View
      className="prefecture_fure_box"
      onClick={() => {
        Router({
          routerName: "favourableDetails",
          args: {
            specialActivityId: specialActivityIdString,
            merchantId: ownerId,
            identification,
          },
        });
      }}
    >
      <View
        className="prefecture_fure_img"
        style={backgroundObj(goodsImg)}
      ></View>
      <View className="prefecture_fure_content">
        <View className="prefecture_fure_twoTitle font_noHide">
          {goodsName}
        </View>

        <View className="prefecture_fure_price">
          <Text className="font20">原价:</Text>
          <Text className="font24 text_through">{oriPrice}</Text>
        </View>
        <View className="prefecture_fure_tag prefecture_fure_margin1"></View>
        {templatePrice}
      </View>
      <View className="prefecture_btn  public_center">抢购</View>
    </View>
  );
};
//电商商品
