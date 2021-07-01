import React from "react";
import { View, Text } from "@tarojs/components";
import {
  backgroundObj,
  getLat,
  getLnt,
  GetDistance,
  computedPrice,
  mapGo,
} from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
const shopLogo =
  "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/conpon_shop.png";
const coupomLogo =
  "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/coupon_big.png";
const linkTo = (item) => {
  const {
    specialActivityIdString,
    merchantIdString,
    ownerCouponIdString,
    ownerIdString,
  } = item;
  if (specialActivityIdString) {
    Router({
      routerName: "favourableDetails",
      args: {
        specialActivityId: specialActivityIdString,
        merchantId: merchantIdString,
      },
    });
  } else {
    Router({
      routerName: "payCouponDetails",
      args: {
        ownerCouponId: ownerCouponIdString,
        ownerId: ownerIdString,
        merchantId: merchantIdString,
      },
    });
  }
};
export const ShopView = (item, type = "goods", userInfo) => {
  const {
    oriPrice,
    realPrice,
    lat,
    lnt,
    activityGoodsImg,
    merchantLogo,
    merchantPrice,
    merchantName,
    goodsName,
    goodsImg,
    buyPrice,
    couponPrice,
    couponName,
  } = item;
  const filterType = {
    oldPrice: oriPrice,
    relPrice: realPrice,
    lat,
    lnt,
    shopImg: activityGoodsImg,
    merchantLogo,
    merchantPrice,
    shopName: goodsName,
  };
  const { oldPrice, relPrice, shopImg, shopName } = filterType;

  return (
    <View onClick={() => linkTo(item)} className="view_shop_box">
      <View
        className="view_shop_img"
        style={backgroundObj(goodsImg || coupomLogo)}
      ></View>
      <View className="view_shop_content">
        <View className="view_shopContent_box">
          <View className="view_shopContent_name bold font_hide">
            {shopName || couponName}
          </View>
          <View className="view_shopContent_user font_hide">
            <View
              className="view_shopContent_profile"
              style={backgroundObj(merchantLogo || shopLogo)}
            ></View>
            <View className="view_shopContent_username price_margin8 font_hide">
              {merchantName}
            </View>
            <View className="price_margin4">｜</View>
            <View className="view_shopContent_limit price_margin4">
              {GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
          <View className="view_shopContent_price">
            <View className="view_shopContent_priceTitle">原价:</View>
            <View className="view_shopContent_priceNum text_through bold">
              ¥{oldPrice || couponPrice}
            </View>
            <View className="view_shopContent_priceTitle price_margin8">
              优惠价:
            </View>
            <View className="view_shopContent_priceNum bold">
              ¥{relPrice || buyPrice}
            </View>
          </View>
          <View className="view_shopContent_bean">卡豆抵扣后最低到手价</View>
          <View className="view_shopContent_buyPrice">
            <View className="view_shopContent_info">¥</View>
            <View className="view_shopContent_money price_margin4">
              {computedPrice(relPrice || buyPrice, 50)}
            </View>
          </View>
        </View>
        <View className="view_shop_btn public_center">立即抢购</View>
      </View>
    </View>
  );
};
//分享 商品 或者 券ui

export const CardView = (item) => {
  const {
    headerImg,
    merchantName,
    businessTime = "",
    lat,
    lnt,
    categoryName,
    address,
    merchantId,
    perCapitaConsumption,
  } = item;
  return (
    <View
      className="view_card_box"
      onClick={(e) => {
        e.stopPropagation();
        Router({
          routerName: "merchantDetails",
          args: {
            merchantId: merchantId,
          },
        });
      }}
    >
      <View className="view_card_content">
        <View className="view_card_img" style={backgroundObj(headerImg)}></View>
        <View className="view_card_body">
          <View className="view_card_userName font_hide">{merchantName}</View>
          <View className="view_card_data">
            {businessTime && (
              <View className="view_card_tag">
                <View className="view_card_load">营业时间</View>
                <View className="view_card_liner"></View>
                <View className="view_card_time price_margin8">
                  {businessTime.split(" ")[0]}
                </View>
              </View>
            )}

            <View className="view_card_peoplePay">
              人均￥{perCapitaConsumption}
            </View>
          </View>
          <View className="view_card_address font_hide">
            <View className="view_card_size">{categoryName}</View>
            <View className="view_card_addressDetails font_hide">
              {address}
            </View>
            <View className="view_card_limit">
              {GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
        </View>
        <View
          className="view_card_golink"
          onClick={(e) => {
            e.stopPropagation();
            mapGo({
              lat: lat,
              lnt: lnt,
              address,
              merchantName,
            });
          }}
        ></View>
      </View>
    </View>
  );
};
//分享 店铺ui

export const newShopView = (item) => {
  const {
    goodsImg,
    goodsName,
    goodsType,
    lat,
    lnt,
    merchantAddress,
    merchantIdString,
    merchantLogo,
    merchantName,
    oriPrice,
    realPrice,
    buyPrice,
    couponPrice,
    couponName,
  } = item;
  return (
    <View onClick={() => linkTo(item)} className="newShopView_box">
      <View className="newShopView_content_box">
        <View className="newShopView_content_left">
          <View
            className="newShopView_img"
            style={backgroundObj(goodsImg || coupomLogo)}
          ></View>
        </View>

        <View className="newShopView_details">
          <View className="newShopView_details_name font_hide">
            {goodsName || couponName}
          </View>
          <View className="newShopView_shopContent_user font_hide">
            <View
              className="newShopView_shopContent_profile"
              style={backgroundObj(merchantLogo || shopLogo)}
            ></View>
            <View className="newShopView_shopContent_username price_margin8 font_hide">
              {merchantName}
            </View>
            <View className="price_margin4">｜</View>
            <View className="newShopView_shopContent_limit price_margin4">
              {GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
          </View>
          <View className="newShopView_shopContent_price font_hide">
            <View className="newShopView_shopContent_priceTitle">原价:</View>
            <View className="newShopView_shopContent_priceNum bold font_hide text_through">
              ¥{oriPrice || couponPrice}
            </View>
            <View className="newShopView_shopContent_priceTitle price_margin8">
              优惠价:
            </View>
            <View className="newShopView_shopContent_priceNum bold">
              ¥{realPrice || buyPrice}
            </View>
          </View>
          <View className="newShopView_shopContent_bean">
            卡豆抵扣后最低到手价
          </View>
          <View className="newShopView_shopContent_buyPrice">
            <View className="newShopView_shopContent_info"></View>
            <View className="newShopView_shopContent_money price_margin4">
              ¥{computedPrice(realPrice || buyPrice, 50)}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// 新手视频商品ui

export const meShopView_box = (item) => {
  const {
    goodsImg,
    goodsName,
    goodsType,
    lat,
    lnt,
    merchantAddress,
    merchantIdString,
    merchantLogo,
    merchantName,
    oriPrice,
    realPrice,
    specialActivityIdString,
    status,
  } = item;
  return (
    <View onClick={() => linkTo(item)} className="meShopView_item">
      <View
        className="meShopView_item_img"
        style={backgroundObj(goodsImg)}
      ></View>
      <View className="meShopView_item_content">
        <View className="meShopView_item_title font_hide">{goodsName}</View>
        <View className="meShopView_shopContent_user font_hide">
          <View
            className="meShopView_shopContent_profile"
            style={backgroundObj(merchantLogo)}
          ></View>
          <View className="meShopView_shopContent_username price_margin8 font_hide">
            {merchantName}
          </View>
          <View className="price_margin4">｜</View>
          <View className="meShopView_shopContent_limit price_margin4">
            {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>

        <View className="meShopView_shopContent_realPrice color1">
          <View className="font18 price_margin4">原价:</View>
          <View className="font20 text_through price_margin4 bold">
            ¥{oriPrice}
          </View>
        </View>
        <View className="meShopView_shopContent_newPrice">
          <View className="font18 price_margin4">优惠价:</View>
          <View className="font20 price_margin4 bold"> ¥{realPrice}</View>
        </View>
        <View className="meShopView_shopContent_getBean">
          卡豆抵扣后最低到手价
        </View>
        <View className="meShopView_shopContent_money">
          <View className="font20 bold">¥ </View>
          <View className="font28 bold price_margin4">
            {computedPrice(realPrice, 50)}
          </View>
        </View>
      </View>
    </View>
  );
};
