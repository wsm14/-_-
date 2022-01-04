import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Template from "./components/realTemplate";
import { fetchRealNameInfo } from "@/server/perimeter";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      realNameInfo: {},
    };
  }
  fetchRealName() {
    fetchRealNameInfo().then((val) => {
      const { realNameInfo = {} } = val;
      this.setState({
        realNameInfo,
      });
    });
  }
  componentWillUnmount() {}
  componentDidShow() {
    this.fetchRealName();
  }
  render() {
    const { realNameInfo } = this.state;
    return <Template data={realNameInfo}></Template>;
  }
}

export default Index;
