import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { toast, goBack } from "@/utils/utils";
import { inject, observer } from "mobx-react";
import { fetchUserShareCommission } from "@/server/common";
import {
  fetchKolGoodsOrder,
  fakeGoodsOrder,
  fakeCommerceGoods,
} from "@/server/goods";
import { fetchAddressList } from "@/server/perimeter";
import Specal from "./components/template/favGoods";
import Commer from "./components/template/commerGoods";
import PayBean from "@/components/public_ui/selectToast";
import RightGoods from "./components/template/rightGoods";
import evens from "@/common/evens";
import Router from "@/utils/router";

import "./index.scss";
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
      specialGoodsInfo: {},
      configUserLevelInfo: {},
      userAddressList: [],
      userAddressIndex: -1,
      userAddress: {
        userAddressId: "",
      },
      remark: "",
      couponObj: {},
      visible: false,
    };
  }
  saveCommerceGoods() {
    const {
      useBeanStatus,
      specialGoodsInfo: { ownerIdString },
      httpData: { merchantId, specialActivityId, goodsCount },
      remark,
      userAddress,
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { shareUserId, shareUserType, sourceKey, sourceType } = shareType;
    const { userAddressId = "" } = userAddress;
    const { userCouponId, couponType } = couponObj;
    if (!userAddressId) {
      return toast("请完善收货地址");
    }
    fakeCommerceGoods({
      ownerId: ownerIdString,
      useBeanStatus,
      specialGoodsDTO: {
        id: specialActivityId,
        goodsCount,
      },
      shareUserId,
      shareUserType,
      sourceKey,
      sourceType,
      remark,
      userAddressId,
      userCouponObjects: userCouponId
        ? [
            {
              userCouponId,
              couponType,
            },
          ]
        : [],
    }).then((val) => {
      const { orderSn, status, orderType } = val;
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
    });
  }
  saveCancel() {
    const {
      specialGoodsInfo: { userBean },
      useBeanStatus,
      userAddress,
    } = this.state;
    const { userAddressId } = userAddress;
    if (userBean > 0 && useBeanStatus === "1") {
      if (!userAddressId) {
        return toast("请完善收货地址");
      }
      this.setState({
        visible: true,
      });
    } else {
      this.saveCommerceGoods();
    }
  }
  fetchKolGoodsOrder() {
    const { httpData } = this.state;
    fetchKolGoodsOrder(httpData).then((res) => {
      const { specialGoodsInfo } = res;
      const { userBean } = specialGoodsInfo;
      this.setState(
        {
          specialGoodsInfo,
          useBeanStatus: userBean > 0 ? "1" : "0",
        },
        (res) => {
          const { activityType } = specialGoodsInfo;
          if (activityType === "commerceGoods") {
            this.fetchAddress();
          }
        }
      );
    });
  }
  //获取订单详情
  componentWillUnmount() {
    evens.$off("payCoupon");
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
  //获取哒人等级
  computedCount(type) {
    const {
      httpData,
      httpData: { goodsCount },
      specialGoodsInfo,
    } = this.state;
    const { maxBuyAmount, dayMaxBuyAmount, buyRule } = specialGoodsInfo;
    if (type === "add") {
      if (buyRule !== "unlimited") {
        if (buyRule === "personLimit") {
          if (goodsCount === maxBuyAmount) {
            return toast("已超出限购限制");
          }
        } else if (buyRule === "dayLimit") {
          if (goodsCount === dayMaxBuyAmount) {
            return toast("已超出限购限制");
          }
        }
      }
      this.setState(
        {
          httpData: {
            ...httpData,
            goodsCount: goodsCount + 1,
          },
        },
        (res) => {
          this.setState({
            couponObj: {},
          });
          this.fetchKolGoodsOrder();
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
            this.setState({
              couponObj: {},
            });
            this.fetchKolGoodsOrder();
          }
        );
      } else return toast("购买数量不能为0");
    }
  }
  //当商品为特惠或者 权益商品时设置商品数量
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
  computedPayPrice() {
    const {
      couponObj: { couponValue = 0 },
      specialGoodsInfo: { userIncomeBean, userBean, realPrice },
      httpData: { goodsCount },
      useBeanStatus,
    } = this.state;
    if (useBeanStatus === "1") {
      return (
        Number(realPrice) * goodsCount -
        couponValue -
        userBean / 100
      ).toFixed(2);
    } else {
      return (Number(realPrice) * goodsCount - couponValue).toFixed(2);
    }
  }
  //底部支付价格
  fetchAddress() {
    const { userAddressIndex, userAddress } = this.state;
    const { userAddressId } = userAddress;
    fetchAddressList({}).then((val) => {
      const { userAddressList = [] } = val;
      this.setState(
        {
          userAddressList,
        },
        (res) => {
          if (userAddressList.length > 0) {
            if (userAddressIndex === -1) {
              this.setState({
                userAddressIndex: userAddressList.length > 0 ? 0 : -1,
                userAddress:
                  userAddressList.length > 0
                    ? {
                        ...userAddressList[0],
                      }
                    : { userAddressId: "" },
              });
            }
            const pages = Taro.getCurrentPages(); // 获取页面堆栈
            const currPage = pages[pages.length - 1]; // 获取上一页栈
            const { data } = currPage.data; // 获取上一页回传数据
            console.log(data);
            if (data) {
              this.setState({
                userAddress: {
                  ...userAddressList.filter((item) => {
                    return item.userAddressId === data.userAddressId;
                  })[0],
                },
                userAddressIndex: userAddressList
                  .map((val, index) => {
                    return { userAddressId: val.userAddressId, index };
                  })
                  .filter((item) => {
                    return item.userAddressId === data.userAddressId;
                  })[0].index,
              });
            }
          } else {
            this.setState({
              userAddressIndex: -1,
              userAddress: { userAddressId: "" },
            });
          }
        }
      );
    });
  }
  saveGoodsOrder() {
    const {
      useBeanStatus,
      useBeanType,
      momentId,
      specialGoodsInfo: { ownerIdString, rightFlag },
      httpData: { specialActivityId, goodsCount },
      couponObj,
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { shareUserId, shareUserType, sourceKey, sourceType } = shareType;
    const { userCouponId, couponType } = couponObj;
    fakeGoodsOrder({
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
      rightFlag,
      userCouponObjects: userCouponId
        ? [
            {
              userCouponId,
              couponType,
            },
          ]
        : [],
    }).then((res) => {
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
    });
  }
  //商品支付
  componentDidMount() {
    evens.$on("payCoupon", this.setCoupon.bind(this));
  }
  componentDidShow() {
    this.fetchUserShareCommission();
    this.fetchKolGoodsOrder();
  }

  render() {
    const {
      specialGoodsInfo,
      configUserLevelInfo,
      httpData,
      useBeanStatus,
      couponObj,
      visible,
      userAddressIndex,
      userAddress,
    } = this.state;
    let { activityType, userBean, paymentModeObject = {} } = specialGoodsInfo;
    const { type } = paymentModeObject;
    if (type === "self" && activityType !== "commerceGoods") {
      activityType = "rightGoods";
    }
    const template = {
      specialGoods: (
        <Specal
          configUserLevelInfo={configUserLevelInfo}
          data={specialGoodsInfo}
          useScenesType={"goodsBuy"}
          status={useBeanStatus}
          couponObj={couponObj}
          changeBean={this.changeBean.bind(this)}
          computedCount={this.computedCount.bind(this)}
          computedPrice={this.computedPayPrice.bind(this)}
          submit={() => {
            if (useBeanStatus === "1" && userBean > 0) {
              this.setState({
                visible: true,
              });
            } else {
              this.saveGoodsOrder();
            }
          }}
        ></Specal>
      ),
      commerceGoods: (
        <Commer
          userAddress={userAddress}
          configUserLevelInfo={configUserLevelInfo}
          userAddressIndex={userAddressIndex}
          data={specialGoodsInfo}
          useScenesType={"commerce"}
          status={useBeanStatus}
          couponObj={couponObj}
          changeBean={this.changeBean.bind(this)}
          computedCount={this.computedCount.bind(this)}
          computedPrice={this.computedPayPrice.bind(this)}
          changeLabel={(e) => {
            this.setState({
              remake: e,
            });
          }}
          submit={() => {
            this.saveCancel();
          }}
        ></Commer>
      ),
      rightGoods: (
        <RightGoods
          configUserLevelInfo={configUserLevelInfo}
          data={specialGoodsInfo}
          useScenesType={"goodsBuy"}
          status={useBeanStatus}
          couponObj={couponObj}
          changeBean={this.changeBean.bind(this)}
          computedCount={this.computedCount.bind(this)}
          computedPrice={this.computedPayPrice.bind(this)}
          submit={() => {
            this.saveGoodsOrder();
          }}
        ></RightGoods>
      ),
    }[activityType];
    return (
      <View className="favOrder_box">
        {template}
        {visible && (
          <PayBean
            cancel={() =>
              this.setState({
                visible: false,
              })
            }
            visible={visible}
            canfirm={() =>
              activityType === "commerceGoods"
                ? this.saveCommerceGoods()
                : this.saveGoodsOrder()
            }
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
