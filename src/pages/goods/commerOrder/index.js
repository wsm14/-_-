import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View, Input } from "@tarojs/components";
import { goods } from "@/api/api";
import { httpGet, httpPost } from "@/api/newRequest";
import { toast, backgroundObj, goBack, redirectTo } from "@/common/utils";
import { fetchAddressList } from "@/server/relay";
import PayBean from "@/components/stopBean";
import { inject, observer } from "mobx-react";
import ButtonView from "@/components/Button";
import { fakeCommerceGoods } from "@/server/goods";
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
        merchantId: getCurrentInstance().router.params.merchantId,
        specialActivityId: getCurrentInstance().router.params.specialActivityId,
        goodsCount: 1,
      },
      useBeanStatus: "1",
      useBeanType: "reward",
      specialGoodsInfo: {},
      userAddressList: [],
      userAddressIndex: -1,
      userAddress: {
        userAddressId: "",
      },
      remark: "",
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
    this.fetchAddress();
  }
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
            if (data) {
              this.setState({
                userAddress: { ...data },
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
        const { specialGoodsInfo } = res;
        this.setState({
          specialGoodsInfo,
        });
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
      return (userBean / 100).toFixed(2);
    }
  }
  saveKolGoodsOrder() {
    const {
      useBeanStatus,
      useBeanType,
      specialGoodsInfo: { ownerIdString, rightFlag },
      httpData: { merchantId, specialActivityId, goodsCount },
      remark,
      userAddress,
    } = this.state;
    const { shareType } = this.props.store.authStore;
    const { shareUserId, shareUserType, sourceKey, sourceType } = shareType;
    const { userAddressId = "" } = userAddress;
    if (!userAddressId) {
      return toast("请完善收货地址");
    }
    fakeCommerceGoods({
      ownerId: ownerIdString,
      useBeanStatus,
      useBeanType,
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
    }).then((val) => {
      const { orderSn, status, orderType } = val;
      this.setState({
        visible: false,
      });
      if (status === "1") {
        return redirectTo(
          `/pages/goods/code_scanPay_Susccess/index?orderSn=${orderSn}&merchantId=${merchantId}`
        );
      } else {
        return redirectTo(
          `/pages/goods/code_wx_pay/index?orderSn=${orderSn}&orderType=${orderType}&merchantId=${merchantId}`
        );
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
      return (Number(realPrice) * goodsCount - userBean / 100).toFixed(2);
    } else {
      return (Number(realPrice) * goodsCount).toFixed(2);
    }
  }

  render() {
    const {
      specialGoodsInfo,
      visible,
      specialGoodsInfo: {
        goodsImg,
        goodsName,

        userBean,

        paymentModeObject = {},
      },
      httpData: { goodsCount },
      useBeanType,
      useBeanStatus,
      configUserLevelInfo,
      userAddress = {},
      userAddressList,
      userAddressIndex,
    } = this.state;
    const { userAddressId, address, addressName, mobile } = userAddress;

    const templateAddress = () => {
      if (!userAddressId) {
        return (
          <View className="commerOrder_address">
            <View className="commerOrder_address_icon"></View>
            <View className="commerOrder_address_content font_hide">
              <View className="commerOrder_address_sh">
                完善收货信息才可以发货哦{" "}
              </View>
            </View>
            <View
              className="commerOrder_address_link"
              onClick={() =>
                Router({
                  routerName: "delivery",
                  args: {
                    selectIndex: userAddressIndex,
                  },
                })
              }
            >
              去完善
            </View>
          </View>
        );
      } else {
        return (
          <View className="commerOrder_address">
            <View className="commerOrder_address_icon"></View>
            <View className="commerOrder_address_content">
              <View className="commerOrder_address_user font_hide">
                <Text className="color1 font32 font_hide">{addressName}</Text>
                <Text className="color2 font24 commerOrder_address_mobile">
                  {mobile}
                </Text>
              </View>
              <View className="commerOrder_address_details">{address}</View>
            </View>
            <View
              className="commerOrder_address_link"
              onClick={() =>
                Router({
                  routerName: "delivery",
                  args: {
                    selectIndex: userAddressIndex,
                  },
                })
              }
            >
              修改
            </View>
          </View>
        );
      }
    };
    const { bean = 0, cash = 0 } = paymentModeObject;
    if (Object.keys(specialGoodsInfo).length > 0) {
      return (
        <View className="commerOrder_box">
          {templateAddress()}
          <View className="commerOrder_shop_card">
            <View
              className="commerOrder_shop_img"
              style={backgroundObj(goodsImg)}
            ></View>
            <View className="commerOrder_shop_content">
              <View className="commerOrder_shop_name font_noHide">
                {goodsName}
              </View>
              <View className="commerOrder_shop_count">数量：1</View>
            </View>
          </View>
          <SelectBean
            fn={this.useBean.bind(this)}
            useBeanType={useBeanType}
            data={specialGoodsInfo}
            configUserLevelInfo={configUserLevelInfo}
            useBeanStatus={useBeanStatus}
          ></SelectBean>
          <View className="commerOrder_pay_info">
            <View className="commerOrder_pay_title">购买须知</View>
            <View className="commerOrder_pay_desc">
              1. 商品将在用户下单后的7天内发货，具体发货物流以订单中的信息为准；
            </View>
            <View className="commerOrder_pay_desc">
              2. 请仔细填写收货信息，以防导致地址错误，快递丢失；
            </View>
            <View className="commerOrder_pay_desc">
              3. 如有其他疑问，请联系客服400-800-5881。
            </View>
          </View>
          <View className="order_input">
            <View className="order_input_label">备注</View>
            <View className="order_input_body">
              <Input
                onBlur={(e) => {
                  this.setState({
                    remark: e.detail.value,
                  });
                }}
                placeholder="填写购买的商品备注信息，如尺码规格等（选填）"
              ></Input>
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
              content={`是否确认使用${userBean}卡豆支付？`}
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
