import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import BeyondLimit from "./components/beyondLimit";
import MakeAgain from "./components/makeAgain";
import MakeAuth from "./components/makeAuth";
import MakeOver from "./components/makeOver";
import MakeRepeat from "./components/makeRepeat";
import MakeFail from "./components/makeFail";
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
      40003: <MakeAgain></MakeAgain>,
      3018: <BeyondLimit></BeyondLimit>,
      5029: <MakeRepeat></MakeRepeat>,
      40012: <MakeOver></MakeOver>,
      "-1": <MakeFail></MakeFail>,
    }[code];
    return <View className="makeError_box">{template}</View>;
  }
}

export default Index;
