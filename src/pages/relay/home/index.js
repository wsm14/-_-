import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Tabbar from "./components/tabbar";
import Home from "./components/homeInfo";
import OrderList from "./components/orderList";
import Nav from "@/relay/components/navigaton";

import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      count: getCurrentInstance().router.params.count || 0,
    };
  }
  tabbarChange(index) {
    const { count } = this.state;
    if (count === index) {
      return;
    } else {
      this.setState(
        {
          count: index,
        },
        (res) => {
          console.log(this.state);
        }
      );
    }
  }
  componentWillMount() {}
  componentWillUnmount() {}
  componentDidMount() {}
  render() {
    const { count } = this.state;
    const template = {}[count];
    return (
      <View className="home_relay_box">
        <Nav>
          <View className="relay_box_home">
            <View className="relay_box">
              <Home index={count}></Home>
              <OrderList index={count}></OrderList>
              <Tabbar
                list={[
                  { title: "首页", count: 0 },
                  { title: "2", count: 1 },
                  { title: "订单", count: 2 },
                  { title: "4", count: 3 },
                ]}
                change={this.tabbarChange.bind(this)}
                index={count}
              ></Tabbar>
            </View>
          </View>
        </Nav>
      </View>
    );
  }
}

export default Index;
