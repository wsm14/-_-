import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Nav from "@/relay/components/navigaton";
import Card from "./components/user";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  componentWillUnmount() {}
  componentDidMount() {}
  render() {
    return (
      <Nav backFlag select>
        <View className="community_green_box">
          <View className="community_green_height"></View>
          <View className="community_after_box">
            <Card></Card>
            <View className="community_after_shopHeight"></View>
            
          </View>
        </View>
      </Nav>
    );
  }
}

export default Index;
