import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Nav from "@/relay/components/navigaton";
import Card from "./components/user";
import BuyCard from "./components/buyCard";
import GoodsInfo from "./components/goodCard";
import NodeCard from "./components/nodeCard";
import PayCard from "./components/payCard";
import { toast } from "@/common/utils";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      count: 1,
    };
  }
  componentWillUnmount() {}
  componentDidMount() {}
  onChange(type = "add") {
    const { count } = this.state;
    if (type === "add") {
      if (count === 99) {
        return toast("选择数量已到最大值");
      }
      this.setState({
        count: count + 1,
      });
    } else {
      if (count === 1) {
        return toast("选择数量不能为0");
      }
      this.setState({
        count: count - 1,
      });
    }
  }
  render() {
    const { count } = this.state;
    return (
      <Nav backFlag select>
        <View className="community_green_box">
          <View className="community_green_height"></View>
          <View className="community_after_box">
            <Card></Card>
            <View className="community_after_shopHeight"></View>
            <GoodsInfo></GoodsInfo>
            <BuyCard
              onChange={this.onChange.bind(this)}
              count={count}
            ></BuyCard>
            <NodeCard></NodeCard>
            <PayCard></PayCard>
          </View>
        </View>
      </Nav>
    );
  }
}

export default Index;
