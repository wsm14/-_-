import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { inject, observer } from "mobx-react";
import {} from "@/server/goods";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: { ...getCurrentInstance().router.params },
      orderResult: {},
      visible: false,
      configNewcomerOrdersInfo: {},
      configUserLevelInfo: {},
    };
  }

  render() {
    const {
      orderResult,
      orderResult: { orderType = "specialGoods", beanFee },
      visible,
      configUserLevelInfo,
      configNewcomerOrdersInfo,
    } = this.state;
    const { beanLimitStatus } = this.props.store.homeStore;
    const { beanLimit } = this.props.store.commonStore;
    const template = {}[orderType];
    return <View className="payWeex_box"></View>;
  }
}

export default Index;
