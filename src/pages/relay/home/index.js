import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Router from "@/common/router";
import Tabbar from "./components/tabbar";
import Home from "./components/homeInfo";
import OrderList from "./components/orderList";
import Personal from "./components/personal";
import Nav from "@/relay/components/navigaton";

import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      count: getCurrentInstance().router.params.count || 0,
      navHeight: 88,
    };
  }
  tabbarChange(index) {
    // 一键开团
    if (index === 1) {
      Router({
        routerName: "groupCreate",
        args: {
          mode: "add",
        },
      });
      return;
    }
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
    const { count, navHeight } = this.state;
    const template = {}[count];
    const titleArr = ["首页", "一键开团", "订单", "个人中心"];
    return (
      <View className="home_relay_box">
        <Nav
          title={titleArr[count]}
          getHeight={(h) => this.setState({ navHeight: h })}
        ></Nav>
        <View className="relay_box_home">
          <View className="relay_box">
            <Home index={count}></Home>
            <OrderList index={count} navHeight={navHeight}></OrderList>
            {/* 个人中心 */}
            <Personal
              index={count}
              navHeight={navHeight}
              tabbarChange={this.tabbarChange.bind(this)}
            ></Personal>
            <Tabbar
              list={[
                {
                  title: "首页",
                  count: 0,
                  selectIcon: "home_select",
                  icon: "home_noSelect",
                },
                {
                  title: "一键开团",
                  count: 1,
                  selectIcon: "kaituan_Select",
                  icon: "kaituan_Select",
                },
                {
                  title: "订单",
                  count: 2,
                  selectIcon: "good_select",
                  icon: "good_noSelect",
                },
                {
                  title: "个人中心",
                  count: 3,
                  selectIcon: "user_select",
                  icon: "user_noSelect",
                },
              ]}
              change={this.tabbarChange.bind(this)}
              index={count}
            ></Tabbar>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
