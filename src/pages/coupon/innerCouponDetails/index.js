import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";

import "./index.scss";
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidShow() {}

  render() {
    const {} = this.state;

    return <View className="innerCouponDetails_box"></View>;
  }
}

export default Index;
