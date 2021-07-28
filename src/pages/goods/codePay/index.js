import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, Input } from "@tarojs/components";
import PayGo from "@/components/pay_btn";
import { getReserveOrder, saveScanCodeOrder } from "@/server/goods";
import { backgroundObj, toast, redirectTo } from "@/common/utils";
import { fetchUserShareCommission } from "@/server/index";
import SelectBean from "@/components/componentView/selectBean";
import Evens from "@/common/evens";
import Router from "@/common/router";
import ShareView from "@/components/componentView/shareView";
import { inject, observer } from "mobx-react";
import "./index.scss";
const computedScan = (value, couponPrice, scale, bean) => {
  let setBean = (Number(value) - Number(couponPrice)) * 100 * scale;
  if (Number(value) - Number(couponPrice) > 0) {
    if (setBean > 0) {
      if (setBean > bean) {
        return bean;
      } else return setBean.toFixed(2);
    } else {
      return "0";
    }
  } else {
    return "0";
  }
};
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      reserveOrderResult: {},
      httpData: {
        merchantId: getCurrentInstance().router.params.merchantId || "",
        totalFee: 0,
      },
      useBeanType: "reward",
      useBeanStatus: "1",
      couponObj: {},
      configUserLevelInfo: {},
    };
  }

  componentDidMount() {
    // console.log(getCurrentInstance().router.params, this.state.merchantId);
    Evens.$on("payCode", this.payCode.bind(this));
  }

  componentDidShow() {
    this.regUrl();
    this.fetchUserShareCommission();
  }

  getUrlKey(key, name) {
    // 获取参数
    var url = decodeURIComponent(key);
    // 正则筛选地
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
  }
  regUrl() {
    const { merchantId, q } = getCurrentInstance().router.params;
    console.log(q, this.getUrlKey(q, "merchantId"));
    if (merchantId) {
      this.getUserDetails();
    } else if (q) {
      this.setState(
        {
          httpData: {
            ...this.state.httpData,
            merchantId: this.getUrlKey(q, "merchantId"),
          },
        },
        (res) => {
          console.log();
          this.getUserDetails();
        }
      );
    } else {
      toast("参数缺失");
    }
  }
  payCode(obj) {
    this.setState(
      {
        couponObj: obj,
      },
      (res) => {
        const {
          reserveOrderResult: { userRewardBean, userIncomeBean },
          reserveOrderResult,
          configUserLevelInfo: { payBeanCommission },
          couponObj: { couponPrice = 0 },
          httpData: { totalFee },
        } = this.state;
        console.log(totalFee);
        if (totalFee > 0) {
          this.setState({
            reserveOrderResult: {
              ...reserveOrderResult,
              userBean: computedScan(
                totalFee,
                couponPrice,
                payBeanCommission / 100,
                userRewardBean
              ),
              userIncomeBean: computedScan(
                totalFee,
                couponPrice,
                payBeanCommission / 100,
                userIncomeBean
              ),
            },
          });
        } else {
          this.setState({
            reserveOrderResult: {
              ...reserveOrderResult,
              userBean: userRewardBean,
              userIncomeBean: userIncomeBean,
            },
          });
        }
      }
    );
  }
  useBean(val) {
    this.setState({
      ...val,
    });
  }
  getUserDetails() {
    getReserveOrder(
      {
        ...this.state.httpData,
      },
      (res) => {
        const {
          reserveOrderResult,
          reserveOrderResult: { userRewardBean },
        } = res;
        this.setState({
          reserveOrderResult: {
            ...reserveOrderResult,
            userBean: userRewardBean,
          },
        });
      }
    );
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  saveScanCodeOrder() {
    const {
      httpData,
      httpData: { totalFee },
      couponObj: { userCouponIdString = "" },
      useBeanType,
      useBeanStatus,
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { sourceKey, sourceType } = shareType;
    if (totalFee != 0) {
      saveScanCodeOrder(
        {
          ...httpData,
          userCouponId: userCouponIdString,
          useBeanType,
          useBeanStatus,
          sourceKey,
          sourceType,
        },
        (res) => {
          const { status, orderSn, orderType, payMonth } = res;
          if (status === "0" || status === "5") {
            redirectTo(
              `/pages/goods/code_wx_pay/index?payMonth=${payMonth}&orderType=${orderType}&orderSn=${orderSn}&merchantId=${
                getCurrentInstance().router.params.merchantId
              }`
            );
          } else {
            redirectTo(
              `/pages/goods/code_scanPay_Susccess/index?orderSn=${orderSn}&merchantId=${
                getCurrentInstance().router.params.merchantId
              }`
            );
          }
        }
      );
    } else {
      toast("输入金额不能为0");
    }
  }
  errorToast(e) {}

  render() {
    const {
      reserveOrderResult,
      configUserLevelInfo,
      configUserLevelInfo: { payBeanCommission = 50 },
      useBeanStatus,
      useBeanType,
      reserveOrderResult: {
        merchantName,
        merchantImg,
        availableCouponCount,
        computedBean,
        computedIconBean,
        userIncomeBean,
        userRewardBean,
      },
      httpData: { totalFee },
      couponObj: { couponPrice = 0, userCouponIdString },
    } = this.state;
    if (Object.keys(reserveOrderResult).length > 0) {
      return (
        <View className="codePay_box">
          <View className="codePay_top">
            <View className="codePay_merchantDetails">
              <View
                className="codePay_merchantDetail_shopIcon dakale_nullImage"
                style={merchantImg ? backgroundObj(merchantImg) : {}}
              ></View>
              <View className="codePay_merchantDetail_font">
                <View className="codePay_merchantDetail_title font_hide">
                  {merchantName || "--"}
                </View>
                <View className="codePay_merchantDetail_tishi">
                  请核实商户信息后进行付款
                </View>
              </View>
            </View>
            <View className="codePay_mount">金额</View>
            <View className="codePay_inputBox">
              <Text className="codePay_mountAfter color1 font28">¥</Text>
              <Input
                onInput={(e) => {
                  const { value } = e.detail;
                  this.setState(
                    {
                      httpData: {
                        ...this.state.httpData,
                        totalFee: value,
                      },
                    },
                    (res) => {
                      const {
                        reserveOrderResult: { userRewardBean, userIncomeBean },
                      } = this.state;
                      if (value > 0) {
                        this.setState(
                          {
                            reserveOrderResult: {
                              ...reserveOrderResult,
                              computedBean: computedScan(
                                value,
                                couponPrice,
                                payBeanCommission / 100,
                                userRewardBean
                              ),
                              computedIconBean: computedScan(
                                value,
                                couponPrice,
                                payBeanCommission / 100,
                                userIncomeBean
                              ),
                            },
                          },
                          (res) => {
                            console.log(this.state);
                          }
                        );
                      } else {
                        this.setState({
                          reserveOrderResult: {
                            ...reserveOrderResult,
                            computedBean: userRewardBean,
                            computedIconBean: userIncomeBean,
                          },
                        });
                      }
                    }
                  );
                }}
                type={"digit"}
                className="codePay_inputStyle"
              ></Input>
            </View>
            <View className="codePay_inputLiner"></View>
          </View>
          <View className="codePay_orderBox">
            {parseInt(availableCouponCount) !== 0 && (
              <>
                <View
                  onClick={() => {
                    if (totalFee !== 0) {
                      Router({
                        routerName: "coupon",
                        args: {
                          merchantId:
                            getCurrentInstance().router.params.merchantId,
                          total: totalFee,
                          couponId: userCouponIdString,
                        },
                      });
                    } else {
                      toast("请输入金额后选择优惠券");
                    }
                  }}
                  className="codePay_coupon"
                >
                  <View className="codePay_coupon_box public_auto">
                    <View className="codePay_coupon_left">
                      <View className="codePay_coupon_icon"></View>
                      <View className="codePay_coupon_font1">优惠券</View>
                    </View>
                    <View className="codePay_coupon_right">
                      {couponPrice ? (
                        <View
                          style={{ color: "#EF476F" }}
                          className="codePay_coupon_font2 color3"
                        >
                          {couponPrice}元抵扣券
                        </View>
                      ) : (
                        <View className="codePay_coupon_font2">请选择</View>
                      )}

                      <View className="codePay_coupon_iconGo"></View>
                    </View>
                  </View>
                </View>
                <View className="codePay_liner"></View>
              </>
            )}

            <SelectBean
              fn={this.useBean.bind(this)}
              useBeanType={useBeanType}
              data={{
                ...reserveOrderResult,
                userBean: computedBean || userRewardBean,
                userIncomeBean: computedIconBean || userIncomeBean,
              }}
              configUserLevelInfo={configUserLevelInfo}
              useBeanStatus={useBeanStatus}
              payType={"scan"}
            ></SelectBean>
          </View>
          <ShareView></ShareView>
          <PayGo
            content={"确认支付"}
            click={() => this.saveScanCodeOrder()}
          ></PayGo>
        </View>
      );
    } else {
      return null;
    }
  }
}

export default Index;
