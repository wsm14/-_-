import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { fetchResourceTemplate } from "@/server/common";
import HotExchange from "./components/exchangeTemplate";
import Hotmetal from "./components/hotMetal";
import Rebate from "./components/rebate";
import Resource from "./components/resource";
import ListTemplate from "./components/listTemplate";
import Brand from "./components/Brand";
import { setNavTitle } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      data: {},
      title: {
        hotBlending: "限时热兑",
        coupon: "限时神券",
        deduction: "超值抵扣专区",
        flashSale: "今日秒杀",
        listTemplate: "发现好货",
        travel: "酷爱旅行",
        brand: "大牌连锁",
      },
    };
  }

  componentWillMount() {}
  linkToSpecal(item) {
    const { specialGoodsId, ownerIdString } = item;
    const { httpData } = this.state;
    const { identification } = httpData;
    Router({
      routerName: "favourableDetails",
      args: {
        merchantId: ownerIdString,
        specialActivityId: specialGoodsId,
        identification,
      },
    });
  }
  linkToCoupon = (item) => {
    const { httpData } = this.state;
    const { identification } = httpData;
    const { platformCouponId, useScenesType, classType } = item;
    Router({
      routerName: "increase",
      args: {
        platformCouponId,
        useScenesType,
        classType,
        identification,
      },
    });
  };
  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  fetchResourceTemplate() {
    const { httpData, title } = this.state;
    fetchResourceTemplate(httpData).then((val) => {
      const { templateType } = val;
      this.setState({
        data: { ...val },
      });
      setNavTitle(title[templateType]);
    });
  }
  componentDidMount() {
    this.fetchResourceTemplate();
  }

  render() {
    const { data, httpData } = this.state;
    const { templateType, contentInfo = {} } = data;
    const { payBeanCommission, identification } = httpData;
    const {
      mixedList = [],
      selfTourGoods = [],
      brandSelfTravel = [],
    } = contentInfo;
    const template = {
      hotBlending: (
        <HotExchange
          payBeanCommission={payBeanCommission}
          onChange={this.linkToSpecal.bind(this)}
          reload={this.fetchResourceTemplate.bind(this)}
          data={data}
        ></HotExchange>
      ),
      coupon: (
        <Hotmetal
          reload={this.fetchResourceTemplate.bind(this)}
          onChange={this.linkToCoupon.bind(this)}
          data={data}
        ></Hotmetal>
      ),
      deduction: (
        <Rebate
          configUserLevelInfo={{ payBeanCommission }}
          identification={identification}
          reload={this.fetchResourceTemplate.bind(this)}
          onChange={this.linkToSpecal.bind(this)}
          data={data}
        ></Rebate>
      ),
      flashSale: (
        <Resource
          onChange={this.linkToSpecal.bind(this)}
          payBeanCommission={payBeanCommission}
          data={data}
        ></Resource>
      ),
      listTemplate: (
        <ListTemplate
          configUserLevelInfo={{ payBeanCommission }}
          identification={identification}
          payBeanCommission={payBeanCommission}
          list={mixedList}
          data={data}
        ></ListTemplate>
      ),
      travel: (
        <ListTemplate
          configUserLevelInfo={{ payBeanCommission }}
          identification={identification}
          list={selfTourGoods}
          payBeanCommission={payBeanCommission}
          data={data}
        ></ListTemplate>
      ),
      brand: (
        <Brand
          configUserLevelInfo={{ payBeanCommission }}
          identification={identification}
          list={brandSelfTravel}
          payBeanCommission={payBeanCommission}
          data={data}
        ></Brand>
      ),
    }[templateType];
    if (template) {
      return template;
    }
    return null;
  }
}

export default Index;
