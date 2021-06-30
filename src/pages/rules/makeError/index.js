import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { getShareNewYearSpecialActivity } from "@/server/share";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  toast,
  navigateTo,
} from "@/common/utils";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  componentWillUnmount() {}
  componentDidMount() {}
  render() {
    const {} = this.state;
    return <View className="makeError_box"></View>;
  }
}

export default Index;
