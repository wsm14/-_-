import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import { getUserBeanInfo } from "@/server/user";
import Toast from "@/components/public_ui/selectToast";
import router from "@/utils/router";
import Card from "./components/card";
import Group from "./components/group";
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
        <View className="collage_top_info">
          <View className="collage_select_box">
            {list.map((item, index) => {
              return (
                <View
                  className={`collage_select ${
                    index === 0
                      ? "collage_select_style2"
                      : "collage_select_style1"
                  }`}
                >
                  {item.key}
                </View>
              );
            })}
          </View>
          <Card type={1}></Card>
        </View>
        <Group></Group>
      </View>
    );
  }
}

export default Index;
