import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import { getUserBeanInfo } from "@/server/user";
import Toast from "@/components/public_ui/selectToast";
import router from "@/utils/router";
import Card from "./components/card";
import Group from "./components/group";
import { fetchListTogether } from "@/server/user";
import Shop from "./components/shop";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      list: [
        { key: "拼赚中心", val: 0 },
        { key: "我的开团" },
        { key: "我的参团" },
      ],
      selectType: 0,
      userJoinPage: {
        page: 1,
        limit: 10,
      },
      userJoinGroupList: [],
    };
  }
  componentDidMount() {
    this.fetchJoinList();
  }
  fetchJoinList() {
    const { userJoinPage } = this.state;
    fetchListTogether(userJoinPage).then((val) => {
      const { userJoinGroupList = [] } = val;
      this.setState({
        userJoinGroupList: [
          ...this.state.userJoinGroupList,
          ...userJoinGroupList,
        ],
      });
    });
  }
  errorToast(e) {}
  render() {
    const { list, selectType } = this.state;
    const templateCard = { 0: <Card type={0}></Card> }[selectType];
    const temlate = {
      0: (
        <View className="collage_one_margin">
          {list.map((item) => {
            return <Shop data={item} type={0}></Shop>;
          })}
        </View>
      ),
    }[selectType];
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
          {templateCard}
        </View>
        {temlate}
        {/* <Group></Group> */}
      </View>
    );
  }
}

export default Index;
