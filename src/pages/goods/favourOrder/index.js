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
import { fetchUserShareCommission } from "@/server/index";
import SelectBean from "@/components/componentView/selectBean";
import ShareView from "@/components/componentView/shareView";
import Router from "@/common/router";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        merchantId: getCurrentInstance().router.params.merchantId,
        specialActivityId: getCurrentInstance().router.params.specialActivityId,
        goodsCount: 1,
      },
      useBeanStatus: "1",
      useBeanType: "reward",
      momentId: getCurrentInstance().router.params.momentId,
      specialGoodsInfo: {},
      configUserLevelInfo: {},
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
      httpData: { goodsCount },
    } = this.state;
    if (type === "add") {
      this.setState(
        {
          httpData: {
            ...httpData,
            goodsCount: goodsCount + 1,
          },
        },
        (res) => {
          this.getKolGoodsOrder();
        }
      );
    } else {
      if (goodsCount > 1) {
        this.setState(
          {
            httpData: {
              ...httpData,
              goodsCount: goodsCount - 1,
            },
          },
          (res) => {
            this.getKolGoodsOrder();
          }
        );
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
        const {
          specialGoodsInfo,
          specialGoodsInfo: { userBean, userIncomeBean },
        } = res;
        if (!userBean && userIncomeBean) {
          this.setState({
            specialGoodsInfo,
            useBeanType: "income",
          });
        } else {
          this.setState({
            specialGoodsInfo,
          });
        }
      }
    );
  }
  showBean() {
    const {
      useBeanType,
      useBeanStatus,
      specialGoodsInfo: { userIncomeBean = 0, userBean = 0 },
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
      useBeanStatus,
      useBeanType,
      momentId,
      specialGoodsInfo: { ownerIdString },
      httpData: { merchantId, specialActivityId, goodsCount },
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { shareUserId, shareUserType, sourceKey, sourceType } = shareType;
    const {
      favourOrder: { saveSpecialGoods },
    } = goods;
    httpPost(
      {
        data: {
          ownerId: ownerIdString,
          useBeanStatus,
          useBeanType,
          momentId,
          specialGoodsDTO: {
            id: specialActivityId,
            goodsCount,
          },
          shareUserId,
          shareUserType,
          sourceKey,
          sourceType,
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
      specialGoodsInfo: { userIncomeBean, userBean, realPrice },
      httpData: { goodsCount },
      useBeanStatus,
    } = this.state;
    if (useBeanStatus === "1") {
      if (useBeanType === "reward") {
        return (Number(realPrice) * goodsCount - userBean / 100).toFixed(2);
      } else {
        return (Number(realPrice) * goodsCount - userIncomeBean / 100).toFixed(
          2
        );
      }
    } else {
      return (Number(realPrice) * goodsCount).toFixed(2);
    }
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
        userIncomeBean,
      },
      httpData: { goodsCount },
      useBeanType,
      useBeanStatus,
      configUserLevelInfo,
    } = this.state;
    const templateTime = () => {
      if (activeDays) {
        return `购买后${
          delayDays === 0 ? "立刻" : delayDays + "天"
        }生效，有效期${activeDays}天`;
      } else {
        return `${useStartTime}至${useEndTime}`;
      }
    };
    if (Object.keys(specialGoodsInfo).length > 0) {
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
                  className="order_merchant_userProfile dakale_profile merchant_dakale_logo"
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
          <SelectBean
            fn={this.useBean.bind(this)}
            useBeanType={useBeanType}
            data={specialGoodsInfo}
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
              <View className="order_shop_getTime font28 color2">
                退款原则：
              </View>
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
                  {this.computedPayPrice()}
                </Text>
              </Text>
            </View>
            <View className="order_beanRmb">
              抵扣：¥
              {this.showBean()}
            </View>
            <ButtonView
              data={{
                path: "pages/goods/favourOrder/index",
                type: "favourOrder_pay",
                name: "商品订单支付",
              }}
            >
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
    } else {
      return null;
    }
  }
}

export default Index;
