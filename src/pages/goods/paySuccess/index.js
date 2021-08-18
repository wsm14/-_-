import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { goods } from "@/api/api";
import { httpGet, httpPost } from "@/api/newRequest";
import { getConfigNewcomerOrders } from "@/server/goods";
import {
  toast,
  backgroundObj,
  filterActive,
  goBack,
  switchTab,
  filterGoods,
} from "@/common/utils";
import { fetchUserShareCommission } from "@/server/index";
import Title from "./components/goodsTitle";
import ShopCard from "./components/descriptionCard";
import Router from "@/common/router";
import Toast from "@/components/paySuccess";
import { inject, observer } from "mobx-react";
import RecommendCoupon from "@/components/couponActive";
import RecommendSpecal from "@/components/specalActive";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        orderSn: getCurrentInstance().router.params.orderSn,
      },
      orderResult: {},
      visible: false,
      configNewcomerOrdersInfo: {},
      configUserLevelInfo: {},
    };
  }

  componentWillUnmount() {
    if (!getCurrentInstance().router.params.orderSn) {
      goBack();
    }
  }
  componentDidMount() {
    this.fetchConfigNewcomerOrders();
    this.fetchUserShareCommission();
  }
  componentDidShow() {
    this.getOrderResult();
  }
  getOrderResult() {
    const { getOrderResult } = goods;
    httpGet(
      {
        data: this.state.httpData,
        url: getOrderResult,
      },
      (res) => {
        const { orderResult } = res;
        console.log(filterGoods(orderResult));
        this.setState({
          orderResult: filterGoods(orderResult),
        });
      }
    );
  }
  goGoodsDetails() {
    const {
      orderResult: { orderSn },
    } = this.state;
    Router({
      routerName: "kolShopGoods",
      args: {
        orderSn: orderSn,
      },
    });
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  fetchConfigNewcomerOrders() {
    getConfigNewcomerOrders({}, (res) => {
      const { configNewcomerOrdersInfo = {} } = res;
      const { taskStatus = "2" } = configNewcomerOrdersInfo;
      this.setState(
        {
          configNewcomerOrdersInfo: { ...configNewcomerOrdersInfo, taskStatus },
        },
        (res) => {
          const { beanLimitStatus } = this.props.store.homeStore;
          if (
            taskStatus === "0" ||
            taskStatus === "1" ||
            beanLimitStatus === "1"
          ) {
            this.setState({ visible: true });
          }
        }
      );
    });
  }
  onError(msg) {}
  render() {
    const {
      orderResult,
      orderResult: { orderType = "specialGoods", beanFee },
      visible,
      configUserLevelInfo,
      configNewcomerOrdersInfo,
    } = this.state;
    const { beanLimitStatus } = this.props.store.homeStore;
    return (
      <View className="pay_details_payDetails">
        <Title></Title>
        <ShopCard
          visible={visible}
          fn={() => this.getOrderResult()}
          data={orderResult}
        ></ShopCard>
        <View className="pay_goGoods public_center">
          <View className="color8 font24">
            可在卡包和订单详情中查看
            {orderType === "specialGoods" ? "商品" : "券"}详细情况
          </View>
          <View
            className="pay_goods_btn color4 font28 public_center"
            onClick={() => this.goGoodsDetails()}
          >
            查看订单
          </View>
        </View>
        <Toast
          data={configNewcomerOrdersInfo}
          show={visible}
          beanLimitStatus={beanLimitStatus}
          visible={() => {
            this.setState({
              visible: false,
            });
          }}
        ></Toast>
        {orderType === "specialGoods" ? (
          <RecommendSpecal
            current={true}
            userInfo={configUserLevelInfo}
          ></RecommendSpecal>
        ) : (
          <RecommendCoupon
            current={true}
            userInfo={configUserLevelInfo}
          ></RecommendCoupon>
        )}
      </View>
    );
  }
}

export default Index;
