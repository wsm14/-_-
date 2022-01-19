import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { toast } from "@/utils/utils";
import { inject, observer } from "mobx-react";
import {
  fetchPhoneBillDetail,
  fetchMemberOrderSumbit,
  fetchUserShareCommission,
  fetchRechargeMemberLsxdDetail,
} from "@/server/common";
import {
  fetchKolGoodsOrder,
  fakeGoodsOrder,
  fakeCommerceGoods,
} from "@/server/goods";
import {
  fetchAddressList,
  fetchGiftPackPricePay,
  fetchGetGiftPackPriceDetail,
} from "@/server/perimeter";
import Specal from "./components/template/favGoods";
import Commer from "./components/template/commerGoods";
import Recharge from "./components/template/recharge";
import PayBean from "@/components/public_ui/selectToast";
import RightGoods from "./components/template/rightGoods";
import BeanGiftPack from "./components/template/beanGiftPack";
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

  //商品支付
  componentDidMount() {
    evens.$on("payCoupon", this.setCoupon.bind(this));
  }
  componentDidShow() {
    const { mode } = getCurrentInstance().router.params;
    // 充值会员获取详情接口 防止和其他杂糅
    if (mode === "member") {
      this.fetchRechargeMemberLsxdDetail();
      return;
    }
    // 话费充值详情获取
    if (mode === "phoneBill") {
      this.fetchPhoneBillDetail();
      return;
    }
    // 话费券/礼包进入
    if (mode === "beanGiftPack") {
      this.fetchGetGiftPackPriceDetail();
      return;
    }
    this.fetchUserShareCommission();
    this.fetchKolGoodsOrder();
  }
  //获取订单详情
  componentWillUnmount() {
    evens.$off("payCoupon");
  }

  saveCommerceGoods() {
    const {
      useBeanStatus,
      specialGoodsInfo: { ownerIdString },
      httpData: { merchantId, specialActivityId, goodsCount },
      remark,
      userAddress,
      couponObj,
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
      configUserLevelInfo,
    } = this.state;
    const { payBeanCommission } = configUserLevelInfo;
    if (useBeanStatus === "1") {
      let price = Number(realPrice) * goodsCount - couponValue;
      let payBean = price * payBeanCommission;
      let removeBean = payBean >= userBean ? userBean : payBean;
      return (price - removeBean / 100).toFixed(2);
    } else {
      return (Number(realPrice) * goodsCount - couponValue).toFixed(2);
    }
  }
  //底部支付价格

  computedNotUserLevelPayPrice() {
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
  // 无哒人抵扣逻辑支付计算

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

  // 获取会员充值详情
  fetchRechargeMemberLsxdDetail() {
    const { productNo, virtualProductAccount } =
      getCurrentInstance().router.params;
    fetchRechargeMemberLsxdDetail({
      productNo,
      goodsCount: 1,
      virtualProductAccount,
    }).then((res) => {
      this.setState({
        specialGoodsInfo: {
          rightFlag: "1", // 为了显示 专区优惠 标识
          activityType: "rechargeMember", // 为了显示模块
          ...(res.lsxdSubMemberInfo || {}),
          realPrice: res.lsxdSubMemberInfo.price,
        },
      });
    });
  }

  // 获取话费充值详情
  fetchPhoneBillDetail() {
    const { totalFee } = getCurrentInstance().router.params;
    fetchPhoneBillDetail({ phoneMoney: totalFee }).then((res) => {
      const { phoneBillInfo = {} } = res;
      this.setState({
        specialGoodsInfo: {
          rightFlag: "1", // 为了显示 专区优惠 标识
          activityType: "rechargeMember", // 为了显示模块
          ...(phoneBillInfo || {}),
          image:
            "https://wechat-config.dakale.net/miniprogram/image/rechargePhone.png",
          oriPrice: phoneBillInfo.totalFee,
          realPrice: phoneBillInfo.totalFee,
        },
      });
    });
  }

  // 话费券/礼包购买详情查询
  fetchGetGiftPackPriceDetail() {
    const { platformGiftId } = getCurrentInstance().router.params;
    fetchGetGiftPackPriceDetail({ platformGiftId, goodsCount: 1 }).then(
      (res) => {
        const { platformGiftPackInfo = {} } = res;
        this.setState({
          specialGoodsInfo: {
            rightFlag: "1", // 为了显示 专区优惠 标识
            activityType: "beanGiftPack", // 为了显示模块
            ...(platformGiftPackInfo || {}),
            image:
              "https://wechat-config.dakale.net/miniprogram/image/coupon_big.png",
            oriPrice: platformGiftPackInfo.giftValue,
            realPrice: platformGiftPackInfo.buyPrice,
          },
        });
      }
    );
  }

  // 会员确认充值 提交订单
  fetchMemberOrderSumbit() {
    const {
      mode,
      productNo,
      virtualProductAccount,
      virtualProductSubType,
      totalFee,
    } = getCurrentInstance().router.params;
    const { useBeanStatus, useBeanType, couponObj } = this.state;
    const { userCouponId, couponType } = couponObj;
    fetchMemberOrderSumbit({
      useBeanType, // 使用卡豆类型
      useBeanStatus, // 是否使用卡豆
      virtualProductType: mode, // 虚拟商品类型 member-会员 phoneBill-话费
      virtualProductId: productNo, // 虚拟商品id mode === member
      virtualProductAccount, // 充值账号
      virtualProductSubType, // 虚拟商品子类型 mode === member
      userCouponObjects: userCouponId // 是否使用优惠券
        ? [
            {
              userCouponId,
              couponType,
            },
          ]
        : [],
      totalFee, // mode === phoneBill 存在
    }).then(({ orderSn, orderType }) => {
      Router({
        routerName: "paySuccess",
        args: {
          orderSn,
          orderType,
        },
        type: "redirectTo",
      });
    });
  }

  // 话费券/礼包
  fetchBeanGiftPackSumbit() {
    const { platformGiftId } = getCurrentInstance().router.params;
    const { useBeanStatus, couponObj } = this.state;
    const { userCouponId, couponType } = couponObj;
    fetchGiftPackPricePay({
      platformGiftId, // 礼包id
      useBeanStatus, // 是否使用卡豆
      goodsCount: 1,
      userCouponObjects: userCouponId // 是否使用优惠券
        ? [
            {
              userCouponId,
              couponType,
            },
          ]
        : [],
    }).then(({ orderSn, orderType }) => {
      Router({
        routerName: "paySuccess",
        args: {
          orderSn,
          orderType,
        },
        type: "redirectTo",
      });
    });
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
    if (
      type === "self" &&
      !["commerceGoods", "beanGiftPack"].includes(activityType)
    ) {
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
          userAddressIndex={userAddressIndex}
          configUserLevelInfo={configUserLevelInfo}
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
      rechargeMember: (
        <Recharge
          data={specialGoodsInfo}
          useScenesType={"rechargeMember"}
          status={useBeanStatus}
          couponObj={couponObj}
          changeBean={this.changeBean.bind(this)}
          computedPrice={this.computedNotUserLevelPayPrice.bind(this)}
          submit={() => {
            this.fetchMemberOrderSumbit();
          }}
        ></Recharge>
      ), // 充值
      beanGiftPack: (
        <BeanGiftPack
          data={specialGoodsInfo}
          useScenesType={"beanGiftPack"}
          status={useBeanStatus}
          couponObj={couponObj}
          changeBean={this.changeBean.bind(this)}
          computedPrice={this.computedNotUserLevelPayPrice.bind(this)}
          submit={() => {
            this.fetchBeanGiftPackSumbit();
          }}
        ></BeanGiftPack>
      ), // 话费券/礼包
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
