import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import SpecalTemplate from "./components/template/specialTemplate";
import CommerceTemplate from "./components/template/commerceTemplate";
import ScanTemplate from "./components/template/scanTemplate";
import CommunityTemplate from "./components/template/communityTemplate";
import PlatfromGift from "./components/template/platformGiftTemplate";
import { fetchOrderDetails } from "@/server/goods";
import { fakeRemoveOrder, fakeUpdateOrder } from "@/server/goods";
import { filterGoods, goBack, toast } from "@/utils/utils";
import RecommendSpecal from "@/components/public_ui/specalActive";
import { inject, observer } from "mobx-react";
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
      orderInfo: {},
      telVisible: false,
      configUserLevelInfo: {},
    };
  }
  getGoodsDetails() {
    const { httpData } = this.state;
    fetchOrderDetails(httpData).then((val) => {
      const { orderInfo } = val;
      this.setState({
        orderInfo: filterGoods(orderInfo),
      });
    });
  }
  deleteOrderSn() {
    const { httpData, orderInfo } = this.state;
    fakeRemoveOrder(httpData).then((val) => {
      console.log(this.props);
      this.props.store.goodsStore.deleteList(orderInfo, "orderSn");
      this.setState(
        {
          orderInfo: {},
        },
        (res) => {
          goBack(() => toast("删除成功"));
        }
      );
    });
  }

  componentDidMount() {
    this.getGoodsDetails();
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
      payBeanCommission: data.preferentialActivityRuleObject.payBeanCommission,
    });
  }
  componentWillUnmount() {
    let that = this;
    const { orderInfo } = this.state;
    const { orderType } = orderInfo;
    if (orderType === "communityGoods") {
      return;
    }
    that.props.store.goodsStore.updateList(orderInfo, "orderSn");
  }
  render() {
    const { orderInfo, telVisible, status, configUserLevelInfo } = this.state;
    const { orderType } = orderInfo;

    const templateSpecal = (
      <SpecalTemplate
        closeTelPhone={() => {
          this.setState({
            telVisible: false,
          });
        }}
        style={status === "6" ? { margin: `${Taro.pxTransform(24)} auto` } : {}}
        deleteOrderSn={this.deleteOrderSn.bind(this)}
        open={() => {
          this.setState({
            telVisible: true,
          });
        }}
        reload={this.getGoodsDetails.bind(this)}
        show={telVisible}
        //显示拨打电话
        data={orderInfo}
      ></SpecalTemplate>
    );
    const templateCommerce = (
      <CommerceTemplate
        deleteOrderSn={this.deleteOrderSn.bind(this)}
        style={status === "6" ? { margin: `${Taro.pxTransform(24)} auto` } : {}}
        data={orderInfo}
        reload={this.getGoodsDetails.bind(this)}
      ></CommerceTemplate>
    );
    const templateScan = (
      <ScanTemplate
        style={status === "6" ? { margin: `${Taro.pxTransform(24)} auto` } : {}}
        data={orderInfo}
        reload={this.getGoodsDetails.bind(this)}
      ></ScanTemplate>
    );
    const templateCommunity = (
      <CommunityTemplate data={orderInfo}></CommunityTemplate>
    );
    const templatePlatfromGift = (
      <PlatfromGift
        style={status === "6" ? { margin: `${Taro.pxTransform(24)} auto` } : {}}
        data={orderInfo}
        reload={this.getGoodsDetails.bind(this)}
      ></PlatfromGift>
    );
    const templateVirtualProduct = (
      <ScanTemplate
        style={status === "6" ? { margin: `${Taro.pxTransform(24)} auto` } : {}}
        data={orderInfo}
        hasMerchant={false}
        reload={this.getGoodsDetails.bind(this)}
      ></ScanTemplate>
    );
    const template = {
      reduceCoupon: templateSpecal,
      rightGoods: templateSpecal,
      specialGoods: templateSpecal,
      rightCoupon: templateSpecal,
      rightGoods: templateSpecal,
      //包含核销码的订单渲染模板
      commerceGoods: templateCommerce,
      //电商订单渲染模板
      scan: templateScan,
      //扫码订单渲染模板
      communityGoods: templateCommunity,
      platformGift: templatePlatfromGift,
      virtualProduct: templateVirtualProduct,
    }[orderType];

    return (
      <View className="orderDetails_box">
        {template}
        <RecommendSpecal
          current={true}
          userInfo={configUserLevelInfo}
        ></RecommendSpecal>
      </View>
    );
  }
}
export default Index;
