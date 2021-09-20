import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { goods } from "@/api/api";
import { httpGet, httpPost } from "@/api/newRequest";
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
import { fetchProductOrderPrice, fakeVirtual } from "@/server/perimeter";
import { fetchUserShareCommission } from "@/server/index";
import SelectBean from "@/components/componentView/selectBean";
import ShareView from "@/components/componentView/shareView";
import Router from "@/common/router";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        phoneMoney: getCurrentInstance().router.params.phoneMoney,
      },
      useBeanStatus: "1",
      useBeanType: "reward",
      virtualProductAccount: getCurrentInstance().router.params.telephone,
      totalFee: getCurrentInstance().router.params.phoneMoney,
      virtualProductType: "phoneBill",
      goodsCount: 1,
      configUserLevelInfo: {},
      phoneBillInfo: {},
      visible: false,
    };
  }
  componentWillUnmount() {
    if (
      !getCurrentInstance().router.params.totalFee ||
      !getCurrentInstance().router.params.telephone
    ) {
      goBack(() => toast("参数缺失"));
    }
  }

  componentDidShow() {
    this.fetchProductOrder();
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
  fetchProductOrder() {
    const { httpData } = this.state;
    fetchProductOrderPrice(httpData).then((val) => {
      const { phoneBillInfo = {} } = val;
      this.setState({
        phoneBillInfo,
      });
    });
  }
  showBean() {
    const {
      useBeanType,
      useBeanStatus,
      phoneBillInfo: { userIncomeBean = 0, userBean = 0 },
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
      virtualProductAccount,
      totalFee,
      virtualProductType,
      goodsCount,
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { shareUserId, shareUserType, sourceKey, sourceType } = shareType;
    fakeVirtual({
      useBeanStatus,
      useBeanType,
      virtualProductAccount,
      totalFee,
      virtualProductType,
      goodsCount,
      shareUserId,
      shareUserType,
      sourceKey,
      sourceType,
    }).then((val) => {
      const { status, orderSn, orderType, payMonth } = val;
      if (status === "0" || status === "5") {
        return redirectTo(
          `/pages/goods/code_wx_pay/index?orderSn=${orderSn}&orderType=${orderType}&payMonth=${payMonth}`
        );
      } else {
        return redirectTo(
          `/pages/goods/code_wx_pay/index?orderSn=${orderSn}&orderType=${orderType}`
        );
      }
    });
  }

  saveCancel() {
    const {
      phoneBillInfo: { userBean },
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
      goodsCount,
      phoneBillInfo: { userIncomeBean, userBean, totalFee },
      useBeanStatus,
    } = this.state;
    if (useBeanStatus === "1") {
      if (useBeanType === "reward") {
        return (Number(totalFee) * goodsCount - userBean / 100).toFixed(2);
      } else {
        return (Number(totalFee) * goodsCount - userIncomeBean / 100).toFixed(
          2
        );
      }
    } else {
      return (Number(totalFee) * goodsCount).toFixed(2);
    }
  }

  render() {
    const {
      configUserLevelInfo,
      useBeanType,
      useBeanStatus,
      phoneBillInfo,
      visible,
      goodsCount,
      phoneBillInfo: { userBean = "", userIncomeBean = "", totalFee },
    } = this.state;

    return (
      <View className="rechangeOrder_box">
        <View className="order_details_box">
          <View className="order_shopDetails">
            <View className="order_shopDetails_box">
              <View className="order_shopDetails_Img"></View>
              <View className="order_shopDetails_dec">
                <View className="order_shopDetails_title font_hide">
                  话费充值{totalFee}元
                </View>
                <View className="order_price">
                  <Text
                    className="font20"
                    style={{ color: "rgba(51, 51, 51, 1)" }}
                  >
                    ¥
                  </Text>
                  {" " + totalFee}
                </View>
              </View>
            </View>
          </View>
        </View>

        <SelectBean
          fn={this.useBean.bind(this)}
          useBeanType={useBeanType}
          data={phoneBillInfo}
          configUserLevelInfo={configUserLevelInfo}
          useBeanStatus={useBeanStatus}
        ></SelectBean>
        <View className="order_shop_desc">
          <View className="order_shop_descBox">
            <View className="order_shop_descTitle">购买须知</View>
            <View className="order_shop_week">
              1. 同一手机号每个自然月最多可享受1次卡豆充值话费；
            </View>
            <View className="order_shop_week">
              2.
              此产品为卡豆特价，充值话费在用户支付完成后预计3小时内到账。具体以手机号归属地运营商返回的充值结果为准；
            </View>
            <View className="order_shop_week">
              3. 支付完成后，用户不能取消订单；
            </View>
            <View className="order_shop_week">
              4.
              通信状态异常的号码（包括但不限于欠费、停机）可能无法充值成功；若充值失败，用户支付的款项将原路退回。
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
  }
}

export default Index;
