import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Bottom from "./conponents/bottomAddress";
import EditAddress from "./conponents/editAddress";
import Template from "./conponents/template";

import "./index.scss";
import { toast } from "@/common/utils";
import { navigatePostBack } from "@/relay/common/hooks";

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  componentWillUnmount() {}
  componentDidMount() {}

  //获取地址列表
  render() {
    return <View className="delivery_box"></View>;
  }
}

export default Index;
