import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import "./index.scss";
import { toast, goBack } from "@/utils/utils";
import Collection from "./components/collection";
import PayBean from "@/components/public_ui/selectToast";
import SelectBean from "@/components/public_ui/selectKol";
import BuyDesc from "./components/buyDesc";
import Submit from "./components/submit";
import { fetchOwnerCouponInfo, fakeCouponOrder } from "@/server/goods";
import { inject, observer } from "mobx-react";
import Router from "@/utils/router";
import evens from "@/common/evens";
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
      ownerCouponInfo: {},
      visible: false,
      configUserLevelInfo: {},
      couponObj: {},
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
    this.setConfigUserLevelInfo();
  }
  setConfigUserLevelInfo() {
    const { commonStore = {} } = this.props.store;
    const { preferentialGlobalDefaultList = [] } = commonStore;
    let data = preferentialGlobalDefaultList.find((item) => {
      const { identification } = item;
      return identification === "otherDefault";
    });
    this.setState({
      configUserLevelInfo: {
        payBeanCommission:
          data.preferentialActivityRuleObject.payBeanCommission,
      },
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
    fetchOwnerCouponInfo(httpData).then((val) => {
      const { ownerCouponInfo = {} } = val;
      const { reduceObject = {}, userBean, userIncomeBean } = ownerCouponInfo;

      this.setState({
        ownerCouponInfo: {
          ...ownerCouponInfo,
          ...reduceObject,
        },
      });
    });
  }
  showBean() {
    const {
      useBeanStatus,
      ownerCouponInfo: { userIncomeBean = 0, userBean = 0 },
    } = this.state;
    if (useBeanStatus === "0") {
      return "0.00";
    } else {
      return (userBean / 100).toFixed(2);
    }
  }
  saveKolGoodsOrder() {
    const {
      httpData,
      useBeanStatus,
      couponObj,
      httpData: { couponCount },
      ownerCouponInfo: { rightFlag },
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { shareUserId, shareUserType, sourceKey, sourceType } = shareType;
    const { userCouponId, couponType } = couponObj;
    fakeCouponOrder(
      {
        ...httpData,
        goodsCount: couponCount,
        useBeanStatus,
        shareUserType,
        shareUserId,
        sourceKey,
        sourceType,
        rightFlag,
        userCouponObjects: userCouponId
          ? [
              {
                userCouponId,
                couponType,
              },
            ]
          : [],
      },
      (res) => {
        const { orderSn, status, orderType } = res;
        this.setState({
          visible: false,
        });
        if (status === "1") {
          Router({
            routerName: "paySuccess",
            args: {
              orderSn,
              orderType,
            },
            type: "redirectTo",
          });
        } else {
          Router({
            routerName: "pay",
            args: {
              orderSn,
              orderType,
            },
            type: "redirectTo",
          });
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
  componentDidMount() {
    evens.$on("payCoupon", this.setCoupon.bind(this));
  }
  componentWillUnmount() {
    evens.$off("payCoupon");
  }
  computedPayPrice() {
    const {
      couponObj: { couponValue = 0 },
      ownerCouponInfo: { userBean, buyPrice, paymentModeObject, couponCount },
      useBeanStatus,
      configUserLevelInfo,
    } = this.state;
    const { payBeanCommission } = configUserLevelInfo;
    const { cash, type = "defaultMode" } = paymentModeObject;
    if (type === "defaultMode") {
      if (useBeanStatus === "1") {
        let price = Number(buyPrice) * couponCount - couponValue;
        let payBean = price * payBeanCommission;
        let removeBean = payBean >= userBean ? userBean : payBean;
        return (price - removeBean / 100).toFixed(2);
      } else {
        return (Number(buyPrice) * couponCount - couponValue).toFixed(2);
      }
    } else {
      return cash * couponCount;
    }
  }
  //底部支付价格
  saveCouponRule() {
    const { ownerCouponInfo, useBeanStatus } = this.state;
    const {
      rightFlag,
      paymentModeObject = {},
      couponCount,
      userBean,
    } = ownerCouponInfo;
    console.log(ownerCouponInfo);
    const { cash, type = "defaultMode", bean } = paymentModeObject;
    if (rightFlag === "1") {
      if (useBeanStatus === "1") {
        if (userBean < bean * couponCount) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  render() {
    const {
      ownerCouponInfo,
      visible,
      couponObj,
      ownerCouponInfo: {
        activeDays,
        delayDays,
        userBean,
        activeDate,
        endDate,
        useStartTime,
        useEndTime,
        buyPrice,
        couponCount,
      },
      useBeanStatus,
      useBeanType,
      configUserLevelInfo = {},
    } = this.state;

    if (Object.keys(ownerCouponInfo).length > 0) {
      return (
        <View className="couponOrder_box">
          <Collection
            computedCount={this.computedCount.bind(this)}
            data={ownerCouponInfo}
          ></Collection>
          {/*商品数量操作组件 */}
          <SelectBean
            configUserLevelInfo={configUserLevelInfo}
            data={{ ...ownerCouponInfo, totalFee: buyPrice * couponCount }}
            useScenesType={"goodsBuy"}
            status={useBeanStatus}
            couponObj={couponObj}
            changeBean={this.changeBean.bind(this)}
          ></SelectBean>
          <BuyDesc data={ownerCouponInfo}></BuyDesc>
          <Submit
            data={ownerCouponInfo}
            payFlag={this.saveCouponRule()}
            computedPrice={this.computedPayPrice.bind(this)}
            submit={this.saveCancel.bind(this)}
          ></Submit>
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
    } else return null;
  }
}

export default Index;
