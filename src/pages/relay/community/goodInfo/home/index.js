import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Nav from "@/relay/components/navigaton";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  componentWillUnmount() {}
  componentDidMount() {}
  render() {
    const { count } = this.state;
    return <Nav></Nav>;
  }
}

export default Index;
