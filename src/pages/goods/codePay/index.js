import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, Input } from "@tarojs/components";
import { getReserveOrder, saveScanCodeOrder } from "@/server/goods";
import { backgroundObj, toast, objStatus } from "@/utils/utils";
import PayGo from "./components/pay_btn";
import Router from "@/utils/router";
import evens from "@/common/evens";
import BeanSelect from "@/components/public_ui/selectKol";
import { inject, observer } from "mobx-react";
import "./index.scss";
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
      useBeanStatus: "1",
      couponObj: {},
      configUserLevelInfo: {},
      payBeanCommission: 10,
    };
  }

  componentDidMount() {
    evens.$on("payCoupon", this.setCoupon.bind(this));
  }
  componentWillUnmount() {
    evens.$off("payCoupon");
  }
  componentDidShow() {
    this.regUrl();
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
  //微信扫码需要参数
  regUrl() {
    const { merchantId, q } = getCurrentInstance().router.params;
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
          this.getUserDetails();
        }
      );
    } else {
      toast("参数缺失");
    }
  }
  //解析微信扫码
  changeBean() {
    const { useBeanStatus } = this.state;
    if (useBeanStatus === "1") {
      this.setState({
        useBeanStatus: "0",
      });
    } else {
      this.setState({
        useBeanStatus: "1",
      });
    }
  }
  //选择是否使用卡豆
  setCoupon(item) {
    this.setState({
      couponObj: item,
    });
  }
  //设置优惠券
  getUserDetails() {
    getReserveOrder(
      {
        ...this.state.httpData,
      },
      (res) => {
        const { reserveOrderResult, payBeanCommission } = res;
        this.setState({
          configUserLevelInfo: { payBeanCommission },
          reserveOrderResult: {
            ...reserveOrderResult,
            ...this.state.reserveOrderResult,
          },
        });
      }
    );
  }

  saveScanCodeOrder() {
    const {
      httpData,
      httpData: { totalFee },
      couponObj: { userCouponIdString = "", couponType },
      useBeanStatus,
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { sourceKey, sourceType } = shareType;
    if (totalFee != 0) {
      saveScanCodeOrder(
        {
          ...httpData,
          userCouponObjects: userCouponIdString
            ? [
                {
                  userCouponId: userCouponIdString,
                  couponType,
                },
              ]
            : [],
          useBeanStatus,
          sourceKey,
          sourceType,
        },
        (res) => {
          const { status, orderSn, orderType, payMonth } = res;
          if (status === "0" || status === "5") {
            Router({
              routerName: "pay",
              type: "redirectTo",
              args: {
                orderType,
                orderSn,
                payMonth,
              },
            });
          } else {
            Router({
              routerName: "paySuccess",
              type: "redirectTo",
              args: {
                orderType,
                orderSn,
              },
            });
          }
        }
      );
    } else {
      toast("输入金额不能为0");
    }
  }

  render() {
    const {
      reserveOrderResult,
      configUserLevelInfo,
      reserveOrderResult: {
        merchantName,
        merchantImg,

        totalBean,
      },
      httpData: { totalFee },
      configUserLevelInfo: { payBeanCommission = 50 },
      couponObj,
      useBeanStatus,
    } = this.state;
    const { couponPrice = 0 } = couponObj;
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
    if (objStatus(reserveOrderResult)) {
      return (
        <View className="codePay_box">
          <View className="codePay_top">
            <View className="codePay_merchantDetails">
              <View
                className="codePay_merchantDetail_shopIcon merchant_dakale_logo"
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
                      couponObj: {},
                    },
                    (res) => {
                      const {
                        reserveOrderResult: { totalBean },
                      } = this.state;
                      if (value > 0) {
                        this.setState({
                          reserveOrderResult: {
                            ...reserveOrderResult,
                            totalFee: value,
                          },
                        });
                      } else {
                        this.setState({
                          reserveOrderResult: {
                            ...reserveOrderResult,
                            totalFee: 0,
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
            <BeanSelect
              type="scan"
              status={useBeanStatus}
              useScenesType="scan"
              changeBean={() => {
                this.setState({
                  useBeanStatus: useBeanStatus === "1" ? "0" : "1",
                });
              }}
              data={{
                ...reserveOrderResult,
                userBean: totalFee
                  ? computedScan(
                      totalFee,
                      couponPrice,
                      payBeanCommission / 100,
                      totalBean
                    )
                  : totalBean,
              }}
              configUserLevelInfo={configUserLevelInfo}
              couponObj={couponObj}
            ></BeanSelect>
          </View>
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
