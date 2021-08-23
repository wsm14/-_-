import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Tabbar from "./components/tabbar";
import Test from "./components/homeInfo";
import Nav from "@/relay/components/navigaton";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      count: 0,
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
  componentWillUnmount() {}
  componentDidMount() {}
  render() {
    const { count } = this.state;
    const template = {}[count];
    return (
      <Nav>
        <View className="relay_box">
          <Test></Test>
          <Tabbar
            list={[
              { title: "1", count: 0 },
              { title: "2", count: 1 },
              { title: "3", count: 2 },
              { title: "4", count: 3 },
            ]}
            change={this.tabbarChange.bind(this)}
            index={count}
          ></Tabbar>
        </View>
      </Nav>
    );
  }
}

export default Index;
