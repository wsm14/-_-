import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { goods } from "@/api/api";
import { httpGet, httpPost } from "@/api/newRequest";
import "./index.scss";
import {
  toast,
  backgroundObj,
  filterActive,
  goBack,
  navigateTo,
  redirectTo,
  filterStrList,
  filterWeek,
} from "@/common/utils";
import PayBean from "@/components/stopBean";
import classNames from "classnames";
import { inject, observer } from "mobx-react";
import ButtonView from "@/components/Button";
import Router from "@/common/router";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      merchantId: getCurrentInstance().router.params.merchantId,
      useBeanStatus: "1",
      specialGoodsDTO: {
        id: getCurrentInstance().router.params.specialActivityId,
        goodsCount: 1,
      },
      specialGoodsInfo: {},
      visible: false,
    };
  }
  componentWillUnmount() {
    if (
      !getCurrentInstance().router.params.merchantId ||
      !getCurrentInstance().router.params.specialActivityId
    ) {
      goBack(() => toast("参数缺失"));
    }
  }

  componentDidShow() {
    this.getKolGoodsOrder();
  }
  computedCount(type) {
    const {
      specialGoodsDTO,
      specialGoodsDTO: { goodsCount },
    } = this.state;
    if (type === "add") {
      this.setState({
        specialGoodsDTO: {
          ...specialGoodsDTO,
          goodsCount: goodsCount + 1,
        },
      });
    } else {
      if (goodsCount > 1) {
        this.setState({
          specialGoodsDTO: {
            ...specialGoodsDTO,
            goodsCount: goodsCount - 1,
          },
        });
      } else return toast("购买数量不能为0");
    }
  }

  getKolGoodsOrder() {
    const { httpData } = this.state;
    const {
      favourOrder: { getSpecialGoods },
    } = goods;
    httpGet(
      {
        data: httpData || {},
        url: getSpecialGoods,
      },
      (res) => {
        const { specialGoodsInfo } = res;
        this.setState({
          specialGoodsInfo,
        });
      }
    );
  }

  saveKolGoodsOrder() {
    const { merchantId, useBeanStatus, specialGoodsDTO } = this.state;
    const { shareType } = this.props.store.authStore;
    const {
      favourOrder: { saveSpecialGoods },
    } = goods;
    httpPost(
      {
        data: {
          merchantId: merchantId,
          useBeanStatus: useBeanStatus,
          specialGoodsDTO,
          ...shareType,
        },
        url: saveSpecialGoods,
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
      specialGoodsInfo: { userBean },
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

  useBean() {
    const {
      specialGoodsInfo: { userBean },
      useBeanStatus,
    } = this.state;
    if (userBean == "0") {
      return toast("卡豆为0");
    } else {
      if (useBeanStatus === "0") {
        return this.setState({
          useBeanStatus: "1",
        });
      } else {
        return this.setState({
          useBeanStatus: "0",
        });
      }
    }
  }
  computedPrice(price, bean) {
    if (Number(bean) > price * 100) {
      return price.toFixed(2);
    } else return (Number(bean) / 100).toFixed(2);
  }

  render() {
    const {
      specialGoodsInfo,
      visible,
      specialGoodsInfo: {
        merchantLogo,
        merchantName,
        goodsImg,
        goodsName,
        realPrice,
        needOrder,
        allowExpireRefund,
        allowRefund,
        useStartTime,
        useEndTime,
        useTime,
        userBean,
        merchantIdString,
        telephone,
        useWeek,
        activeDays,
        delayDays,
        activityTimeRule,
      },
      specialGoodsDTO: { goodsCount },
      useBeanStatus,
    } = this.state;
    const templateTime = () => {
      if (activeDays) {
        return `购买后${
          delayDays === 0 ? "立刻" : delayDays
        }天生效，有效期${activeDays}天，请在有效期内使用`;
      } else {
        return `${useStartTime}至${useEndTime}`;
      }
    };
    return (
      <View className="favOrder_box">
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
                className="order_merchant_userProfile dakale_profile"
                style={{ ...backgroundObj(merchantLogo) }}
              ></View>
              <View className="order_name font_hide">{merchantName || ""}</View>
              <View className="order_merchant_go"></View>
            </View>
          </View>
          <View className="order_shopDetails">
            <View className="order_shopDetails_box">
              <View
                className="order_shopDetails_Img dakale_nullImage"
                style={{ ...backgroundObj(goodsImg) }}
              ></View>
              <View className="order_shopDetails_dec">
                <View className="order_shopDetails_title font_hide">
                  {goodsName}
                </View>
                <View className="order_price">
                  <Text
                    className="font20"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    ¥
                  </Text>
                  {" " + realPrice}
                </View>
                <View className="order_toast">购买数量</View>
              </View>
              <View className="order_shopDetails_price">
                <View
                  className="order_shop_btnBox order_shop_btn1"
                  onClick={() => this.computedCount()}
                ></View>
                <View className="order_shop_num">{goodsCount}</View>
                <View
                  className="order_shop_btnBox order_shop_btn2"
                  onClick={() => this.computedCount("add")}
                ></View>
              </View>
            </View>
          </View>
        </View>
        {userBean ? (
          <View
            className="order_details_payType"
            onClick={() => this.useBean()}
          >
            <View className="order_payType_box">
              <View className="order_payType_top">
                卡豆优惠抵扣
                <View
                  className="order_payType_question"
                  onClick={(e) => {
                    e.stopPropagation();
                    Router({
                      routerName: "interests",
                    });
                  }}
                ></View>
              </View>
              <View className="order_pay_font">
                可用{userBean}卡豆抵扣卡豆{parseInt(userBean) / 100}元
              </View>
              <View
                className={classNames(
                  "order_pay_iconBox",
                  useBeanStatus === "1" ? "order_pay_icon2" : "order_pay_icon1"
                )}
              ></View>
            </View>
          </View>
        ) : null}

        <View className="order_shop_desc">
          <View className="order_shop_descBox">
            <View className="order_shop_descTitle">购买须知</View>
            <View className="order_shop_getTime font28 color2">
              使用有效期：
            </View>
            <View className="order_shop_timeDesc font28">
              <Text>{templateTime()}</Text>
              <Text className="color1">
                {needOrder === "0" ? " | 免预约" : " | 需要预约"}
              </Text>
            </View>
            <View className="order_shop_getTime font28 color2">
              到店核销时段：
            </View>
            <View className="order_shop_week color1 font28">
              {filterWeek(useWeek)}
              {"  " + useTime}
            </View>
            <View className="order_shop_getTime font28 color2">退款原则：</View>
            <View className="order_shop_week color1 font28">
              {allowExpireRefund === "1" ? "支持" : "不支持"}
              随时退、{allowRefund === "1" ? "支持" : "不支持"}过期自动退
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
                {useBeanStatus === "1"
                  ? Number(realPrice) * goodsCount - userBean / 100 > 0
                    ? (Number(realPrice) * goodsCount - userBean / 100).toFixed(
                        2
                      )
                    : 0
                  : (Number(realPrice) * goodsCount).toFixed(2)}
              </Text>
            </Text>
          </View>
          <View className="order_beanRmb">
            抵扣：¥
            {useBeanStatus === "1"
              ? this.computedPrice(Number(realPrice) * goodsCount, userBean)
              : "0"}
          </View>
          <ButtonView>
            <View className="payBtn" onClick={() => this.saveCancel()}>
              立即支付
            </View>
          </ButtonView>
        </View>
        {visible && (
          <PayBean
            cancel={() =>
              this.setState({
                visible: false,
              })
            }
            visible={visible}
            canfirm={() => this.saveKolGoodsOrder()}
            content={`是否确认使用${userBean}卡豆支付？`}
            canfirmText="再想想"
            cancelText="确定"
          ></PayBean>
        )}
      </View>
    );
  }
}

export default Index;
