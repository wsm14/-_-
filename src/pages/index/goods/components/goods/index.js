import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { ScrollView, Text, View } from "@tarojs/components";
import InterTime from "@/components/InterTime";
import { filterPayStatus, backgroundObj, filterPayColor } from "@/common/utils";
import "./index.scss";
import { navigateTo } from "@/common/utils";
import Router from "@/common/router";

const goMerchant = (val) => {
  const { ownerType, merchantIdString, ownerIdString } = val;
  if (ownerType !== "group") {
    navigateTo(
      `/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`
    );
  } else {
    navigateTo(
      `/pages/perimeter/kaMerchantDetails/index?merchantGroupId=${ownerIdString}`
    );
  }
};
//跳转商家
const goCodeDetails = (orderSn) => {
  navigateTo(`/pages/goods/getShopGoods/index?orderSn=${orderSn}`);
};
//查看扫码详情
const goPay = (orderSn, orderType) => {
  Router({
    routerName: "pay",
    args: {
      orderSn: orderSn,
      orderType: orderType,
    },
  });
};
//支付订单

const goGoodDetails = (orderSn) => {
  Router({
    routerName: "kolShopGoods",
    args: {
      orderSn: orderSn,
    },
  });
};
//查看订单详情
const goSpeGoods = (descDate, orderType) => {
  const {
    specialGoods = {},
    reduceCoupon = {},
    merchantIdString,
    ownerIdString,
    ownerCouponIdString,
  } = descDate;
  const { activityIdString } = specialGoods;
  if (orderType === "specialGoods") {
    Router({
      routerName: "favourableDetails",
      args: {
        merchantId: merchantIdString,
        specialActivityId: activityIdString,
      },
    });
  } else {
    Router({
      routerName: "payCouponDetails",
      args: {
        merchantId: merchantIdString,
        ownerId: ownerIdString,
        ownerCouponId: ownerCouponIdString,
      },
    });
  }
};
//再次Spe下单

export default (props) => {
  const { list, pageDown } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(list);
  }, [list]);
  const createShopTop = (item, merchant) => {
    const { status, orderType, closeType } = item;
    return (
      <View
        className="createGood_title"
        onClick={(e) => {
          e.stopPropagation();
          goMerchant(merchant);
        }}
      >
        <View className="createGood_title_box">
          {orderType === "specialGoods" ? (
            <View className="createGood_iconBox createGood_bg2">商品</View>
          ) : (
            <View className="createGood_iconCoupon"></View>
          )}
          <View className="createGood_merchantName font_hide">
            {merchant.merchantName}
          </View>
          <View className="createGood_merchantgo"></View>
          <View
            className={classNames("createGood_status", filterPayColor(status))}
          >
            {filterPayStatus(status, closeType)}
          </View>
        </View>
      </View>
    );
  };
  //头部
  const updateStatus = (item) => {
    setData(
      data.map((val) => {
        if (val.orderSn === item.orderSn) {
          val.status = "2";
        }
        return val;
      })
    );
  };

  const createBottom = (item) => {
    let { status, createTime, orderSn, orderDesc, orderType } = item;
    orderDesc = (orderDesc && JSON.parse(orderDesc)) || {};
    return {
      0: (
        <View className="createGood_bottom">
          <View className="createGood_btn_style">
            <View className="createGood_btn_left">
              待付款：
              <Text style={{ color: "rgba(51, 51, 51, 1)" }}>
                {
                  <InterTime
                    fn={() => updateStatus(item)}
                    times={createTime}
                  ></InterTime>
                }
              </Text>
            </View>
            <View
              className="createGood_btn_right createGood_btn_color1"
              onClick={() => goPay(orderSn, orderType)}
            >
              去付款
            </View>
          </View>
        </View>
      ),
      1: (
        <View className="createGood_bottom">
          <View className="createGood_btn_style">
            <View className="createGood_btn_left"></View>
            <View
              className="createGood_btn_right createGood_btn_color1"
              onClick={() => goGoodDetails(orderSn)}
            >
              去使用
            </View>
          </View>
        </View>
      ),
      2: (
        <View className="createGood_bottom">
          <View className="createGood_btn_style">
            <View className="createGood_btn_left"></View>
            <View
              className="createGood_btn_right createGood_btn_color1"
              onClick={() => goSpeGoods(orderDesc, orderType)}
            >
              重新购买
            </View>
          </View>
        </View>
      ),
      3: (
        <View className="createGood_bottom">
          <View className="createGood_btn_style">
            <View className="createGood_btn_left">
              {/*待付款：<Text style={{color: 'rgba(51, 51, 51, 1)'}}>13 : 23</Text>*/}
            </View>
            <View
              className="createGood_btn_right createGood_btn_color1"
              onClick={() => goSpeGoods(orderDesc, orderType)}
            >
              再次购买
            </View>
          </View>
        </View>
      ),
      6: (
        <View className="createGood_bottom">
          <View className="createGood_btn_style">
            <View className="createGood_btn_left">
              {/*待付款：<Text style={{color: 'rgba(51, 51, 51, 1)'}}>13 : 23</Text>*/}
            </View>
            <View
              className="createGood_btn_right createGood_btn_color2"
              onClick={() => goGoodDetails(orderSn)}
            >
              查看
            </View>
          </View>
        </View>
      ),
    }[status];
  };
  //按钮

  const createCodeGoods = (item) => {
    let { payFee, orderDesc, orderSn, createTime } = item;
    orderDesc = JSON.parse(orderDesc) || {};
    const { merchantName, merchantImg, merchantId, merchantIdString } =
      orderDesc;
    return (
      <View className="createGood_box">
        <View
          className="createGood_title"
          onClick={(e) => {
            e.stopPropagation();
            goMerchant(orderDesc);
          }}
        >
          <View className="createGood_title_box">
            <View className="createGood_iconBox createGood_bg1">扫码</View>
            <View className="createGood_merchantName font_hide">
              {merchantName}
            </View>
            <View className="createGood_merchantgo"></View>
            <View className="createGood_status status_color1">已完成</View>
          </View>
        </View>
        <View
          className="createGood_content"
          onClick={() => goCodeDetails(orderSn)}
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image dakale_nullImage"
              style={merchantImg ? backgroundObj(merchantImg) : {}}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title font_noHide">
                {merchantName}
              </View>
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥</Text>
              <Text className="createdGood_details_priceFont2">
                {" " + payFee.split(".")[0]}
              </Text>
              <Text className="createdGood_details_priceFont3">
                {payFee.split(".")[1] && `.${payFee.split(".")[1]}`}
              </Text>
            </View>
          </View>
          <View className="createdGood_details_timeBox">
            <View className="time_color1">支付时间：{createTime}</View>
            {/*<View className='createdGood_time_look'>*/}
            {/*  查看*/}
            {/*  <View className='createdGood_time_lookIcon'></View>*/}
            {/*</View>*/}
          </View>
        </View>
      </View>
    );
  };
  //扫码支付渲染模板
  const createShopGoods = (item) => {
    let { payFee, orderDesc = "", orderSn, orderType } = item;
    orderDesc = orderDesc && JSON.parse(orderDesc);
    const { specialGoods = {}, reduceCoupon = {} } = orderDesc;
    orderDesc = {
      ...orderDesc,
      ...specialGoods,
      ...reduceCoupon,
    };
    const {
      goodsImg,
      goodsName,
      goodsCount,
      useEndTime,
      couponPrice,
      buyPrice,
      thresholdPrice,
    } = orderDesc;
    const orderTypeObj = {
      specialGoods: (
        <View
          className="createGood_content"
          onClick={() => goGoodDetails(orderSn)}
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image dakale_nullImage"
              style={{ ...backgroundObj(goodsImg) }}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title font_hide">
                {goodsName}
              </View>
              <View className="createdGood_details_num">数量:{goodsCount}</View>
              <View className="createdGood_details_date">
                有效期至：{useEndTime}
              </View>
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥ </Text>
              <Text className="createdGood_details_priceFont2">{payFee}</Text>
            </View>
          </View>
        </View>
      ),
      reduceCoupon: (
        <View
          className="createGood_content"
          onClick={() => goGoodDetails(orderSn)}
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image coupon_big_icon"
              style={{ ...backgroundObj(goodsImg) }}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title font_hide">
                {goodsName}
              </View>
              <View className="createdGood_details_num">
                面值{couponPrice} |{" "}
                {!thresholdPrice ? "无门槛" : `满${thresholdPrice}元可用`} |
                数量:
                {goodsCount}
              </View>
              <View className="createdGood_details_date">
                有效期至：{useEndTime}
              </View>
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥ </Text>
              <Text className="createdGood_details_priceFont2">{payFee}</Text>
            </View>
          </View>
        </View>
      ),
    }[orderType];
    return (
      <View className="createGood_box" key={item.payFee}>
        {createShopTop(item, orderDesc)}
        {orderTypeObj}
        {createBottom(item)}
      </View>
    );
  };

  //订单支付渲染模板
  return (
    <ScrollView
      scrollY
      onScrollToLower={() => pageDown()}
      className="goodsView"
    >
      {data.map((item) => {
        const { orderType } = item;
        if (orderType === "reduceCoupon" || orderType === "specialGoods") {
          return createShopGoods(item);
        } else if (orderType === "scan") {
          return createCodeGoods(item);
        }
      })}
    </ScrollView>
  );
};
