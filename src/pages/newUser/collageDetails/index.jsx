import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import { getUserBeanInfo } from "@/server/user";
import Toast from "@/components/public_ui/selectToast";
import router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      list: [{ key: "拼赚中心" }, { key: "我的开团" }, { key: "我的参团" }],
    };
  }
  componentDidShow() {}

  errorToast(e) {}
  render() {
    const { list } = this.state;
    return (
      <View className="collage_box">
       
      </View>
    );
  }
}

export default Index;
