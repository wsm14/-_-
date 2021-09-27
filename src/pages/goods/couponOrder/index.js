import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import "./index.scss";
import {
  toast,
  backgroundObj,
  goBack,
  navigateTo,
  redirectTo,
  filterWeek,
} from "@/common/utils";
import PayBean from "@/components/stopBean";
import SelectBean from "@/components/componentView/selectBean";
import { inject, observer } from "mobx-react";
import { getOwnerCouponInfo, saveCouponOrder } from "@/server/goods";
import { fetchUserShareCommission } from "@/server/index";
import ButtonView from "@/components/Button";
import ShareView from "@/components/componentView/shareView";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        merchantId: getCurrentInstance().router.params.merchantId,
        couponCount: 1,
        ownerId: getCurrentInstance().router.params.ownerId,
        ownerCouponId: getCurrentInstance().router.params.ownerCouponId,
      },
      useBeanStatus: "1",
      useBeanType: "reward",
      ownerCouponInfo: {},
      visible: false,
      configUserLevelInfo: {},
    };
  }
  componentWillUnmount() {
    if (
      !getCurrentInstance().router.params.merchantId ||
      !getCurrentInstance().router.params.ownerCouponId
    ) {
      goBack(() => toast("参数缺失"));
    }
  }

  componentDidShow() {
    this.getOwnerCouponInfo();
    this.fetchUserShareCommission();
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const {
        configUserLevelInfo = {
          payBeanCommission: 50,
          shareCommission: 0,
          teamCommission: 0,
        },
      } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  computedCount(type) {
    const {
      httpData,
      httpData: { couponCount },
      ownerCouponInfo,
    } = this.state;
    if (type === "add") {
      const { maxBuyAmount, dayMaxBuyAmount, buyRule } = ownerCouponInfo;
      if (buyRule !== "unlimited") {
        if (buyRule === "personLimit") {
          if (couponCount === maxBuyAmount) {
            return toast("已超出限购限制");
          }
        } else if (buyRule === "dayLimit") {
          if (couponCount === dayMaxBuyAmount) {
            return toast("已超出限购限制");
          }
        }
      }
      this.setState(
        {
          httpData: {
            ...httpData,
            couponCount: couponCount + 1,
          },
        },
        (res) => {
          this.getOwnerCouponInfo();
        }
      );
    } else {
      if (couponCount > 1) {
        this.setState(
          {
            httpData: {
              ...httpData,
              couponCount: couponCount - 1,
            },
          },
          (res) => {
            this.getOwnerCouponInfo();
          }
        );
      } else return toast("购买数量不能为0");
    }
  }
  getOwnerCouponInfo() {
    const { httpData } = this.state;
    getOwnerCouponInfo(httpData).then((val) => {
      const { ownerCouponInfo = {} } = val;
      const { reduceObject = {}, userBean, userIncomeBean } = ownerCouponInfo;
      if (!userBean && userIncomeBean) {
        this.setState({
          ownerCouponInfo: {
            ...ownerCouponInfo,
            ...reduceObject,
          },
          useBeanType: "income",
        });
      } else {
        this.setState({
          ownerCouponInfo: {
            ...ownerCouponInfo,
            ...reduceObject,
          },
        });
      }
    });
  }
  showBean() {
    const {
      useBeanType,
      useBeanStatus,
      ownerCouponInfo: { userIncomeBean = 0, userBean = 0 },
    } = this.state;
    if (useBeanStatus === "0") {
      return "0.00";
    } else {
      if (useBeanType === "reward") {
        return (userBean / 100).toFixed(2);
      } else {
        return (userIncomeBean / 100).toFixed(2);
      }
    }
  }
  saveKolGoodsOrder() {
    const {
      httpData,
      useBeanStatus,
      useBeanType,
      httpData: { couponCount },
      ownerCouponInfo: { rightFlag },
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { shareUserId, shareUserType, sourceKey, sourceType } = shareType;
    saveCouponOrder(
      {
        ...httpData,
        goodsCount: couponCount,
        useBeanStatus,
        shareUserType,
        shareUserId,
        useBeanType,
        sourceKey,
        sourceType,
        rightFlag,
      },
      (res) => {
        const { orderSn, status, orderType } = res;
        this.setState({
          visible: false,
        });
        if (status === "1") {
          return redirectTo(
            `/pages/goods/paySuccess/index?orderSn=${orderSn}&orderType=${orderType}`
          );
        } else {
          return redirectTo(
            `/pages/goods/payWeex/index?orderSn=${orderSn}&orderType=${orderType}`
          );
        }
      }
    );
  }

  saveCancel() {
    const {
      ownerCouponInfo: { userBean },
      useBeanStatus,
    } = this.state;
    if (userBean > 0 && useBeanStatus === "1") {
      this.setState({
        visible: true,
      });
    } else {
      this.saveKolGoodsOrder();
    }
  }

  useBean(val) {
    this.setState({
      ...val,
    });
  }
  computedPrice(price, bean) {
    if (Number(bean) > price * 100) {
      return price.toFixed(2);
    } else return (Number(bean) / 100).toFixed(2);
  }
  computedPayPrice() {
    const {
      useBeanType,
      ownerCouponInfo: { userIncomeBean, userBean, buyPrice },
      httpData: { couponCount },
      useBeanStatus,
    } = this.state;
    if (useBeanStatus === "1") {
      if (useBeanType === "reward") {
        return (Number(buyPrice) * couponCount - userBean / 100).toFixed(2);
      } else {
        return (Number(buyPrice) * couponCount - userIncomeBean / 100).toFixed(
          2
        );
      }
    } else {
      return (Number(buyPrice) * couponCount).toFixed(2);
    }
  }

  render() {
    const {
      ownerCouponInfo,
      visible,
      ownerCouponInfo: {
        merchantLogo,
        merchantName,
        buyPrice,
        activeDays,
        delayDays,
        userBean,
        merchantIdString,
        activeDate,
        endDate,
        useStartTime,
        useEndTime,
        anytimeRefund,
        expireRefund,
        couponName,
        couponImg,
        thresholdPrice = "0",
        couponPrice,
        userIncomeBean,
      },
      httpData: { couponCount },
      useBeanStatus,
      useBeanType,
      configUserLevelInfo = {},
    } = this.state;
    const templateTime = () => {
      if (activeDays) {
        return `购买后${
          delayDays === 0 ? "立刻" : delayDays + "天"
        }生效，有效期${activeDays}天`;
      } else if (activeDate) {
        return `${activeDate}至${endDate}`;
      } else {
        return `${useStartTime}至${useEndTime}`;
      }
    };

    if (Object.keys(ownerCouponInfo).length > 0) {
      return (
        <View className="couponOrder_box">
          <View className="order_details_box">
            <View className="order_details_merchant">
              <View
                className="order_merchant_details"
                onClick={() =>
                  navigateTo(
                    `/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`
                  )
                }
              >
                <View
                  className="order_merchant_userProfile merchant_dakale_logo"
                  style={{ ...backgroundObj(merchantLogo) }}
                ></View>
                <View className="order_name font_hide">
                  {merchantName || ""}
                </View>
                <View className="order_merchant_go"></View>
              </View>
            </View>
            <View className="order_shopDetails">
              <View className="order_shopDetails_box">
                <View
                  className="order_shopDetails_Img coupon_big_icon"
                  style={{ ...backgroundObj(couponImg) }}
                ></View>
                <View className="order_shopDetails_dec">
                  <View className="order_shopDetails_title font_hide">
                    {couponName}
                  </View>
                  <View className="order_price">
                    面值{couponPrice}元{" "}
                    {thresholdPrice ? `｜满${thresholdPrice}元可用` : ""}
                  </View>
                  <View className="order_toast">购买数量</View>
                </View>
                <View className="order_shopDetails_price">
                  <View
                    className="order_shop_btnBox order_shop_btn1"
                    onClick={() => this.computedCount()}
                  ></View>
                  <View className="order_shop_num">{couponCount}</View>
                  <View
                    className="order_shop_btnBox order_shop_btn2"
                    onClick={() => this.computedCount("add")}
                  ></View>
                </View>
              </View>
            </View>
          </View>
          <SelectBean
            fn={this.useBean.bind(this)}
            useBeanType={useBeanType}
            data={ownerCouponInfo}
            configUserLevelInfo={configUserLevelInfo}
            useBeanStatus={useBeanStatus}
          ></SelectBean>
          <View className="order_shop_desc">
            <View className="order_shop_descBox">
              <View className="order_shop_descTitle">购买须知</View>
              <View className="order_shop_getTime font28 color2">
                使用有效期：
              </View>
              <View className="order_shop_timeDesc font28">
                <Text>{templateTime()}</Text>
              </View>
              <View className="order_shop_getTime font28 color2">使用门槛</View>
              <View className="order_shop_week color1 font28">
                {thresholdPrice !== "0" && thresholdPrice !== ""
                  ? `满${thresholdPrice}元可用`
                  : "无门槛"}
              </View>
              <View className="order_shop_getTime font28 color2">
                退款原则：
              </View>
              <View className="order_shop_week color1 font28">
                {anytimeRefund === "1" ? "支持" : "不支持"}
                随时退、{expireRefund === "1" ? "支持" : "不支持"}过期自动退
              </View>
            </View>
          </View>
          <View className="order_details_sumbit">
            <View className="order_rmb">
              实付：
              <Text style={{ fontSize: Taro.pxTransform(20) }}>
                ¥
                <Text
                  style={{ fontSize: Taro.pxTransform(32), fontWeight: "bold" }}
                >
                  {this.computedPayPrice()}
                </Text>
              </Text>
            </View>
            <View className="order_beanRmb">
              抵扣：¥
              {this.showBean()}
            </View>
            <ButtonView>
              <View className="payBtn" onClick={() => this.saveCancel()}>
                立即支付
              </View>
            </ButtonView>
          </View>
          <ShareView></ShareView>
          {visible && (
            <PayBean
              cancel={() =>
                this.setState({
                  visible: false,
                })
              }
              visible={visible}
              canfirm={() => this.saveKolGoodsOrder()}
              content={`是否确认使用${
                useBeanType === "reward" ? userBean : userIncomeBean
              }卡豆支付？`}
              canfirmText="再想想"
              cancelText="确定"
            ></PayBean>
          )}
        </View>
      );
    } else return null;
  }
}

export default Index;
