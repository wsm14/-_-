import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import "./index.scss";
import { toast } from "@/common/utils";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    return <View className="shareActive_box"></View>;
  }
}
export default Index;
