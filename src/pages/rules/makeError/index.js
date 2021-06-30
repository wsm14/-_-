import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import BeyondLimit from "./components/beyondLimit";
import MakeAgain from "./components/makeAgain";
import MakeAuth from "./components/makeAuth";
import MakeOver from "./components/makeOver";
import MakeRepeat from "./components/makeRepeat";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      code: Taro.getCurrentInstance().router.params.code,
    };
  }
  componentWillUnmount() {}
  componentDidMount() {}
  render() {
    const { code } = this.state;
    const template = {
      10086: <MakeAuth></MakeAuth>,
    }[code];
    return <View className="makeError_box">{template}</View>;
  }
}

export default Index;
